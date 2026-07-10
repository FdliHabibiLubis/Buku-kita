// script.js — Frontend logic Buku Kita
// Autentikasi sekarang terhubung ke backend (Express + SQLite) melalui REST API,
// bukan lagi disimpan langsung di localStorage. localStorage cuma menyimpan
// token JWT + data user sebagai cache sesi di browser.

const API_BASE = ""; // kosong = origin yang sama (server menyajikan frontend & API bersamaan)

function getToken() {
  return localStorage.getItem("token");
}

function getCurrentUser() {
  const raw = localStorage.getItem("currentUser");
  return raw ? JSON.parse(raw) : null;
}

function saveSession(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("currentUser", JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("currentUser");
}

// ---------- REGISTER ----------
async function register(name, email, password, confirmPassword) {
  const output = document.getElementById("output");

  if (!name || !email || !password || !confirmPassword) {
    output.textContent = "Harap isi bagian kosong";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, confirmPassword }),
    });
    const data = await res.json();

    if (!res.ok) {
      output.textContent = data.message || "Registrasi gagal";
      return;
    }

    saveSession(data.token, data.user);
    window.location.href = "dashboard.html";
  } catch (err) {
    output.textContent = "Tidak bisa terhubung ke server";
  }
}

function handleRegister() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  register(name, email, password, confirmPassword);
}

// ---------- LOGIN ----------
async function login(email, password) {
  const output = document.getElementById("output");

  if (!email || !password) {
    output.textContent = "Harap isi bagian kosong";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      output.textContent = data.message || "Login gagal";
      return;
    }

    saveSession(data.token, data.user);
    window.location.href = "dashboard.html";
  } catch (err) {
    output.textContent = "Tidak bisa terhubung ke server";
  }
}

function handleLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  login(email, password);
}

// ---------- LOGOUT ----------
function logout() {
  clearSession();
}

// ---------- Tampilkan nama user & jaga halaman yang butuh login ----------
// Halaman yang wajib login (root: dashboard.html, Kategori/*.html, Detail-buku/*.html)
// menandai body dengan atribut data-require-auth="true".
document.addEventListener("DOMContentLoaded", async function () {
  const usernameEl = document.getElementById("username");
  const requiresAuth = document.body.dataset.requireAuth === "true";
  const token = getToken();
  const cachedUser = getCurrentUser();

  if (usernameEl) {
    usernameEl.textContent = cachedUser ? "Halo, " + cachedUser.name : "Buku Kita";
  }

  if (!requiresAuth) return;

  if (!token) {
    window.location.href = computeLoginPath();
    return;
  }

  // Validasi token ke server (memastikan user masih ada / token belum kedaluwarsa)
  try {
    const res = await fetch(`${API_BASE}/api/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      clearSession();
      window.location.href = computeLoginPath();
      return;
    }
    const data = await res.json();
    if (usernameEl) usernameEl.textContent = "Halo, " + data.user.name;
  } catch (err) {
    // Server tidak terjangkau: biarkan pakai cache lokal agar tidak logout paksa
    console.warn("Tidak bisa memverifikasi sesi ke server:", err);
  }
});

function computeLoginPath() {
  // Menentukan path relatif ke index.html tergantung kedalaman folder halaman saat ini
  const depth = window.location.pathname.split("/").filter(Boolean).length;
  // Halaman di root (dashboard.html) → depth folder projek biasanya 1 (nama file saja)
  // Halaman di subfolder (Kategori/, Detail-buku/) butuh "../index.html"
  const inSubfolder = /\/(Kategori|Detail-buku)\//.test(window.location.pathname);
  return inSubfolder ? "../index.html" : "index.html";
}

// ---------- Scroll rail buku (dipakai di beberapa halaman kategori) ----------
document.addEventListener("DOMContentLoaded", () => {
  window.scrollKiri = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollBy({ left: -300, behavior: "smooth" });
  };

  window.scrollKanan = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollBy({ left: 300, behavior: "smooth" });
  };
});
