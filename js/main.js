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
  function renderPreise() {
    const box = document.getElementById("preise");
    if (!box || typeof PREISE === "undefined") return;
    const eur = (n) => (n === 0 ? "kostenlos" : n + "\u00a0€");
    const esc = (t) =>
      String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;");
    let html = "";
  
    const w = PREISE.wimpern;
    if (w && w.sichtbar) {
      html += `<div class="price-block reveal"><h3>${esc(w.titel)}</h3>`;
      html += `<p class="price-sub">${esc(w.untertitel)}</p>`;
      html += `<table class="price-table"><thead><tr><th scope="col">Stil</th>`;
      html += w.spalten.map((c) => `<th scope="col">${esc(c)}</th>`).join("");
      html += `</tr></thead><tbody>`;
      w.stile.forEach((st) => {
        html += `<tr><th scope="row">${esc(st.name)}${
          st.detail ? `<small>${esc(st.detail)}</small>` : ""
        }</th>`;
        st.preise.forEach((p, i) => {
          html += `<td data-label="${esc(w.spalten[i])}">${eur(p)}</td>`;
        });
        html += `</tr>`;
      });
      html += `</tbody></table>`;
      if (w.hinweis) html += `<p class="price-note">${esc(w.hinweis)}</p>`;
      html += `</div>`;
    }
  
    const liste = (g) => {
      let h = `<div class="price-block"><h3>${esc(g.titel)}</h3><ul class="price-list">`;
      g.eintraege.forEach((e) => {
        h += `<li><span>${esc(e.name)}${
          e.detail ? `<small>${esc(e.detail)}</small>` : ""
        }</span><span class="amount">${e.zuschlag ? "+\u00a0" : ""}${eur(e.preis)}</span></li>`;
      });
      return h + `</ul></div>`;
    };
    if (PREISE.extras && PREISE.extras.sichtbar) {
      html += `<div class="reveal">${liste(PREISE.extras)}</div>`;
    }
    const paare = Object.keys(PREISE)
      .filter((k) => k !== "wimpern" && k !== "extras" && PREISE[k].sichtbar)
      .map((k) => liste(PREISE[k]));
    if (paare.length) {
      html += `<div class="price-lists reveal">${paare.join("")}</div>`;
    }
    box.innerHTML = html;
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
