// Register
function register(name, email, password, confirmPassword) {
  // Mengambil data
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Memvalidasi jika kosong
  if (!name || !email || !password || !confirmPassword) {
    output.textContent = "Harap isi bagian kosong";
    return;
  }

  // Memvalidasi password
  if (password.length < 8) {
    output.textContent = "Minimal 8 karakter";
    return;
  }
  if (password !== confirmPassword) {
    output.textContent = "Password tidak sama";
    return;
  }

  //  cek email
  let exists = users.find((u) => u.email === email);
  if (exists) {
    output.textContent = "Email sudah terdaftar";
    return;
  }

  // Penyimpanan users
  users.push({
    nama: name,
    email: email,
    password: password,
  });

  localStorage.setItem("users", JSON.stringify(users));

  console.log("Register berhasil");

  window.location.href = "index.html";
}

function handleRegister() {
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let confirmPassword = document.getElementById("confirmPassword").value;

  register(name, email, password, confirmPassword);
}

// Login

function login(email, password) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let output = document.getElementById("output");

  if (!email || !password) {
    output.textContent = "Harap isi bagian kosong";
    return;
  }

  let user = users.find((u) => u.email === email);

  if (!user) {
    output.textContent = "Email tidak ditemukan";
    return;
  }

  if (user.password !== password) {
    output.textContent = "Password salah";
    return;
  }

  alert("Login berhasil");

  // SIMPAN USER LOGIN
  localStorage.setItem("currentUser", JSON.stringify(user));

  // PINDAH HALAMAN
  window.location.href = "dashboard.html";
}

// Menampilkan nama user ke dashboard
document.addEventListener("DOMContentLoaded", function () {
  let user = JSON.parse(localStorage.getItem("currentUser"));

  if (user) {
    document.getElementById("username").textContent = user.nama;
  } else {
    window.Location.href = "index.html";
  }
});

function handleLogin() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  login(email, password);
}

// Scroll view
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
