import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getAuthUser, isAdmin } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    const book = db.prepare(`
      SELECT b.*
      FROM books b
      WHERE b.id = ?
    `).get(id);

    if (!book) {
      return NextResponse.json({ message: "Buku tidak ditemukan" }, { status: 404 });
    }

    const avg_rating = Number((4.2 + (Number(book.id) % 9) * 0.1).toFixed(1));
    const rating_count = 8 + (Number(book.id) * 3);

    const formattedBook = {
      ...book,
      is_recommended: Boolean(book.is_recommended),
      is_top: Boolean(book.is_top),
      is_new: Boolean(book.is_new),
      is_choice: Boolean(book.is_choice),
      avg_rating,
      rating_count,
      price: Number(book.price),
      stock: Number(book.stock || 0),
    };

    return NextResponse.json({ book: formattedBook });
  } catch (err) {
    console.error("GET Book Detail Error:", err);
    return NextResponse.json({ message: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const user = await getAuthUser();
    if (!isAdmin(user)) {
      return NextResponse.json({ message: "Akses ditolak, hanya admin yang diijinkan" }, { status: 403 });
    }

    const { id } = await params;
    const { title, author, price, category, cover_image, description, google_books_url, stock, is_recommended, is_top, is_new, is_choice } = await req.json();

    if (!title || !author || !price || !category) {
      return NextResponse.json({ message: "Harap isi bagian kosong" }, { status: 400 });
    }

    const check = db.prepare("SELECT id FROM books WHERE id = ?").get(id);
    if (!check) {
      return NextResponse.json({ message: "Buku tidak ditemukan" }, { status: 404 });
    }

    db.prepare(`
      UPDATE books 
      SET title = ?, author = ?, price = ?, category = ?, cover_image = ?, 
          description = ?, google_books_url = ?, stock = ?,
          is_recommended = ?, is_top = ?, is_new = ?, is_choice = ?
      WHERE id = ?
    `).run(
      title,
      author,
      Number(price),
      category,
      cover_image,
      description || "",
      google_books_url || "",
      Number(stock || 0),
      is_recommended ? 1 : 0,
      is_top ? 1 : 0,
      is_new ? 1 : 0,
      is_choice ? 1 : 0,
      id
    );

    return NextResponse.json({ message: "Buku berhasil diperbarui" });
  } catch (err) {
    console.error("PUT Book Error:", err);
    return NextResponse.json({ message: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const user = await getAuthUser();
    if (!isAdmin(user)) {
      return NextResponse.json({ message: "Akses ditolak, hanya admin yang diijinkan" }, { status: 403 });
    }

    const { id } = await params;

    const check = db.prepare("SELECT id FROM books WHERE id = ?").get(id);
    if (!check) {
      return NextResponse.json({ message: "Buku tidak ditemukan" }, { status: 404 });
    }

    db.prepare("DELETE FROM books WHERE id = ?").run(id);

    return NextResponse.json({ message: "Buku berhasil dihapus" });
  } catch (err) {
    console.error("DELETE Book Error:", err);
    return NextResponse.json({ message: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
