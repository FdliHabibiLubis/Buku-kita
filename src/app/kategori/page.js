"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookCard from "@/components/BookCard";

function KategoriContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryParam = searchParams.get("category") || ""; // default empty (all)
  const searchParam = searchParams.get("search") || "";
  const sortParam = searchParams.get("sort") || "newest";

  const [authLoading, setAuthLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Guard Halaman: Verifikasi Sesi
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/");
        } else {
          setAuthLoading(false);
        }
      } catch (err) {
        router.push("/");
      }
    }
    checkAuth();
  }, [router]);

  // 2. Fetch data buku dari API dengan filter dan sort
  useEffect(() => {
    if (authLoading) return;

    async function loadBooks() {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (categoryParam) query.append("category", categoryParam);
        if (searchParam) query.append("search", searchParam);
        if (sortParam) query.append("sort", sortParam);

        const res = await fetch(`/api/books?${query.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setBooks(data.books);
        }
      } catch (err) {
        console.error("Load books error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadBooks();
  }, [authLoading, categoryParam, searchParam, sortParam]);

  const handleSortChange = (newSort) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    router.push(`/kategori?${params.toString()}`);
  };

  const handleCategoryChange = (newCat) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newCat) {
      params.set("category", newCat);
    } else {
      params.delete("category");
    }
    router.push(`/kategori?${params.toString()}`);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-custom font-headline font-bold text-lg uppercase tracking-wider">
        Memverifikasi sesi...
      </div>
    );
  }

  // Tentukan judul halaman
  let title = "Semua Koleksi";
  if (categoryParam === "Buku") title = "Koleksi Buku";
  if (categoryParam === "Ebook") title = "Koleksi Ebook";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* SideNavBar */}
        <aside className="hidden lg:flex flex-col gap-2 p-2 h-[calc(100vh-80px)] w-64 bg-white border-r-[3px] border-black shadow-[3px_0px_0px_0px_#000000] sticky top-20 overflow-y-auto">
          <div className="p-3 mb-2">
            <h2 className="text-lg font-headline font-bold text-primary">Kategori</h2>
            <p className="text-xs font-headline font-bold text-on-surface-variant opacity-70">Saring Koleksi</p>
          </div>
          <nav className="flex flex-col gap-3">
            <button
              onClick={() => handleCategoryChange("")}
              className={`flex items-center gap-4 p-3 transition-all text-left ${
                !categoryParam
                  ? "bg-secondary-container text-on-secondary-container border-[1.5px] border-black shadow-[3px_3px_0px_0px_#000]"
                  : "text-on-surface-variant hover:bg-zinc-100 border-[1.5px] border-transparent"
              }`}
            >
              <span className="material-symbols-outlined">library_books</span>
              <span className="text-xs font-headline font-bold uppercase">Semua Kategori</span>
            </button>
            <button
              onClick={() => handleCategoryChange("Buku")}
              className={`flex items-center gap-4 p-3 transition-all text-left ${
                categoryParam === "Buku"
                  ? "bg-secondary-container text-on-secondary-container border-[1.5px] border-black shadow-[3px_3px_0px_0px_#000]"
                  : "text-on-surface-variant hover:bg-zinc-100 border-[1.5px] border-transparent"
              }`}
            >
              <span className="material-symbols-outlined">menu_book</span>
              <span className="text-xs font-headline font-bold uppercase">Buku Fisik</span>
            </button>
            <button
              onClick={() => handleCategoryChange("Ebook")}
              className={`flex items-center gap-4 p-3 transition-all text-left ${
                categoryParam === "Ebook"
                  ? "bg-secondary-container text-on-secondary-container border-[1.5px] border-black shadow-[3px_3px_0px_0px_#000]"
                  : "text-on-surface-variant hover:bg-zinc-100 border-[1.5px] border-transparent"
              }`}
            >
              <span className="material-symbols-outlined">auto_stories</span>
              <span className="text-xs font-headline font-bold uppercase">Ebook</span>
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 bg-background-custom">
          {/* Header & Fitur Sort */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 mb-6 border-b-[3px] border-black pb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-headline font-extrabold text-primary uppercase">
                {title}
              </h1>
              {searchParam && (
                <p className="text-xs font-body text-on-surface-variant mt-1">
                  Hasil pencarian untuk: <span className="font-bold text-primary">&ldquo;{searchParam}&rdquo;</span>
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-headline font-bold uppercase">Urutkan:</span>
              <select
                value={sortParam}
                onChange={(e) => handleSortChange(e.target.value)}
                className="border-[3px] border-black px-4 py-2 font-headline font-bold text-xs uppercase bg-white focus:outline-none focus:ring-0 shadow-[2px_2px_0px_#000]"
              >
                <option value="newest">Terbaru</option>
                <option value="price_asc">Harga Terendah</option>
                <option value="price_desc">Harga Tertinggi</option>
                <option value="popular">Terpopuler (Rating)</option>
              </select>
            </div>
          </div>

          {/* List Buku Grid */}
          {loading ? (
            <div className="py-20 text-center font-headline font-bold uppercase text-on-surface-variant">
              Memuat koleksi buku...
            </div>
          ) : books.length === 0 ? (
            <div className="py-20 text-center">
              <span className="material-symbols-outlined text-5xl text-zinc-400 mb-2">search_off</span>
              <p className="font-headline font-bold uppercase text-zinc-500">Buku tidak ditemukan</p>
              <p className="text-xs text-zinc-400 font-body mt-1">Coba cari dengan kata kunci lain atau pilih kategori yang berbeda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-4">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default function KategoriPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background-custom font-headline font-bold text-lg uppercase tracking-wider">
          Memuat halaman...
        </div>
      }
    >
      <KategoriContent />
    </Suspense>
  );
}
