// db.js — koneksi & skema database SQLite (built-in node:sqlite, tanpa native build)
const { DatabaseSync } = require("node:sqlite");
const path = require("path");

const dbPath = path.join(__dirname, "buku_kita.db");
const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

module.exports = db;
