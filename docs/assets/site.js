(function () {
  const supported = new Set(["en", "zh"]);
  const saved = localStorage.getItem("site-language");
  const browserLanguage = navigator.language.toLowerCase().startsWith("zh")
    ? "zh"
    : "en";

  function setLanguage(language) {
    const next = supported.has(language) ? language : "en";
    document.documentElement.lang = next === "zh" ? "zh-CN" : "en";
    document.documentElement.dataset.language = next;
    localStorage.setItem("site-language", next);

    document.querySelectorAll("[data-language-button]").forEach((button) => {
      const active = button.dataset.languageButton === next;
      button.setAttribute("aria-pressed", String(active));
    });

    const title = document.querySelector(`[data-page-title-${next}]`);
    if (title) {
      document.title = title.getAttribute(`data-page-title-${next}`);
    }
  }

  document.querySelectorAll("[data-language-button]").forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.languageButton));
  });

  setLanguage(saved || browserLanguage);
})();
