import Database from "better-sqlite3";
import path from "path";
import bcrypt from "bcryptjs";

let db;
if (process.env.NODE_ENV === "production") {
  db = new Database(path.join(process.cwd(), "buku_kita.db"));
} else {
  if (!global._sqliteDb) {
    global._sqliteDb = new Database(path.join(process.cwd(), "buku_kita.db"));
  }
  db = global._sqliteDb;
}

// 1. Buat Tabel Users
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// 2. Buat Tabel Books (Ditambahkan kolom stock)
db.exec(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    price INTEGER NOT NULL,
    category TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    description TEXT,
    google_books_url TEXT,
    stock INTEGER DEFAULT 0,
    is_recommended INTEGER DEFAULT 0,
    is_top INTEGER DEFAULT 0,
    is_new INTEGER DEFAULT 0,
    is_choice INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);



// 5. Seeding Akun Admin Default jika belum ada (Safe against parallel worker race conditions)
try {
  const checkAdmin = db.prepare("SELECT COUNT(*) as count FROM users WHERE email = ?").get("admin@bukukita.com");
  if (checkAdmin.count === 0) {
    const adminHash = bcrypt.hashSync("admin123", 10);
    db.prepare("INSERT OR IGNORE INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)").run(
      "Admin",
      "admin@bukukita.com",
      adminHash,
      "admin"
    );
  }
} catch (e) {
  // Diamkan jika terjadi konflik unik atau penguncian saat build bersamaan
}

