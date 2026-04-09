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