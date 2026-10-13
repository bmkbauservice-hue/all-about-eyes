// Setzt die gespeicherte Farbwahl, bevor das CSS lädt (verhindert helles Aufblitzen).
// Ohne gespeicherte Wahl gilt die Systemeinstellung (prefers-color-scheme).
(function () {
  try {
    var wahl = localStorage.getItem("theme");
    if (wahl === "dark" || wahl === "light") {
      document.documentElement.setAttribute("data-theme", wahl);
    }
  } catch (e) {
    /* localStorage nicht verfügbar: Systemeinstellung bleibt */
  }
})();
