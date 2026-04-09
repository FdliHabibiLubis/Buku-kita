document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("scrollContainer");

  if (!container) return;

  window.scrollToLeft = function () {
    container.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  window.scrollToRight = function () {
    container.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };
});
