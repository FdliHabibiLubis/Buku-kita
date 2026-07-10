import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.set("token", "", {
      httpOnly: true,
      maxAge: 0,
      path: "/",
    });
    return NextResponse.json({ message: "Logout berhasil" });
  } catch (err) {
    console.error("Logout Error:", err);
    return NextResponse.json({ message: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
export async function GET() {
  // Dukungan logout via GET request jika dipanggil lewat link direct
  try {
    const cookieStore = await cookies();
    cookieStore.set("token", "", {
      httpOnly: true,
      maxAge: 0,
      path: "/",
    });
    return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  } catch (err) {
    return NextResponse.json({ message: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
