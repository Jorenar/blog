function toggleTheme() {
  let h = document.querySelector("html");
  let t = h.dataset.theme;
  if (t == "dark") {
    t = "light";
  } else {
    t = "dark";
  }
  h.dataset.theme = t;
  localStorage.setItem("theme", t);
}

let x = localStorage.getItem("theme");
if (!x) {
  x = "dark";
}

let s = document.createElement("div");
s.classList.add("switch");
s.id = "toggleTheme";
s.innerHTML = `
  <label>
    <input type="checkbox" onclick="toggleTheme()">
    <span class="slider"></span>
  </label>
  <i class="fas fa-sun"></i>
`;
