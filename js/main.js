// Gemeinsames Skript für alle Seiten. Jede Funktion läuft nur, wenn ihre Elemente existieren.
(function () {
  "use strict";

  // --- Mobiles Menü ---
  function initMenu() {
    const toggle = document.getElementById("menuToggle");
    const links = document.getElementById("navLinks");
    if (!toggle || !links) return;
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
    });
    links
      .querySelectorAll("a")
      .forEach((a) =>
        a.addEventListener("click", () => links.classList.remove("open")),
      );
  }

  // --- Terminanfrage per WhatsApp erst nach AGB-Bestätigung ---
  function initAgbCheck() {
    const agbCheck = document.getElementById("agbCheck");
    const terminBtn = document.getElementById("terminBtn");
    if (!agbCheck || !terminBtn) return;
    const syncTermin = () => {
      const ok = agbCheck.checked;
      terminBtn.setAttribute("aria-disabled", String(!ok));
      terminBtn.tabIndex = ok ? 0 : -1;
    };
    agbCheck.addEventListener("change", syncTermin);
    terminBtn.addEventListener("click", (e) => {
      if (!agbCheck.checked) e.preventDefault();
    });
    syncTermin();
  }

  // --- Preise aus js/preise.js aufbauen ---
  // Alle Texte stammen aus preise.js und werden escaped; die Symbole kommen
  // aus einer festen Liste (Sprite in index.html), nicht aus den Daten.
  const LASH_ICONS = {
    einzel: "i-lash-einzel",
    klein: "i-lash-klein",
    gross: "i-lash-gross",
  };

  function renderPreise() {
    const box = document.getElementById("preise");
    if (!box || typeof PREISE === "undefined") return;
    const eur = (n) => (n === 0 ? "kostenlos" : n + " €");
    const esc = (t) =>
      String(t)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/"/g, "&quot;");
    let html = "";

    // Wimpern: eine Karte pro Stil
    const w = PREISE.wimpern;
    if (w && w.sichtbar) {
      const refillLabels = w.spalten
        .slice(1)
        .map((c) => c.replace(/^Refill\s*/i, ""));
      html += `<div class="price-block reveal"><h3>${esc(w.titel)}</h3>`;
      html += `<div class="lash-wrap"><div class="lash-cards" id="lashCards" tabindex="0" role="group" aria-label="Wimpern-Stile, seitlich wischbar">`;
      w.stile.forEach((st) => {
        const icon = LASH_ICONS[st.icon];
        html += `<article class="lash-card${st.highlight ? " is-highlight" : ""}">`;
        if (st.highlight) {
          html += `<span class="lash-badge">${esc(st.badgeText || "Beliebt")}</span>`;
        }
        if (icon) {
          html += `<svg class="lash-icon" aria-hidden="true" focusable="false"><use href="#${icon}" /></svg>`;
        }
        html += `<h4 class="lash-name"><span>${esc(st.name).replace(/1:1/g, '<span class="num-lining">1:1</span>')}</span></h4>`;
        html += `<p class="lash-detail">${st.detail ? esc(st.detail) : "&nbsp;"}</p>`;
        html += `<p class="lash-label">${esc(w.spalten[0])}</p>`;
        html += `<p class="lash-price">${eur(st.preise[0])}</p>`;
        html += `<p class="lash-label lash-refill-label">Auffüllen</p>`;
        html += `<ol class="timeline">`;
        refillLabels.forEach((label, i) => {
          html += `<li><span class="tl-when">${esc(label)}</span><span class="tl-dot" aria-hidden="true"></span><span class="tl-price">${eur(st.preise[i + 1])}</span></li>`;
        });
        html += `</ol></article>`;
      });
      html += `</div><div class="lash-dots" aria-hidden="true">${w.stile
        .map(() => "<span></span>")
        .join("")}</div></div>`;
      if (w.untertitel || w.hinweis) {
        html += `<div class="info-box"><svg class="info-icon" aria-hidden="true" focusable="false"><use href="#i-info" /></svg><div>`;
        if (w.untertitel) html += `<p class="info-title">${esc(w.untertitel)}</p>`;
        if (w.hinweis) html += `<p>${esc(w.hinweis)}</p>`;
        html += `</div></div>`;
      }
      html += `</div>`;
    }

    // Extras als Pills
    const ex = PREISE.extras;
    if (ex && ex.sichtbar) {
      html += `<div class="price-block reveal"><h3>${esc(ex.titel)}</h3><ul class="pill-row">`;
      ex.eintraege.forEach((e) => {
        html += `<li class="pill"><span class="pill-name">${esc(e.name)}${
          e.detail ? `<small>${esc(e.detail)}</small>` : ""
        }</span><span class="pill-price">${e.zuschlag ? "+ " : ""}${eur(e.preis)}</span></li>`;
      });
      html += `</ul></div>`;
    }

    // Augenbrauen, Waxing usw. im Menükarten-Stil
    const menus = Object.keys(PREISE)
      .filter((k) => k !== "wimpern" && k !== "extras" && PREISE[k].sichtbar)
      .map((k) => {
        const g = PREISE[k];
        let h = `<section class="menu-card"><h3>${esc(g.titel)}</h3><ul class="menu-list">`;
        g.eintraege.forEach((e) => {
          h += `<li><div class="menu-line"><span class="menu-name">${esc(e.name)}</span><span class="menu-dots" aria-hidden="true"></span><span class="menu-price">${e.zuschlag ? "+ " : ""}${eur(e.preis)}</span></div>${
            e.detail ? `<small class="menu-detail">${esc(e.detail)}</small>` : ""
          }</li>`;
        });
        return h + `</ul></section>`;
      });
    if (menus.length) {
      html += `<div class="menu-cols reveal">${menus.join("")}</div>`;
    }
    box.innerHTML = html;
    initLashDots();
  }

  // Punkt-Anzeige für die wischbaren Karten (nur Deko, auf dem Handy sichtbar)
  function initLashDots() {
    const scroller = document.getElementById("lashCards");
    if (!scroller || !("IntersectionObserver" in window)) return;
    const cards = scroller.querySelectorAll(".lash-card");
    const dots = scroller.parentElement.querySelectorAll(".lash-dots span");
    if (!dots.length) return;
    dots[0].classList.add("active");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const i = [...cards].indexOf(e.target);
          dots.forEach((d, n) => d.classList.toggle("active", n === i));
        });
      },
      { root: scroller, threshold: 0.6 },
    );
    cards.forEach((c) => obs.observe(c));
  }

  // --- Elemente beim Scrollen sanft einblenden (einmal pro Element) ---
  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("visible"));
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -8% 0px" },
    );
    items.forEach((el) => obs.observe(el));
  }

  // --- Aktiven Menüpunkt beim Scrollen markieren ---
  function initActiveNav() {
    const links = document.getElementById("navLinks");
    const sections = document.querySelectorAll("main section[id]");
    if (!links || !sections.length) return;
    window.addEventListener("scroll", () => {
      let current = "start";
      sections.forEach((s) => {
        if (window.scrollY >= s.offsetTop - 120) current = s.id;
      });
      links
        .querySelectorAll("a")
        .forEach((a) =>
          a.classList.toggle(
            "active",
            a.getAttribute("href") === "#" + current,
          ),
        );
    });
  }

  initMenu();
  initAgbCheck();
  renderPreise();
  initReveal();
  initActiveNav();
})();
