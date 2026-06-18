(() => {
  const cookie = decodeURIComponent(document.cookie);
  const setting = Number(cookie.match(/"dark-mode":(\d)/)?.[1] ?? 0);
  const dark = setting === 0
    ? window.matchMedia("(prefers-color-scheme: dark)").matches
    : setting === 2;
  document.documentElement.toggleAttribute("z-dark", dark);
})();
