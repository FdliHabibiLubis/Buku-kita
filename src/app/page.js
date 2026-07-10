"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookCard from "@/components/BookCard";

export default function HomePage() {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [booksLoading, setBooksLoading] = useState(true);

  // Load data buku
  useEffect(() => {
    async function loadBooks() {
      try {
        const res = await fetch("/api/books");
        if (res.ok) {
          const data = await res.json();
          setBooks(data.books);
        }
      } catch (err) {
        console.error("Load books error:", err);
      } finally {
        setBooksLoading(false);
      }
    }
    loadBooks();
  }, []);

  const recommendedBooks = books.filter((b) => b.is_recommended);
  const topBooks = books.filter((b) => b.is_top);
  const newestBooks = books.filter((b) => b.is_new);
  const choiceBooks = books.filter((b) => b.is_choice);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* SideNavBar */}
        <aside className="hidden lg:flex flex-col gap-2 p-2 h-[calc(100vh-80px)] w-64 bg-white border-r-[3px] border-black shadow-[3px_0px_0px_0px_#000000] sticky top-20 overflow-y-auto">
          <div className="p-3 mb-2">
            <h2 className="text-lg font-headline font-bold text-primary">Kategori</h2>
            <p className="text-xs font-headline font-bold text-on-surface-variant opacity-70">Jelajahi Koleksi</p>
          </div>
          <nav className="flex flex-col gap-3">
            <Link
              href="/kategori?category=Buku"
              className="flex items-center gap-4 p-3 bg-secondary-container text-on-secondary-container border-[1.5px] border-black shadow-[3px_3px_0px_0px_#000000] transition-all transform active:scale-95 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#000000]"
            >
              <span className="material-symbols-outlined">menu_book</span>
              <span className="text-xs font-headline font-bold uppercase">Buku</span>
            </Link>
            <Link
              href="/kategori?category=Ebook"
              className="flex items-center gap-4 p-3 text-on-surface-variant hover:bg-zinc-100 border-[1.5px] border-transparent hover:border-black hover:shadow-[3px_3px_0px_0px_#000000] transition-all"
            >
              <span className="material-symbols-outlined">auto_stories</span>
              <span className="text-xs font-headline font-bold uppercase">Ebook</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content Canvas */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 bg-background-custom">
          {/* Hero Section */}
          <section className="mb-6">
            <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-primary mb-2 uppercase tracking-tighter">
              Buku Kita
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-secondary-container text-on-secondary-container px-3 py-1 border-[1.5px] border-black font-headline font-bold text-[10px] uppercase shadow-[1.5px_1.5px_0px_#000]">
                FREE BOOK PORTAL
              </span>
              <span className="bg-primary text-on-primary px-3 py-1 border-[1.5px] border-black font-headline font-bold text-[10px] uppercase shadow-[1.5px_1.5px_0px_#000]">
                100% GRATIS BACA VIA GOOGLE BOOKS
              </span>
            </div>
          </section>

          {booksLoading ? (
            <div className="py-20 text-center font-headline font-bold uppercase text-on-surface-variant">
              Memuat data buku...
            </div>
          ) : (
            <>
              {/* Buku Rekomendasi Section */}
              <section className="mb-10">
                <div className="flex justify-between items-end mb-4 border-b-[3px] border-black pb-2">
                  <h2 className="text-lg md:text-xl font-headline font-bold text-primary uppercase">
                    Buku Rekomendasi
                  </h2>
                  <Link
                    href="/kategori"
                    className="text-xs font-headline font-bold underline decoration-4 underline-offset-4 hover:text-primary transition-colors"
                  >
                    Lihat Semua
                  </Link>
                </div>
                {recommendedBooks.length === 0 ? (
                  <p className="text-xs opacity-75 font-body">Tidak ada buku rekomendasi saat ini.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-4">
                    {recommendedBooks.slice(0, 7).map((book) => (
                      <BookCard key={book.id} book={book} />
                    ))}
                  </div>
                )}
              </section>

              {/* Top Buku Terbaik Section */}
              <section className="mb-10">
                <div className="flex justify-between items-end mb-4 border-b-[3px] border-black pb-2">
                  <h2 className="text-lg md:text-xl font-headline font-bold text-primary uppercase">
                    Top Buku Terbaik
                  </h2>
                  <Link
                    href="/kategori"
                    className="text-xs font-headline font-bold underline decoration-4 underline-offset-4 hover:text-primary transition-colors"
                  >
                    Lihat Semua
                  </Link>
                </div>
                {topBooks.length === 0 ? (
                  <p className="text-xs opacity-75 font-body">Tidak ada buku teratas saat ini.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-4">
                    {topBooks.slice(0, 7).map((book) => (
                      <BookCard key={book.id} book={book} />
                    ))}
                  </div>
                )}
              </section>

              {/* Buku Terbaru Section */}
              <section className="mb-10">
                <div className="flex justify-between items-end mb-4 border-b-[3px] border-black pb-2">
                  <h2 className="text-lg md:text-xl font-headline font-bold text-primary uppercase">
                    Buku Terbaru
                  </h2>
                  <Link
                    href="/kategori"
                    className="text-xs font-headline font-bold underline decoration-4 underline-offset-4 hover:text-primary transition-colors"
                  >
                    Lihat Semua
                  </Link>
                </div>
                {newestBooks.length === 0 ? (
                  <p className="text-xs opacity-75 font-body">Tidak ada buku baru saat ini.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-4">
                    {newestBooks.slice(0, 7).map((book) => (
                      <BookCard key={book.id} book={book} />
                    ))}
                  </div>
                )}
              </section>

              {/* Buku Pilihan Section */}
              <section className="mb-10">
                <div className="flex justify-between items-end mb-4 border-b-[3px] border-black pb-2">
                  <h2 className="text-lg md:text-xl font-headline font-bold text-primary uppercase">
                    Buku Pilihan
                  </h2>
                  <Link
                    href="/kategori"
                    className="text-xs font-headline font-bold underline decoration-4 underline-offset-4 hover:text-primary transition-colors"
                  >
                    Lihat Semua
                  </Link>
                </div>
                {choiceBooks.length === 0 ? (
                  <p className="text-xs opacity-75 font-body">Tidak ada buku pilihan saat ini.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-4">
                    {choiceBooks.slice(0, 7).map((book) => (
                      <BookCard key={book.id} book={book} />
                    ))}
                  </div>
                )}
              </section>
            </>
          )}

          {/* Promo Spesial Section (Disunting agar bertema baca gratis) */}
          <section id="promo" className="mb-10 pt-4">
            <h2 className="text-lg md:text-xl font-headline font-bold text-primary uppercase mb-4 border-b-[3px] border-black pb-2">
              Koleksi &amp; Akses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-primary text-white border-[3px] border-black neobrutal-shadow p-5 flex flex-col justify-between hover:scale-[1.01] transition-transform">
                <div>
                  <h3 className="text-base font-headline font-bold mb-2 uppercase">100% Gratis Baca</h3>
                  <p className="text-xs opacity-90 mb-4 font-body leading-relaxed">
                    Seluruh buku dalam katalog kami dapat dibaca gratis. Kami menghubungkan Anda langsung dengan Google Books untuk membaca sampel lengkap atau edisi gratisnya!
                  </p>
                </div>
                <button
                  onClick={() => router.push("/kategori")}
                  className="bg-secondary-container text-on-secondary-container border-[3px] border-black py-3 px-4 font-headline font-bold text-xs uppercase neobrutal-shadow-sm active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                >
                  Mulai Membaca
                </button>
              </div>

              <div className="bg-primary-container text-white border-[3px] border-black neobrutal-shadow p-5 flex flex-col justify-between hover:scale-[1.01] transition-transform">
                <div>
                  <h3 className="text-base font-headline font-bold mb-2 uppercase">Simpan Favorit Anda</h3>
                  <p className="text-xs opacity-90 mb-4 font-body leading-relaxed">
                    Daftarkan akun gratis untuk menyimpan buku-buku yang sedang Anda baca ke rak buku favorit pribadi Anda dan memberikan rating bintang!
                  </p>
                </div>
                <button
                  onClick={() => router.push("/login")}
                  className="bg-secondary-container text-on-secondary-container border-[3px] border-black py-3 px-4 font-headline font-bold text-xs uppercase neobrutal-shadow-sm active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                >
                  Masuk / Daftar Akun
                </button>
              </div>

              <div className="bg-primary text-white border-[3px] border-black neobrutal-shadow p-5 flex flex-col justify-between hover:scale-[1.01] transition-transform">
                <div>
                  <h3 className="text-base font-headline font-bold mb-2 uppercase">Google Books Integration</h3>
                  <p className="text-xs opacity-90 mb-4 font-body leading-relaxed">
                    Kami mendukung penuh integrasi ke layanan Google Books, memastikan kualitas teks terbaik dan resmi langsung dari penerbit.
                  </p>
                </div>
                <button
                  onClick={() => window.open("https://books.google.com", "_blank")}
                  className="bg-secondary-container text-on-secondary-container border-[3px] border-black py-3 px-4 font-headline font-bold text-xs uppercase neobrutal-shadow-sm active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                >
                  Kunjungi Google Books
                </button>
              </div>
            </div>
          </section>

          {/* Alamat / Kontak Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10" id="kontak">
            <div className="bg-white border-[3px] border-black neobrutal-shadow p-5">
              <h3 className="text-base font-headline font-bold text-primary uppercase mb-2">Hubungi Kami</h3>
              <p className="text-xs font-body text-on-surface mb-1">JL. Mangaan V LK XIII Mabar</p>
              <p className="text-xs font-body text-on-surface mb-1">Habibifadli682@gmail.com</p>
              <p className="text-xs font-body text-on-surface mb-3">+62 823-6943-6342</p>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-secondary-container border-[3px] border-black flex items-center justify-center shadow-[2px_2px_0px_#000]">
                  <span className="material-symbols-outlined font-bold">map</span>
                </div>
                <div className="w-12 h-12 bg-primary text-on-primary border-[3px] border-black flex items-center justify-center shadow-[2px_2px_0px_#000]">
                  <span className="material-symbols-outlined font-bold">call</span>
                </div>
              </div>
            </div>

            <div className="bg-white border-[3px] border-black neobrutal-shadow p-5 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#00327d_2px,transparent_1px)] [background-size:20px_20px]"></div>
              <div className="text-center relative">
                <span className="material-symbols-outlined text-4xl text-primary mb-2">auto_stories</span>
                <h4 className="text-sm font-headline font-bold uppercase">Langganan Newsletter</h4>
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    placeholder="email@kamu.com"
                    className="border-[3px] border-black px-4 py-2 font-headline font-bold text-xs uppercase focus:outline-none focus:ring-0 bg-white"
                  />
                  <button
                    onClick={() => alert("Terima kasih telah berlangganan!")}
                    className="bg-primary text-white border-[3px] border-black px-4 py-2 font-headline font-bold text-xs uppercase shadow-[2px_2px_0px_#000] hover:translate-x-[0.5px] hover:translate-y-[0.5px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                  >
                    Join
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}
