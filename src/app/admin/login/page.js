"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Harap isi bagian kosong");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login admin gagal");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setError("Tidak bisa terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border-[3px] border-black neobrutal-shadow p-5">
        <div className="text-center mb-4">
          <span className="bg-red-500 text-white px-3 py-1 border-2 border-black font-headline font-bold text-[10px] uppercase shadow-[1.5px_1.5px_0px_#000] inline-block mb-2">
            ADMINISTRATOR ACCESS
          </span>
          <h1 className="text-3xl font-headline font-extrabold text-primary uppercase tracking-tighter">
            Buku Kita
          </h1>
          <p className="text-xs font-headline font-bold text-on-surface-variant uppercase mt-1">
            Masuk ke Panel Kontrol
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-2">
            <label className="block text-xs font-headline font-bold uppercase mb-1">
              Email Admin
            </label>
            <input
              type="email"
              placeholder="Contoh: admin@bukukita.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white border-[3px] border-black focus:ring-0 focus:outline-none font-body text-sm"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-headline font-bold uppercase mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white border-[3px] border-black focus:ring-0 focus:outline-none font-body text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary py-3 border-[3px] border-black neobrutal-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1.5px_1.5px_0px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all uppercase font-headline font-bold text-sm mb-3 disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Masuk Admin"}
          </button>
        </form>

        {error && (
          <p className="text-red-600 font-headline font-bold text-xs text-center mt-2">
            {error}
          </p>
        )}

        <div className="border-t-2 border-black mt-4 pt-3 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-headline font-bold uppercase underline decoration-2 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined !text-sm">arrow_back</span> Kembali ke Beranda Publik
          </Link>
        </div>
      </div>
    </div>
  );
}
