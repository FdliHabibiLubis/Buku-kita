// server.js — Backend Buku Kita (Express + SQLite + JWT)
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "buku-kita-dev-secret-ganti-di-produksi";

app.use(cors());
app.use(express.json());

// Sajikan seluruh file frontend statis (folder "Toko buku") dari server yang sama
const FRONTEND_DIR = path.join(__dirname, "..");
app.use(express.static(FRONTEND_DIR));

// Middleware: verifikasi token JWT dari header Authorization
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Tidak ada token, silakan login" });
  }
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token tidak valid atau kedaluwarsa" });
  }
}

// ---------- REGISTER ----------
app.post("/api/register", (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "Harap isi bagian kosong" });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: "Password minimal 8 karakter" });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Password tidak sama" });
  }

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    return res.status(409).json({ message: "Email sudah terdaftar" });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const result = db
    .prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)")
    .run(name, email, passwordHash);

  const user = { id: Number(result.lastInsertRowid), name, email };
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });

  res.status(201).json({ message: "Registrasi berhasil", token, user });
});

// ---------- LOGIN ----------
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Harap isi bagian kosong" });
  }

  const row = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!row) {
    return res.status(404).json({ message: "Email tidak ditemukan" });
  }

  const valid = bcrypt.compareSync(password, row.password_hash);
  if (!valid) {
    return res.status(401).json({ message: "Password salah" });
  }

  const user = { id: row.id, name: row.name, email: row.email };
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });

  res.json({ message: "Login berhasil", token, user });
});

// ---------- ME (cek sesi & ambil data user saat ini) ----------
app.get("/api/me", authMiddleware, (req, res) => {
  const row = db.prepare("SELECT id, name, email FROM users WHERE id = ?").get(req.user.id);
  if (!row) return res.status(404).json({ message: "User tidak ditemukan" });
  res.json({ user: row });
});

app.listen(PORT, () => {
  console.log(`Buku Kita server jalan di http://localhost:${PORT}`);
});
