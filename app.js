(() => {
  "use strict";

  const STATE_KEY = "marvel-watch:v1";
  const POSTER_KEY = "marvel-posters:v1";
  const MCU_SECTIONS = ["p1", "p2", "p3", "p4", "p5", "p6"];
  const TYPE_LABEL = { film: "Film", serie: "Série", special: "Spécial" };
  const LEAVE_DELAY = 560;

  const $ = (id) => document.getElementById(id);
  const allItems = SECTIONS.flatMap((s) => s.items.map((it) => ({ ...it, section: s.id })));
  const byId = new Map(allItems.map((it) => [it.id, it]));

  /* ---------- Stockage (tolérant aux navigateurs privés) ---------- */
  const store = {
    get(key) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } },
    set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* ignoré */ } },
  };

  const loadSeen = () => {
    const saved = store.get(STATE_KEY);
    if (saved && Array.isArray(saved.seen)) return new Set(saved.seen.filter((id) => byId.has(id)));
    return new Set(allItems.filter((it) => it.seen).map((it) => it.id));
  };
  const seen = loadSeen();
  const saveSeen = () => store.set(STATE_KEY, { seen: [...seen] });
  const posters = store.get(POSTER_KEY) || {};

  const isUpcoming = (it) => it.out && new Date(it.out + "T00:00:00") > new Date();
  const formatOut = (it) => new Date(it.out + "T00:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

  /* ---------- Rendu ---------- */
  const cards = new Map();
  const sectionEls = new Map();

  const CHECK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

  const buildCard = (it) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "card";
    card.dataset.id = it.id;
    card.style.viewTransitionName = "c-" + it.id;
    card.innerHTML = `
      <div class="poster">
        <div class="poster-fallback">${it.t}</div>
        ${isUpcoming(it) ? `<span class="badge">${formatOut(it)}</span>` : ""}
        <span class="check">${CHECK_SVG}</span>
        <span class="stamp" aria-hidden="true">VU !</span>
      </div>
      <span class="card-title">${it.t}</span>
      <span class="card-meta">${it.y} · ${TYPE_LABEL[it.type]}</span>`;
    card.addEventListener("click", () => toggle(it.id));
    cards.set(it.id, card);
    return card;
  };

  const render = () => {
    const list = $("list");
    const frag = document.createDocumentFragment();
    for (const s of SECTIONS) {
      const sec = document.createElement("section");
      sec.className = "section";
      sec.innerHTML = `
        <div class="section-head">
          <h2>${s.title}</h2>
          <span class="section-count"></span>
          <span class="section-bar"><i></i></span>
        </div>`;
      const grid = document.createElement("div");
      grid.className = "grid";
      s.items.forEach((it) => grid.appendChild(buildCard({ ...it, section: s.id })));
      sec.appendChild(grid);
      sectionEls.set(s.id, sec);
      frag.appendChild(sec);
    }
    list.appendChild(frag);
    allItems.forEach((it) => posters[it.id] && attachPoster(it.id, posters[it.id]));
  };

  const updateUI = () => {
    for (const [id, card] of cards) {
      const on = seen.has(id);
      card.classList.toggle("seen", on);
      card.setAttribute("aria-pressed", String(on));
      card.setAttribute("aria-label", `${byId.get(id).t}, ${on ? "vu" : "à voir"}`);
    }
    for (const s of SECTIONS) {
      const n = s.items.filter((it) => seen.has(it.id)).length;
      const el = sectionEls.get(s.id);
      el.classList.toggle("complete", n === s.items.length);
      el.classList.toggle("none", n === 0);
      el.querySelector(".section-count").textContent = `${n}/${s.items.length}`;
      el.querySelector(".section-bar i").style.width = (n / s.items.length) * 100 + "%";
    }
    const total = allItems.length;
    const n = seen.size;
    $("pSeen").textContent = n;
    $("pTotal").textContent = total;
    $("pPct").textContent = Math.round((n / total) * 100) + " %";
    $("pFill").style.width = (n / total) * 100 + "%";
    $("cTodo").textContent = total - n;
    $("cSeen").textContent = n;
    updateNext();
    updateEmpty();
  };

  const updateEmpty = () => {
    const filter = $("list").dataset.filter;
    const n = seen.size;
    const empty = (filter === "todo" && n === allItems.length) || (filter === "seen" && n === 0);
    $("empty").hidden = !empty;
    $("empty").innerHTML = filter === "todo"
      ? "<b>Tout est vu</b>Plus rien à rattraper avant le prochain film."
      : "<b>Rien de vu</b>Touche une affiche pour la marquer comme vue.";
  };

  /* ---------- Prochain à voir ---------- */
  let nextId = null;
  const pickNext = () => {
    const ordered = [
      ...allItems.filter((it) => MCU_SECTIONS.includes(it.section)),
      ...allItems.filter((it) => !MCU_SECTIONS.includes(it.section)),
    ];
    return ordered.find((it) => !seen.has(it.id) && !isUpcoming(it));
  };
  const updateNext = () => {
    const it = pickNext();
    $("next").hidden = !it;
    if (!it) return;
    nextId = it.id;
    $("nextTitle").textContent = it.t;
    $("nextMeta").textContent = `${it.y} · ${TYPE_LABEL[it.type]} · ${SECTIONS.find((s) => s.id === it.section).title}`;
    const img = $("nextPoster");
    if (posters[it.id]) img.src = posters[it.id];
    else img.removeAttribute("src");
    img.alt = "";
  };
  $("nextBtn").addEventListener("click", () => nextId && toggle(nextId));

  /* ---------- Interaction ---------- */
  const withTransition = (fn) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (document.startViewTransition && !reduce) document.startViewTransition(fn);
    else fn();
  };

  let toastTimer = null;
  let lastAction = null;

  const showToast = (text, undo) => {
    lastAction = undo;
    $("toastUndo").hidden = !undo;
    $("toastText").textContent = text;
    $("toast").classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $("toast").classList.remove("show"), 3200);
  };
  $("toastUndo").addEventListener("click", () => {
    $("toast").classList.remove("show");
    if (lastAction) { lastAction(); lastAction = null; }
  });

  const setSeen = (id, on) => {
    if (on) seen.add(id); else seen.delete(id);
    saveSeen();
    updateUI();
  };

  const toggle = (id) => {
    const card = cards.get(id);
    const on = !seen.has(id);
    const filter = $("list").dataset.filter;
    const leaves = (filter === "todo" && on) || (filter === "seen" && !on);

    if (navigator.vibrate) navigator.vibrate(on ? 12 : 6);
    if (on) {
      card.classList.remove("pop");
      void card.offsetWidth;
      card.classList.add("pop");
      setTimeout(() => card.classList.remove("pop"), 650);
    }

    const apply = () => withTransition(() => setSeen(id, on));
    if (leaves && on) setTimeout(apply, LEAVE_DELAY);
    else apply();

    const title = byId.get(id).t;
    showToast(on ? `${title} : vu` : `${title} : à voir`, () => withTransition(() => setSeen(id, !on)));
  };

  document.querySelectorAll(".seg button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".seg button").forEach((b) => b.setAttribute("aria-selected", String(b === btn)));
      withTransition(() => {
        $("list").dataset.filter = btn.dataset.filter;
        updateEmpty();
      });
      try { sessionStorage.setItem("marvel-filter", btn.dataset.filter); } catch { /* ignoré */ }
    });
  });

  /* ---------- Affiches (API Wikipedia, sans clé) ---------- */
  function attachPoster(id, url) {
    const card = cards.get(id);
    if (!card || card.querySelector(".poster-main")) return;
    const box = card.querySelector(".poster");
    const img = new Image();
    img.className = "poster-main";
    img.alt = "";
    img.decoding = "async";
    img.loading = "lazy";
    img.referrerPolicy = "no-referrer";
    img.onload = () => {
      if (img.naturalWidth > img.naturalHeight * 0.85) {
        box.classList.add("wide");
        const fill = new Image();
        fill.className = "poster-fill loaded";
        fill.alt = "";
        fill.src = url;
        box.insertBefore(fill, img);
      }
      img.classList.add("loaded");
      box.querySelector(".poster-fallback").style.visibility = "hidden";
    };
    img.src = url;
    box.insertBefore(img, box.querySelector(".badge, .check"));
    if (id === "doomsday") setHeroBg(url);
    if (id === nextId) $("nextPoster").src = url;
  }

  const setHeroBg = (url) => {
    const bg = $("heroBg");
    const probe = new Image();
    probe.onload = () => { bg.style.backgroundImage = `url("${url}")`; bg.classList.add("ready"); };
    probe.src = url;
  };

  const queryWiki = async (titles) => {
    const params = new URLSearchParams({
      action: "query", prop: "pageimages", piprop: "thumbnail", pithumbsize: "500",
      pilicense: "any", redirects: "1", format: "json", formatversion: "2", origin: "*",
      titles: titles.join("|"),
    });
    const res = await fetch("https://en.wikipedia.org/w/api.php?" + params);
    if (!res.ok) throw new Error("Wikipedia " + res.status);
    const { query } = await res.json();
    const back = {};
    (query.normalized || []).forEach((n) => { back[n.to] = n.from; });
    (query.redirects || []).forEach((r) => { back[r.to] = back[r.from] || r.from; });
    const out = {};
    for (const p of query.pages || []) {
      if (!p.thumbnail) continue;
      out[back[p.title] || p.title] = p.thumbnail.source;
      out[p.title] = p.thumbnail.source;
    }
    return out;
  };

  const fetchPosters = async () => {
    let pending = allItems.filter((it) => !posters[it.id]);
    for (let attempt = 0; attempt < 3 && pending.length; attempt++) {
      const wanted = pending.map((it) => it.wiki[attempt]).filter(Boolean);
      const titles = [...new Set(wanted)];
      const found = {};
      for (let i = 0; i < titles.length; i += 40) {
        try { Object.assign(found, await queryWiki(titles.slice(i, i + 40))); }
        catch { return; } // hors ligne : on garde les cartes de secours
      }
      for (const it of pending) {
        const url = found[it.wiki[attempt]];
        if (url) { posters[it.id] = url; attachPoster(it.id, url); }
      }
      pending = pending.filter((it) => !posters[it.id]);
    }
    store.set(POSTER_KEY, posters);
  };

  /* ---------- Compte à rebours ---------- */
  const release = new Date(DOOMSDAY_RELEASE).getTime();
  const pad = (n) => String(n).padStart(2, "0");
  const prev = {};
  const setUnit = (el, val) => {
    if (prev[el] === val) return;
    prev[el] = val;
    const node = $(el);
    node.textContent = val;
    node.classList.remove("tick");
    void node.offsetWidth;
    node.classList.add("tick");
  };
  const tickCountdown = () => {
    const diff = release - Date.now();
    if (diff <= 0) {
      const cd = $("countdown");
      cd.classList.add("released");
      cd.innerHTML = '<div class="released-msg">En salle maintenant</div>';
      $("heroSub").textContent = "Sorti le 16 décembre 2026";
      return false;
    }
    const s = Math.floor(diff / 1000);
    setUnit("cdD", String(Math.floor(s / 86400)));
    setUnit("cdH", pad(Math.floor((s % 86400) / 3600)));
    setUnit("cdM", pad(Math.floor((s % 3600) / 60)));
    setUnit("cdS", pad(s % 60));
    return true;
  };
  if (tickCountdown()) {
    const timer = setInterval(() => { if (!tickCountdown()) clearInterval(timer); }, 1000);
  }

  /* ---------- Sauvegarde / restauration ---------- */
  $("exportBtn").addEventListener("click", async () => {
    const code = btoa([...seen].join(","));
    try {
      await navigator.clipboard.writeText(code);
      showToast("Sauvegarde copiée", null);
    } catch {
      prompt("Copie ce code :", code);
    }
  });
  $("importBtn").addEventListener("click", () => {
    const code = prompt("Colle ton code de sauvegarde :");
    if (!code) return;
    try {
      const ids = atob(code.trim()).split(",").filter((id) => byId.has(id));
      if (!ids.length) throw new Error("vide");
      const before = [...seen];
      seen.clear();
      ids.forEach((id) => seen.add(id));
      saveSeen();
      updateUI();
      showToast(`${ids.length} titres restaurés`, () => { seen.clear(); before.forEach((id) => seen.add(id)); saveSeen(); updateUI(); });
    } catch {
      showToast("Code invalide : vérifie qu'il est complet", null);
    }
  });

  /* ---------- Démarrage ---------- */
  render();
  try {
    const f = sessionStorage.getItem("marvel-filter");
    if (f) document.querySelector(`.seg button[data-filter="${f}"]`)?.click();
  } catch { /* ignoré */ }
  updateUI();
  fetchPosters();
})();