// 6. Seeding Data Buku jika tabel kosong (Safe against parallel worker race conditions)
try {
  const checkBooks = db.prepare("SELECT COUNT(*) as count FROM books").get();
  if (checkBooks.count === 0) {
    const seedBooks = [
      {
        title: "Janji",
        author: "Tere Liye",
        price: 121000,
        category: "Buku",
        cover_image: "/images/Rekom-Buku/janji-tereliye.jpg",
        description: "Novel Janji mengisahkan perjalanan hidup Bahar Safar, seorang yatim piatu yang nakal namun memegang teguh lima janji suci. Setelah dikeluarkan dari pesantren, Bahar menjalani hidup keras, mulai dari kuli pasar, narapidana, hingga pengusaha sukses, sambil terus menepati janji-janjinya. Kisah ini fokus pada pencarian Bahar oleh tiga sekawan—Baso, Hasan, dan Kaharudin—yang diperintahkan Buya, mengungkapkan transformasi Bahar yang penuh makna, haru, dan pesan moral tentang integritas.",
        google_books_url: "https://books.google.co.id/books/about/JANJI.html?id=PaIlEAAAQBAJ&redir_esc=y",
        stock: 15,
        is_recommended: 1,
        is_top: 1,
        is_new: 1,
        is_choice: 1,
      },
      {
        title: "Tentang Kamu",
        author: "Tere Liye",
        price: 121000,
        category: "Buku",
        cover_image: "/images/Rekom-Buku/tentang kamu-tereliye.jpg",
        description: "Novel Tentang Kamu mengisahkan perjuangan hidup Sri Ningsih, seorang wanita asal Pulau Bungin yang sederhana namun memiliki keteguhan hati luar biasa. Melalui catatan harian dan warisan senilai triliunan rupiah yang diselidiki oleh seorang pengacara muda di London, terungkap kisah cinta, pengkhianatan, kepedihan, serta ketulusan cinta Sri Ningsih yang mengharukan dan menginspirasi.",
        google_books_url: "https://books.google.co.id/books/about/Tentang_Kamu.html?id=F-87DwAAQBAJ",
        stock: 8,
        is_recommended: 1,
        is_top: 1,
        is_new: 0,
        is_choice: 1,
      },
      {
        title: "Hujan",
        author: "Tere Liye",
        price: 121000,
        category: "Buku",
        cover_image: "/images/Rekom-Buku/hujan-tereliye.jpg",
        description: "Novel Hujan berlatar tahun 2050-an, mengisahkan persahabatan dan cinta antara Lail dan Esok pasca-bencana gunung meletus dahsyat yang melanda bumi. Di tengah pemulihan peradaban dan perkembangan teknologi canggih, mereka menghadapi perpisahan, pilihan hidup, serta kerumitan memori masa lalu tentang cinta, persahabatan, perpisahan, dan hujan.",
        google_books_url: "https://books.google.co.id/books/about/Hujan.html?id=I-87DwAAQBAJ",
        stock: 20,
        is_recommended: 1,
        is_top: 0,
        is_new: 1,
        is_choice: 1,
      },
      {
        title: "Seporsi Mie Ayam Sebelum Mati",
        author: "Brian Khrisna",
        price: 121000,
        category: "Buku",
        cover_image: "/images/Rekom-Buku/seporsimieayam-brian.jpg",
        description: "Kumpulan cerita pendek yang menyentuh hati dan sarat humor khas, menceritakan tentang perenungan hidup, hubungan manusia, kegagalan cinta, hingga impian-impian sederhana masyarakat urban. Brian Khrisna menyajikan kisah yang sangat relevan, emosional, sekaligus menghibur.",
        google_books_url: "",
        stock: 12,
        is_recommended: 1,
        is_top: 1,
        is_new: 1,
        is_choice: 0,
      },
      {
        title: "Kau Aku dan Sepucuk Angpao Merah",
        author: "Tere Liye",
        price: 121000,
        category: "Buku",
        cover_image: "/images/Rekom-Buku/kauakudansepucuk-tereliye.jpg",
        description: "Sebuah novel romantis berlatar Pontianak yang menceritakan tentang cinta sejati, kesederhanaan, dan takdir yang manis antara Rehan, seorang pengemudi perahu penyeberangan (klotok), dan seorang gadis misterius bernama Mei. Kisah ini mengalir indah dengan balutan budaya lokal.",
        google_books_url: "https://books.google.co.id/books/about/Kau_Aku_dan_Sepucuk_Angpao_Merah.html?id=Je87DwAAQBAJ",
        stock: 5,
        is_recommended: 1,
        is_top: 0,
        is_new: 1,
        is_choice: 1,
      },
      {
        title: "Bumi Manusia",
        author: "Pramoedya Ananta Toer",
        price: 121000,
        category: "Buku",
        cover_image: "/images/Rekom-Buku/bumi manusia-pram.png",
        description: "Roman legendaris karya Pramoedya Ananta Toer berlatar masa kolonial Hindia Belanda, mengisahkan cinta antara Minke, seorang pemuda pribumi yang cerdas, dan Annelies, gadis Indo-Belanda. Di tengah ketidakadilan hukum kolonial, mereka berjuang mempertahankan cinta dan martabat kemanusiaan.",
        google_books_url: "https://books.google.co.id/books/about/Bumi_Manusia.html?id=Z_u_DwAAQBAJ",
        stock: 10,
        is_recommended: 1,
        is_top: 1,
        is_new: 0,
        is_choice: 1,
      },
      // --- Ebooks ---
      {
        title: "Janji (Ebook)",
        author: "Tere Liye",
        price: 99000,
        category: "Ebook",
        cover_image: "/images/Rekom-Buku/janji-tereliye.jpg",
        description: "Versi Ebook dari novel Janji oleh Tere Liye. Mengisahkan perjalanan hidup Bahar Safar, penuh hikmah dan pesan moral berharga.",
        google_books_url: "https://books.google.co.id/books/about/JANJI.html?id=PaIlEAAAQBAJ&redir_esc=y",
        stock: 999, // Ebook stock can be large
        is_recommended: 0,
        is_top: 1,
        is_new: 1,
        is_choice: 0,
      },
      {
        title: "Tentang Kamu (Ebook)",
        author: "Tere Liye",
        price: 99000,
        category: "Ebook",
        cover_image: "/images/Rekom-Buku/tentang kamu-tereliye.jpg",
        description: "Versi Ebook dari novel Tentang Kamu. Perjalanan hidup Sri Ningsih melintasi waktu dan tempat, menginspirasi pembaca.",
        google_books_url: "https://books.google.co.id/books/about/Tentang_Kamu.html?id=F-87DwAAQBAJ",
        stock: 999,
        is_recommended: 1,
        is_top: 0,
        is_new: 0,
        is_choice: 1,
      },
      {
        title: "Hujan (Ebook)",
        author: "Tere Liye",
        price: 99000,
        category: "Ebook",
        cover_image: "/images/Rekom-Buku/hujan-tereliye.jpg",
        description: "Versi Ebook dari novel Hujan. Kisah cinta fiksi ilmiah bertema persahabatan, cinta, dan teknologi masa depan.",
        google_books_url: "https://books.google.co.id/books/about/Hujan.html?id=I-87DwAAQBAJ",
        stock: 999,
        is_recommended: 0,
        is_top: 1,
        is_new: 0,
        is_choice: 1,
      },
      {
        title: "Bumi Manusia (Ebook)",
        author: "Pramoedya Ananta Toer",
        price: 99000,
        category: "Ebook",
        cover_image: "/images/Rekom-Buku/bumi manusia-pram.png",
        description: "Versi Ebook dari novel mahakarya Bumi Manusia. Roman sejarah perjuangan harga diri dan nasionalisme di era kolonial.",
        google_books_url: "https://books.google.co.id/books/about/Bumi_Manusia.html?id=Z_u_DwAAQBAJ",
        stock: 999,
        is_recommended: 1,
        is_top: 1,
        is_new: 1,
        is_choice: 1,
      },
    ];

    const insert = db.prepare(`
      INSERT INTO books (title, author, price, category, cover_image, description, google_books_url, stock, is_recommended, is_top, is_new, is_choice)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const book of seedBooks) {
      insert.run(
        book.title,
        book.author,
        book.price,
        book.category,
        book.cover_image,
        book.description,
        book.google_books_url,
        book.stock,
        book.is_recommended,
        book.is_top,
        book.is_new,
        book.is_choice
      );
    }
  }
} catch (e) {
  // Diamkan jika terjadi penguncian database saat build bersamaan
}

export default db;
