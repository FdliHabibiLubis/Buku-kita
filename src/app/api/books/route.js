import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getAuthUser, isAdmin } from "@/lib/auth";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort");
    const section = searchParams.get("section");

    let query = `
      SELECT b.*
      FROM books b
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      query += " AND b.category = ?";
      params.push(category);
    }
    if (search) {
      query += " AND (b.title LIKE ? OR b.author LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }
    if (section) {
      if (section === "recommended") query += " AND b.is_recommended = 1";
      else if (section === "top") query += " AND b.is_top = 1";
      else if (section === "new") query += " AND b.is_new = 1";
      else if (section === "choice") query += " AND b.is_choice = 1";
    }

    // Sorting
    if (sort === "price_asc") {
      query += " ORDER BY b.price ASC";
    } else if (sort === "price_desc") {
      query += " ORDER BY b.price DESC";
    } else if (sort === "newest") {
      query += " ORDER BY b.created_at DESC";
    } else if (sort === "popular") {
      query += " ORDER BY b.is_top DESC, b.id DESC"; // Sederhanakan sorting popular
    } else {
      query += " ORDER BY b.id ASC";
    }

    const books = db.prepare(query).all(...params);
    const formattedBooks = books.map(book => {
      // Buat rating simulasi dinamis berbasis ID buku
      const avg_rating = Number((4.2 + (Number(book.id) % 9) * 0.1).toFixed(1));
      const rating_count = 8 + (Number(book.id) * 3);

      return {
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
    });

    return NextResponse.json({ books: formattedBooks });
  } catch (err) {
    console.error("GET Books Error:", err);
    return NextResponse.json({ message: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getAuthUser();
    if (!isAdmin(user)) {
      return NextResponse.json({ message: "Akses ditolak, hanya admin yang diijinkan" }, { status: 403 });
    }

    const { title, author, price, category, cover_image, description, google_books_url, stock, is_recommended, is_top, is_new, is_choice } = await req.json();

    if (!title || !author || !price || !category) {
      return NextResponse.json({ message: "Harap isi bagian kosong" }, { status: 400 });
    }

    const cover = cover_image || "/images/Rekom-Buku/janji-tereliye.jpg";

    const result = db.prepare(`
      INSERT INTO books (title, author, price, category, cover_image, description, google_books_url, stock, is_recommended, is_top, is_new, is_choice)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      title,
      author,
      Number(price),
      category,
      cover,
      description || "",
      google_books_url || "",
      Number(stock || 0),
      is_recommended ? 1 : 0,
      is_top ? 1 : 0,
      is_new ? 1 : 0,
      is_choice ? 1 : 0
    );

    const newBook = {
      id: Number(result.lastInsertRowid),
      title,
      author,
      price,
      category,
      cover_image: cover,
      description: description || "",
      google_books_url: google_books_url || "",
      stock: Number(stock || 0),
      is_recommended,
      is_top,
      is_new,
      is_choice
    };

    return NextResponse.json({ message: "Buku berhasil ditambahkan", book: newBook }, { status: 201 });
  } catch (err) {
    console.error("POST Book Error:", err);
    return NextResponse.json({ message: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
