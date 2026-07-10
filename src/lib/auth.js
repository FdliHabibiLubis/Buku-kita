import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "buku-kita-dev-secret-ganti-di-produksi";

export async function getAuthUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}
export function isAdmin(user) {
  return user && user.role === "admin";
}
