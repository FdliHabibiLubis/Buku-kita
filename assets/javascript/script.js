// Register
function register(name, email, password, confirmPassword) {
  // Mengambil data
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Memvalidasi jika kosong
  if (!name || !email || !password || !confirmPassword) {
    console.log("Harap isi bagian kosong");
    return;
  }

  // Memvalidasi password
  if (password.length < 8) {
    console.log("Password minimal 8 karrakter");
    return;
  }
  if (password !== confirmPassword) {
    console.log("Password tidak sama");
    return;
  }

  //  cek email
  let exists = users.find((u) => u.email === email);
  if (exists) {
    console.log("Email sudah terdaftar");
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

  // Memvalidasi jika isi kosonga
  if (!email || !password) {
    console.log("Harap isi bagian kosong");
    return;
  }
  // Mencari akun user
  let user = users.find((u) => u.email === email);

  if (!user) {
    alert("Email tidak ditemukan");
    return;
  }

  // Mengecek password
  if (user.password !== password) {
    alert("Password salah");
    return;
  }

  alert("Login berhasil");

  // Menyimpan status login
  localStorage.setItem("Login user", email);

  // masuk ke dashboard
  window.location.href = "dashboard.html";
}

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
