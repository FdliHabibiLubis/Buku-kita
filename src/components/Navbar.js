"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user.role === "admin") {
            setUser(data.user);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Session check error:", err);
      }
    }
    checkSession();
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        setUser(null);
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/kategori?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 flex justify-between items-center w-full px-4 md:px-8 py-4 bg-white border-b-[3px] border-black shadow-[5px_5px_0px_0px_#000000]">
      <div className="flex items-center gap-5">
        <Link href="/" className="text-xl md:text-2xl font-headline font-extrabold text-primary uppercase tracking-tighter hover:text-primary-container transition-colors">
          Buku Kita
        </Link>
        <nav className="hidden md:flex gap-6 items-center">
          <Link href="/" className="text-sm font-headline font-bold text-on-surface hover:text-primary transition-colors">
            Beranda
          </Link>
          <Link href="/kategori" className="text-sm font-headline font-bold text-on-surface hover:text-primary transition-colors">
            Koleksi
          </Link>
          <Link href="/#promo" className="text-sm font-headline font-bold text-on-surface hover:text-primary transition-colors">
            Koleksi &amp; Akses
          </Link>
          {user && (
            <>
              <Link href="/admin" className="text-sm font-headline font-bold text-red-600 hover:text-red-800 border-2 border-red-600 px-2 py-0.5 rounded transition-all bg-red-50">
                ADMIN PANEL
              </Link>
              <a href="#" onClick={handleLogout} className="text-sm font-headline font-bold text-on-surface hover:text-primary transition-colors">
                Keluar
              </a>
            </>
          )}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <span className="hidden lg:inline text-xs font-headline font-bold text-on-surface-variant uppercase">
            Halo, {user.name}
          </span>
        )}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 items-center">
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Cari Buku"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 md:w-56 px-4 py-2 bg-white border-[3px] border-black focus:ring-0 focus:outline-none text-xs font-headline font-bold uppercase"
            />
          </div>
          <button
            type="submit"
            className="bg-primary text-on-primary px-4 py-2 border-[3px] border-black neobrutal-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1.5px_1.5px_0px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all uppercase font-headline font-bold text-xs"
          >
            Search
          </button>
        </form>
      </div>
    </header>
  );
}
