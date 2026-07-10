import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import db from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "buku-kita-dev-secret-ganti-di-produksi";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Tidak ada token, silakan login" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ message: "Token tidak valid atau kedaluwarsa" }, { status: 401 });
    }

    const row = db.prepare("SELECT id, name, email, role FROM users WHERE id = ?").get(decoded.id);
    if (!row) {
      return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ user: row });
  } catch (err) {
    console.error("Auth Me Error:", err);
    return NextResponse.json({ message: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
