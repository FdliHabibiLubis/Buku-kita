"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AdminPage() {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [editingId, setEditingId] = useState(null); // null = tambah, id = edit
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Buku");
  const [coverImage, setCoverImage] = useState("/images/Rekom-Buku/janji-tereliye.jpg");
  const [description, setDescription] = useState("");
  const [googleBooksUrl, setGoogleBooksUrl] = useState("");
  const [stock, setStock] = useState(""); // State baru untuk stok
  const [isRecommended, setIsRecommended] = useState(false);
  const [isTop, setIsTop] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [isChoice, setIsChoice] = useState(false);

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 1. Guard Sesi Admin: Jika tidak valid, arahkan ke /admin/login
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user.role === "admin") {
            setIsAdminUser(true);
            setAuthLoading(false);
          } else {
            router.push("/admin/login");
          }
        } else {
          router.push("/admin/login");
        }
      } catch (err) {
        router.push("/admin/login");
      }
    }
    checkAuth();
  }, [router]);

  // 2. Load semua buku
  const loadBooks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/books");
      if (res.ok) {
        const data = await res.json();
        setBooks(data.books);
      }
    } catch (err) {
      console.error("Load books error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && isAdminUser) {
      loadBooks();
    }
  }, [authLoading, isAdminUser]);

  const handleEditClick = (book) => {
    setEditingId(book.id);
    setTitle(book.title);
    setAuthor(book.author);
    setPrice(book.price.toString());
    setCategory(book.category);
    setCoverImage(book.cover_image);
    setDescription(book.description || "");
    setGoogleBooksUrl(book.google_books_url || "");
    setStock(book.stock ? book.stock.toString() : "0");
    setIsRecommended(book.is_recommended);
    setIsTop(book.is_top);
    setIsNew(book.is_new);
    setIsChoice(book.is_choice);
    setFormError("");
    setFormSuccess("");
  };

  const handleResetForm = () => {
    setEditingId(null);
    setTitle("");
    setAuthor("");
    setPrice("");
    setCategory("Buku");
    setCoverImage("/images/Rekom-Buku/janji-tereliye.jpg");
    setDescription("");
    setGoogleBooksUrl("");
    setStock("");
    setIsRecommended(false);
    setIsTop(false);
    setIsNew(false);
    setIsChoice(false);
    setFormError("");
    setFormSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setSubmitting(true);

    if (!title || !author || !price || !category) {
      setFormError("Harap isi bagian kosong");
      setSubmitting(false);
      return;
    }

    const payload = {
      title,
      author,
      price: Number(price),
      category,
      cover_image: coverImage,
      description,
      google_books_url: googleBooksUrl,
      stock: Number(stock || 0),
      is_recommended: isRecommended,
      is_top: isTop,
      is_new: isNew,
      is_choice: isChoice,
    };

    try {
      const url = editingId ? `/api/books/${editingId}` : "/api/books";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.message || "Gagal menyimpan buku");
      } else {
        setFormSuccess(editingId ? "Buku berhasil diperbarui!" : "Buku berhasil ditambahkan!");
        handleResetForm();
        loadBooks();
      }
    } catch (err) {
      setFormError("Terjadi kesalahan koneksi server");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (bookId) => {
    if (!confirm("Apakah Anda yakin ingin menghapus buku ini?")) return;

    try {
      const res = await fetch(`/api/books/${bookId}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        alert("Buku berhasil dihapus!");
        loadBooks();
      } else {
        alert(data.message || "Gagal menghapus buku");
      }
    } catch (err) {
      alert("Terjadi kesalahan koneksi server");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-custom font-headline font-bold text-lg uppercase tracking-wider">
        Memverifikasi hak akses admin...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 px-4 md:px-8 py-8 bg-background-custom max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-headline font-extrabold text-primary uppercase tracking-tighter mb-2">
          Admin Panel
        </h1>
        <p className="text-xs font-headline font-bold text-on-surface-variant uppercase mb-6">
          Kelola Item &amp; Stok Buku Kita
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
          {/* List Books Panel */}
          <div className="bg-white border-[3px] border-black neobrutal-shadow p-5">
            <h2 className="text-base font-headline font-bold text-primary uppercase mb-4 pb-2 border-b-2 border-black">
              Daftar Buku ({books.length})
            </h2>

            {loading ? (
              <p className="text-xs opacity-75 font-body py-10 text-center">Memuat daftar buku...</p>
            ) : books.length === 0 ? (
              <p className="text-xs opacity-75 font-body py-10 text-center">Belum ada buku di database.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse border-[3px] border-black text-xs font-body">
                  <thead>
                    <tr className="bg-primary text-white border-b-[3px] border-black font-headline uppercase text-[10px]">
                      <th className="p-3 border-r-2 border-black">Sampul</th>
                      <th className="p-3 border-r-2 border-black">Judul &amp; Penulis</th>
                      <th className="p-3 border-r-2 border-black">Kategori &amp; Stok</th>
                      <th className="p-3 border-r-2 border-black">Harga</th>
                      <th className="p-3">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((b) => (
                      <tr key={b.id} className="border-b-2 border-black hover:bg-zinc-50">
                        <td className="p-3 border-r-2 border-black w-14">
                          <img
                            src={b.cover_image}
                            alt=""
                            className="w-10 h-14 object-cover border-2 border-black"
                          />
                        </td>
                        <td className="p-3 border-r-2 border-black">
                          <p className="font-bold text-on-surface">{b.title}</p>
                          <p className="text-on-surface-variant font-medium text-[10px] uppercase">
                            oleh {b.author}
                          </p>
                        </td>
                        <td className="p-3 border-r-2 border-black uppercase font-headline font-bold text-[10px]">
                          <div>{b.category}</div>
                          <div className="text-[9px] text-zinc-500 mt-0.5">Stok: {b.stock || 0}</div>
                        </td>
                        <td className="p-3 border-r-2 border-black font-headline font-bold">
                          Rp {b.price.toLocaleString("id-ID")}
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditClick(b)}
                              className="bg-secondary-container text-on-secondary-container border-2 border-black px-2 py-1 font-headline font-bold uppercase text-[10px] shadow-[1px_1px_0px_#000] hover:translate-x-[0.5px] hover:translate-y-[0.5px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(b.id)}
                              className="bg-red-500 text-white border-2 border-black px-2 py-1 font-headline font-bold uppercase text-[10px] shadow-[1px_1px_0px_#000] hover:translate-x-[0.5px] hover:translate-y-[0.5px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Form Create/Edit Panel */}
          <div className="bg-white border-[3px] border-black neobrutal-shadow p-5 sticky top-24">
            <h2 className="text-base font-headline font-bold text-primary uppercase mb-4 pb-2 border-b-2 border-black flex justify-between items-center">
              <span>{editingId ? "Edit Buku" : "Tambah Buku"}</span>
              {editingId && (
                <button
                  onClick={handleResetForm}
                  className="text-[10px] font-headline font-bold bg-zinc-200 border border-black px-2 py-0.5 uppercase"
                >
                  Batal
                </button>
              )}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 font-body text-xs">
              <div>
                <label className="block font-headline font-bold uppercase mb-1">Judul Buku</label>
                <input
                  type="text"
                  placeholder="Masukkan judul buku"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border-2 border-black px-3 py-2 bg-white focus:outline-none font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-headline font-bold uppercase mb-1">Penulis</label>
                <input
                  type="text"
                  placeholder="Masukkan nama penulis"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full border-2 border-black px-3 py-2 bg-white focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block font-headline font-bold uppercase mb-1">Harga (Rp)</label>
                  <input
                    type="number"
                    placeholder="Contoh: 121000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full border-2 border-black px-3 py-2 bg-white focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-headline font-bold uppercase mb-1">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border-2 border-black px-3 py-2 bg-white focus:outline-none font-headline font-bold uppercase"
                  >
                    <option value="Buku">Buku</option>
                    <option value="Ebook">Ebook</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block font-headline font-bold uppercase mb-1">Cover Image Path/URL</label>
                  <input
                    type="text"
                    placeholder="Contoh: /images/Rekom-Buku/janji-tereliye.jpg"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="w-full border-2 border-black px-3 py-2 bg-white focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-headline font-bold uppercase mb-1">Stok Buku</label>
                  <input
                    type="number"
                    placeholder="Stok"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full border-2 border-black px-3 py-2 bg-white focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-headline font-bold uppercase mb-1">Google Books URL</label>
                <input
                  type="text"
                  placeholder="Masukkan URL Google Books (Opsional)"
                  value={googleBooksUrl}
                  onChange={(e) => setGoogleBooksUrl(e.target.value)}
                  className="w-full border-2 border-black px-3 py-2 bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-headline font-bold uppercase mb-1">Deskripsi</label>
                <textarea
                  placeholder="Masukkan deskripsi atau sinopsis buku"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  className="w-full border-2 border-black px-3 py-2 bg-white focus:outline-none"
                />
              </div>

              {/* Flags Section */}
              <div className="border-2 border-black p-3 bg-zinc-50 flex flex-col gap-2">
                <h3 className="font-headline font-bold uppercase text-[10px] text-zinc-500 mb-1">Flags Dashboard</h3>
                <div className="grid grid-cols-2 gap-2 font-headline font-bold text-[10px] uppercase">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isRecommended}
                      onChange={(e) => setIsRecommended(e.target.checked)}
                      className="border-2 border-black focus:ring-0 w-4 h-4 rounded-none text-primary"
                    />
                    Rekomendasi
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isTop}
                      onChange={(e) => setIsTop(e.target.checked)}
                      className="border-2 border-black focus:ring-0 w-4 h-4 rounded-none text-primary"
                    />
                    Buku Terbaik
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isNew}
                      onChange={(e) => setIsNew(e.target.checked)}
                      className="border-2 border-black focus:ring-0 w-4 h-4 rounded-none text-primary"
                    />
                    Buku Terbaru
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isChoice}
                      onChange={(e) => setIsChoice(e.target.checked)}
                      className="border-2 border-black focus:ring-0 w-4 h-4 rounded-none text-primary"
                    />
                    Pilihan
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-on-primary py-3 border-[3px] border-black neobrutal-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1.5px_1.5px_0px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all uppercase font-headline font-bold text-xs"
              >
                {submitting ? "Menyimpan..." : editingId ? "Perbarui Buku" : "Simpan Buku"}
              </button>
            </form>

            {formSuccess && <p className="text-green-600 font-headline font-bold text-center mt-3 text-xs">{formSuccess}</p>}
            {formError && <p className="text-red-600 font-headline font-bold text-center mt-3 text-xs">{formError}</p>}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
