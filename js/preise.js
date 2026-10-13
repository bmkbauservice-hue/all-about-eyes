// Alle Preise der Website – nur diese Datei muss bei Preisänderungen angepasst werden.
// Einträge mit sichtbar: false werden (noch) nicht auf der Website angezeigt.
const PREISE = {
  wimpern: {
    sichtbar: true,
    titel: "Wimpernverlängerung",
    untertitel: "Alle Sets in UV-Methode",
    hinweis: "Refill-Preise gelten bis max. 4 Wochen und mind. 50 % Restwimpern.",
    spalten: ["Neuset", "Refill 2 Wo", "Refill 3 Wo", "Refill 4 Wo"],
    // icon: einzel | klein | gross (Dichte-Symbol auf der Karte)
    stile: [
      { name: "1:1 Mascara Look", detail: "Klassisch", icon: "einzel", preise: [100, 40, 50, 60] },
      { name: "Leichtes Volumen", detail: "3D–4D", icon: "klein", preise: [105, 45, 55, 65] },
      { name: "Mega Volumen", detail: "5D–10D", icon: "gross", preise: [115, 50, 60, 70] },
    ],
  },

  extras: {
    sichtbar: true,
    titel: "Extras",
    eintraege: [
      { name: "Special Looks", detail: "Wispy, Kim K, Fox Eyes", preis: 15, zuschlag: true },
      { name: "Wimpern ablösen", preis: 20 },
      { name: "Intensiv-Wimpernreinigung", preis: 15 },
      { name: "Beratungsgespräch", preis: 0 }, // 0 = kostenlos
    ],
  },

  augenbrauen: {
    sichtbar: true,
    titel: "Augenbrauen",
    eintraege: [
      { name: "Browlifting inkl. Styling", preis: 40 },
      { name: "Eyebrow Styling & Color", preis: 25 },
      { name: "Eyebrow Styling", preis: 15 },
    ],
  },

  waxing: {
    sichtbar: true,
    titel: "Gesichts-Waxing",
    eintraege: [
      { name: "Oberlippe", preis: 11 },
      { name: "Kinn", preis: 11 },
      { name: "Wangen", preis: 14 },
      { name: "Duo-Paket", detail: "z. B. Oberlippe + Kinn", preis: 20 },
      { name: "Wangen-Plus-Paket", preis: 23 },
      { name: "Gesicht komplett", preis: 38 },
    ],
  },
};
