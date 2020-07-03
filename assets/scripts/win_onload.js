window.onload = () => {
  document.querySelector("header .trigger").insertAdjacentElement('afterbegin', s);

  document.querySelector("html").dataset.theme = x;
  if (document.querySelector("html").dataset.theme == "light") {
    document.querySelector("#toggleTheme input").checked = true;
  }
}
