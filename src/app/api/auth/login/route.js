import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "buku-kita-dev-secret-ganti-di-produksi";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Harap isi bagian kosong" }, { status: 400 });
    }

    const row = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (!row) {
      return NextResponse.json({ message: "Email tidak ditemukan" }, { status: 404 });
    }

    const valid = bcrypt.compareSync(password, row.password_hash);
    if (!valid) {
      return NextResponse.json({ message: "Password salah" }, { status: 401 });
    }

    if (row.role !== "admin") {
      return NextResponse.json({ message: "Akses ditolak, hanya admin yang diizinkan masuk" }, { status: 403 });
    }

    const user = { id: row.id, name: row.name, email: row.email, role: row.role };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });

    // Simpan token di HTTP-Only Cookie
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 hari
      path: "/",
    });

    return NextResponse.json({ message: "Login berhasil", user });
  } catch (err) {
    console.error("Login Error:", err);
    return NextResponse.json({ message: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
