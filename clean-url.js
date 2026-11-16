/* Hides ".html" in the address bar on the live site (/access.html -> /access, /index.html -> /).
   Links in the code stay "access.html", so everything still works on Live Server / local files,
   where the ".html" is kept on purpose (reloading a hidden URL would show "Cannot GET /access" there). */
(function () {
  var h = location.hostname;
  if (!h || h === 'localhost' || h === '127.0.0.1' || h === '[::1]' || location.protocol === 'file:') return;
  var p = location.pathname;
  if (!/\.html$/.test(p) || !window.history || !history.replaceState) return;
  var clean = p.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
  history.replaceState(null, '', clean + location.search + location.hash);
})();
