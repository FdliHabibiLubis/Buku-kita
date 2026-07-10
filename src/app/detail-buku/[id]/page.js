"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function DetailBukuPage({ params: paramsPromise }) {
  const router = useRouter();
  const params = React.use(paramsPromise);
  const { id } = params;

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rating & Favorite states (Klien/LocalStorage saja)
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // 1. Fetch Detail Buku
  useEffect(() => {
    async function loadBook() {
      try {
        const resBook = await fetch(`/api/books/${id}`);
        if (resBook.ok) {
          const dataBook = await resBook.json();
          setBook(dataBook.book);
        } else {
          setBook(null);
        }
      } catch (err) {
        console.error("Load detail book error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadBook();
  }, [id]);

  // 2. Load Rating & Favorite dari LocalStorage (Client-only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Load Favorite
      const favs = JSON.parse(localStorage.getItem("bukukita_favs") || "[]");
      setIsFavorite(favs.includes(Number(id)));

      // Load User Rating
      const ratings = JSON.parse(localStorage.getItem("bukukita_ratings") || "{}");
      setUserRating(ratings[id] || 0);
    }
  }, [id]);

  const handleRate = (rateValue) => {
    try {
      const ratings = JSON.parse(localStorage.getItem("bukukita_ratings") || "{}");
      ratings[id] = rateValue;
      localStorage.setItem("bukukita_ratings", JSON.stringify(ratings));
      setUserRating(rateValue);
      alert(`Terima kasih! Anda memberikan rating bintang ${rateValue} secara lokal.`);
    } catch (err) {
      console.error("Gagal menyimpan rating:", err);
    }
  };

  const handleFavoriteToggle = () => {
    try {
      const favs = JSON.parse(localStorage.getItem("bukukita_favs") || "[]");
      let nextFavs;
      if (favs.includes(Number(id))) {
        nextFavs = favs.filter((x) => x !== Number(id));
        setIsFavorite(false);
      } else {
        nextFavs = [...favs, Number(id)];
        setIsFavorite(true);
      }
      localStorage.setItem("bukukita_favs", JSON.stringify(nextFavs));
    } catch (err) {
      console.error("Gagal menyimpan favorit:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center font-headline font-bold text-base uppercase">
          Memuat detail buku...
        </div>
        <Footer />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
          <span className="material-symbols-outlined text-6xl text-red-600 mb-2">error</span>
          <h2 className="text-xl font-headline font-bold uppercase text-red-600">Buku Tidak Ditemukan</h2>
          <Link
            href="/"
            className="mt-4 px-4 py-2 border-[3px] border-black bg-primary text-on-primary font-headline font-bold text-xs uppercase neobrutal-shadow-sm"
          >
            Kembali ke Beranda
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const formattedPrice = `Rp. ${book.price.toLocaleString("id-ID")},00`;
  const readUrl = book.google_books_url || `https://books.google.com/books?q=${encodeURIComponent(book.title + " " + book.author)}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 px-4 md:px-8 py-8 bg-background-custom">
        <div className="max-w-5xl mx-auto mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-headline font-bold uppercase underline decoration-2 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined !text-sm">arrow_back</span> Kembali ke Beranda
          </Link>
        </div>

        <div className="max-w-5xl mx-auto bg-white border-[3px] border-black neobrutal-shadow grid grid-cols-1 md:grid-cols-[320px_1fr]">
          {/* Cover Gambar */}
          <div className="border-b-[3px] md:border-b-0 md:border-r-[3px] border-black bg-zinc-100 p-6 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-[240px] aspect-[3/4] border-[3px] border-black shadow-[4px_4px_0px_#000]">
              <img
                src={book.cover_image}
                alt={`Sampul buku ${book.title}`}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Tombol Favorit */}
            <button
              onClick={handleFavoriteToggle}
              className={`mt-6 w-full max-w-[240px] flex items-center justify-center gap-2 py-2 border-[3px] border-black font-headline font-bold text-xs uppercase neobrutal-shadow-sm transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
                isFavorite
                  ? "bg-red-500 text-white"
                  : "bg-white text-black hover:bg-zinc-50"
              }`}
            >
              <span className={`material-symbols-outlined !text-sm ${isFavorite ? "fill-current" : ""}`}>
                favorite
              </span>
              {isFavorite ? "Favorit Saya" : "Tambah ke Favorit"}
            </button>
          </div>

          {/* Info Detail */}
          <div className="p-6 flex flex-col">
            <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
              <div>
                <h1 className="text-2xl md:text-3xl font-headline font-extrabold text-primary uppercase leading-tight">
                  {book.title}
                </h1>
                <h2 className="text-xs font-headline font-bold text-on-surface-variant uppercase mt-1">
                  Karya {book.author}
                </h2>
              </div>
              <span className="bg-secondary-container text-on-secondary-container px-3 py-1 border-[1.5px] border-black font-headline font-bold text-[10px] uppercase shadow-[1px_1px_0px_#000]">
                {book.category}
              </span>
            </div>

            {/* Rating Rata-rata */}
            <div className="flex items-center gap-1.5 mb-2 text-xs font-body">
              <span className="material-symbols-outlined !text-sm text-yellow-500 fill-current">star</span>
              <span className="font-bold text-sm">{book.avg_rating}</span>
              <span className="opacity-60">({book.rating_count} rating dari pembaca)</span>
            </div>

            {/* Informasi Stok */}
            <div className="mb-4">
              {book.stock > 0 ? (
                <span className="bg-green-100 text-green-800 border border-green-400 px-2 py-0.5 font-headline font-bold text-[10px] uppercase">
                  Stok Tersedia: {book.stock}
                </span>
              ) : (
                <span className="bg-red-100 text-red-800 border border-red-400 px-2 py-0.5 font-headline font-bold text-[10px] uppercase">
                  Stok Kosong
                </span>
              )}
            </div>

            <p className="text-xs md:text-sm font-body text-on-surface mb-6 leading-relaxed">
              {book.description || "Tidak ada deskripsi yang tersedia untuk buku ini."}
            </p>

            <p className="text-lg md:text-xl font-headline font-bold text-primary mb-6">
              {formattedPrice}
            </p>

            {/* Berikan Rating Anda */}
            <div className="border-[3px] border-black p-4 bg-zinc-50 mb-6 shadow-[3px_3px_0px_#000] w-full max-w-md">
              <h3 className="text-xs font-headline font-bold uppercase mb-2">Berikan Rating Bintang:</h3>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRate(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-yellow-500 transition-transform duration-100 hover:scale-110 focus:outline-none"
                  >
                    <span
                      className={`material-symbols-outlined !text-2xl ${
                        star <= (hoverRating || userRating) ? "fill-current" : ""
                      }`}
                    >
                      star
                    </span>
                  </button>
                ))}
                {userRating > 0 && (
                  <span className="text-[10px] font-headline font-bold uppercase text-green-700 ml-2">
                    Rating Anda: {userRating} Star
                  </span>
                )}
              </div>
            </div>

            {/* Aksi Tunggal: Baca Buku Gratis */}
            <div className="flex flex-wrap gap-3 mt-auto">
              <a
                href={readUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-on-primary px-6 py-3 border-[3px] border-black neobrutal-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1.5px_1.5px_0px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all uppercase font-headline font-bold text-xs inline-block text-center"
              >
                Baca Buku Gratis
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
