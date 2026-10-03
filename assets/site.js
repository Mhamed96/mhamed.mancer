/* Builds the header, footer and every page from data.js. You do not need to edit this file. */
(function () {
  "use strict";
  const S = SITE;
  const app = document.getElementById("app");
  const page = app.dataset.page;
  document.body.dataset.page = page;

  /* ---------- helpers ---------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (v) => String(v == null ? "" : v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const COLORS = ["teal", "indigo", "coral", "green", "amber"];
  const cyc = (i) => COLORS[((i % 5) + 5) % 5];
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const parse = (iso) => { const p = String(iso).split("-").map(Number); return new Date(p[0], (p[1] || 1) - 1, p[2] || 1); };
  const fmt = (iso, withYear) => parse(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: withYear ? "numeric" : undefined });
  const daysSince = (iso) => Math.round((today - parse(iso)) / 864e5);
  const isExternal = (u) => /^https?:\/\//i.test(u);
  const linkAttrs = (u) => (isExternal(u) || /\.pdf($|\?)/i.test(u) ? ' target="_blank" rel="noopener"' : "");
  const a = (u, label, cls) => `<a${cls ? ` class="${cls}"` : ""} href="${esc(u)}"${linkAttrs(u)}>${esc(label)}</a>`;
  const byYearDesc = (list) => list.slice().sort((x, y) => y.year - x.year);
  const courseColor = (c, i) => c.color || cyc(i);

  const ICON = {
    doc: '<path d="M4 1.75h5.2L12.5 5v9.25H4z"/><path d="M9 1.75V5h3.5"/>',
    pencil: '<path d="M2.5 13.5l.7-3L10.8 3l2.2 2.2-7.6 7.6z"/>',
    check: '<circle cx="8" cy="8" r="6"/><path d="M5.3 8.2l1.9 1.9 3.5-3.7"/>',
    code: '<path d="M5.5 4.5L2 8l3.5 3.5M10.5 4.5L14 8l-3.5 3.5"/>',
    list: '<path d="M5.5 4h8M5.5 8h8M5.5 12h8M2.5 4h.1M2.5 8h.1M2.5 12h.1"/>',
    book: '<path d="M2.5 3.2c2-.8 3.8-.6 5.5.6 1.7-1.2 3.5-1.4 5.5-.6v9c-2-.8-3.8-.6-5.5.6-1.7-1.2-3.5-1.4-5.5-.6z"/><path d="M8 3.8v9"/>'
  };
  const KIND = {
    Lecture: ["indigo", "doc"], Slides: ["indigo", "doc"], Exercises: ["teal", "pencil"], Solutions: ["green", "check"],
    Lab: ["amber", "code"], Syllabus: ["coral", "list"], Exam: ["coral", "pencil"], Reading: ["green", "book"]
  };
  const ALIAS = { TD: "Exercises", TP: "Lab", Cours: "Lecture", Exercise: "Exercises", Notes: "Lecture" };
  const kindOf = (k) => { const n = ALIAS[k] || k; const d = KIND[n] || ["teal", "doc"]; return { name: n, c: d[0], i: d[1] }; };
  const TYPE_COLOR = { Journal: "indigo", Conference: "amber", Preprint: "coral", Book: "green", Thesis: "teal" };

  function fileChip(f) {
    const k = kindOf(f.kind);
    const released = !f.release || parse(f.release) <= today;
    const tag = `<span class="fk"><svg viewBox="0 0 16 16" aria-hidden="true">${ICON[k.i]}</svg>${esc(k.name)}</span>`;
    if (f.url && released) return `<a class="file c-${k.c}" href="${esc(f.url)}"${linkAttrs(f.url)}>${tag}<span>${esc(f.label)}</span></a>`;
    const note = f.url && f.release ? "available " + fmt(f.release) : "coming soon";
    return `<span class="file pending c-${k.c}">${tag}<span>${esc(f.label)}</span><em>${note}</em></span>`;
  }
  const availableFiles = (w) => w.files.filter((f) => f.url && (!f.release || parse(f.release) <= today));

  function entries(list) {
    return list.map((r) => `<div class="entry"><div class="when">${esc(r.year)}</div><div class="what"><p class="lead">${esc(r.text)}</p>${r.note ? `<p>${esc(r.note)}</p>` : ""}</div></div>`).join("");
  }
  function timeline(list) {
    return list.map((r) => `<div class="entry"><div class="when">${esc(r.years)}</div><div class="what"><h3>${esc(r.title)}</h3><p class="lead">${esc(r.place)}</p>${r.note ? `<p>${esc(r.note)}</p>` : ""}</div></div>`).join("");
  }
  const section = (title, inner, opts) => {
    opts = opts || {};
    return `<section class="sec${opts.cls ? " " + opts.cls : ""}"${opts.id ? ` id="${opts.id}"` : ""}><h2>${esc(title)}</h2><div class="sec-body">${inner}${opts.more ? `<a class="more" href="${opts.more[0]}">${esc(opts.more[1])}</a>` : ""}</div></section>`;
  };
  const pageHead = (title, sub, extra) => `<div class="pagewrap"><div class="wrap pagehead"><h1>${esc(title)}</h1><p>${esc(sub)}</p>${extra || ""}</div></div>`;

  async function copyText(text, btn, done) {
    const old = btn.textContent;
    try { await navigator.clipboard.writeText(text); btn.textContent = done || "Copied"; }
    catch (e) {
      try {
        const t = document.createElement("textarea"); t.value = text; t.style.cssText = "position:fixed;opacity:0";
        document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove(); btn.textContent = done || "Copied";
      } catch (e2) { btn.textContent = "Press Ctrl+C"; }
    }
    setTimeout(() => { btn.textContent = old; }, 1600);
  }

  /* ---------- publications: citation and BibTeX ---------- */
  const bibKey = (p) => {
    const last = p.authors.split(/,| and /)[0].trim().split(/\s+/).pop();
    const word = (p.title.split(/\s+/).find((w) => w.length > 3) || "paper");
    return (last + p.year + word).replace(/[^A-Za-z0-9]/g, "");
  };
  function bibtex(p) {
    if (p.bibtex) return p.bibtex;
    const au = p.authors.split(/\s*,\s*/).join(" and ");
    const kind = p.type === "Journal" ? ["article", "journal"] : p.type === "Conference" ? ["inproceedings", "booktitle"] : ["misc", "howpublished"];
    return `@${kind[0]}{${bibKey(p)},\n  author = {${au}},\n  title = {${p.title}},\n  ${kind[1]} = {${p.venue}},\n  year = {${p.year}}\n}`;
  }
  const citation = (p) => `${p.authors} (${p.year}). ${p.title}. ${p.venue}.`;
  function authorsHtml(p) {
    const me = esc(S.authorName || "");
    const s = esc(p.authors);
    return me ? s.split(me).join(`<strong>${me}</strong>`) : s;
  }
  function pubHtml(p, i, showYear) {
    const c = TYPE_COLOR[p.type] || "teal";
    return `<article class="entry pub c-${c}"><div class="when">${showYear ? esc(p.year) : ""}</div><div class="what">
      <span class="kind">${esc(p.type)}</span><h3>${esc(p.title)}</h3>
      <p class="meta">${authorsHtml(p)}</p><p class="meta">${esc(p.venue)}</p>
      <div class="plinks">${(p.links || []).map((l) => a(l.url, l.label)).join("")}<button type="button" data-act="cite" data-i="${i}">Copy citation</button><button type="button" data-act="bib" data-i="${i}">Copy BibTeX</button></div></div></article>`;
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-act]");
    if (!b) return;
    const p = S.publications[Number(b.dataset.i)];
    if (b.dataset.act === "cite") copyText(citation(p), b, "Citation copied");
    if (b.dataset.act === "bib") copyText(bibtex(p), b, "BibTeX copied");
    if (b.dataset.act === "mail") copyText(S.email, b, "Email copied");
  });

  /* ---------- latest activity ---------- */
  function latestWeeks() {
    const out = [];
    S.courses.forEach((c, ci) => c.weeks.forEach((w) => out.push({ c, ci, w })));
    return out.sort((x, y) => y.w.date.localeCompare(x.w.date));
  }
  function feed(limit) {
    const live = (i) => parse(i.date) <= today;
    const news = S.news.map((n) => ({ date: n.date, kind: "News", c: "coral", text: n.text, url: n.url })).filter(live)
      .sort((x, y) => y.date.localeCompare(x.date)).slice(0, Math.ceil(limit / 2));
    const material = latestWeeks().map((x) => ({ date: x.w.date, kind: "Course material", c: courseColor(x.c, x.ci), text: `${x.c.code}, week ${x.w.n}: ${x.w.topic}`, url: `teaching.html#${x.c.id}` }))
      .filter(live).slice(0, limit - news.length);
    return news.concat(material).sort((x, y) => y.date.localeCompare(x.date));
  }

  /* ---------- header, footer, theme ---------- */
  const NAV = [
    ["home", "index.html", "Home", "teal"], ["research", "research.html", "Research", "indigo"],
    ["publications", "publications.html", "Publications", "coral"], ["teaching", "teaching.html", "Teaching", "green"], ["cv", "cv.html", "CV", "amber"]
  ];
  $("#hdr").innerHTML = `<span id="top"></span><a class="skip" href="#main">Skip to content</a>
    <div class="stripe" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
    <header class="bar"><div class="wrap bar-in">
      <a class="brand" href="index.html">${esc(S.name)}</a>
      <nav class="nav" id="nav" aria-label="Main">${NAV.map((n) => `<a class="c-${n[3]}" href="${n[1]}"${n[0] === page ? ' aria-current="page"' : ""}>${n[2]}</a>`).join("")}</nav>
      <button type="button" class="mode" id="mode">Dark</button>
      <button type="button" class="menu-btn" id="menuBtn" aria-expanded="false" aria-controls="nav">Menu</button>
    </div></header>`;
  $("#ftr").innerHTML = `<footer class="foot"><div class="wrap foot-in">
      <div><strong>${esc(S.name)}</strong><br>${esc(S.role)}<br>${esc(S.institution)}</div>
      <div class="linkrow">${S.ids.map((l) => a(l.url, l.label)).join("")}</div>
      <div>${new Date().getFullYear()} ${esc(S.name)}<br><a href="#top">Back to top</a></div></div></footer>`;

  const root = document.documentElement;
  const isDark = () => (root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches);
  const paintMode = () => { $("#mode").textContent = isDark() ? "Light" : "Dark"; };
  $("#mode").addEventListener("click", () => {
    const next = isDark() ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    paintMode();
  });
  paintMode();
  const menuBtn = $("#menuBtn"), nav = $("#nav");
  menuBtn.addEventListener("click", () => { const open = nav.classList.toggle("open"); menuBtn.setAttribute("aria-expanded", String(open)); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); } });

  /* ---------- document title, description, structured data, icon ---------- */
  const TITLES = { home: "", research: "Research", publications: "Publications", teaching: "Teaching", cv: "CV and contact", notfound: "Page not found" };
  document.title = TITLES[page] ? `${TITLES[page]} | ${S.name}` : `${S.name}, ${S.role}`;
  const setMeta = (attr, key, val) => {
    let m = document.querySelector(`meta[${attr}="${key}"]`);
    if (!m) { m = document.createElement("meta"); m.setAttribute(attr, key); document.head.appendChild(m); }
    m.setAttribute("content", val);
  };
  setMeta("name", "description", S.description);
  setMeta("property", "og:title", document.title);
  setMeta("property", "og:description", S.description);
  setMeta("property", "og:type", "website");
  const ld = document.createElement("script");
  ld.type = "application/ld+json";
  ld.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "Person", name: S.name, jobTitle: S.role, email: S.email, url: S.siteUrl || undefined, affiliation: { "@type": "CollegeOrUniversity", name: S.institution }, sameAs: S.ids.map((i) => i.url) });
  document.head.appendChild(ld);
  const fav = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' fill='#14202b'/><text x='32' y='41' font-family='Georgia,serif' font-size='28' font-weight='700' text-anchor='middle' fill='#fff'>" + esc(S.initials) + "</text><rect y='54' width='13' height='10' fill='#0a6a71'/><rect x='13' y='54' width='13' height='10' fill='#3d4fc2'/><rect x='26' y='54' width='12' height='10' fill='#c0392b'/><rect x='38' y='54' width='13' height='10' fill='#1f7040'/><rect x='51' y='54' width='13' height='10' fill='#8a5500'/></svg>";
  let icon = document.querySelector('link[rel="icon"]');
  if (!icon) { icon = document.createElement("link"); icon.rel = "icon"; document.head.appendChild(icon); }
  icon.type = "image/svg+xml"; icon.href = "data:image/svg+xml," + encodeURIComponent(fav);

  /* ---------- shared blocks ---------- */
  const contactBlock = () => `<div class="mailrow"><a class="mail" href="mailto:${esc(S.email)}">${esc(S.email)}</a><button type="button" data-act="mail">Copy email</button></div>
    <div class="contact-list">${S.contact.map((c) => `<div class="entry"><div class="when">${esc(c.label)}</div><div class="what"><p class="lead">${esc(c.value)}</p></div></div>`).join("")}</div>`;

  /* ---------- pages ---------- */
  const pages = {
    home() {
      const recent = feed(6);
      const sel = byYearDesc(S.publications.filter((p) => p.selected));
      const pubList = sel.length ? sel.slice(0, 4) : byYearDesc(S.publications).slice(0, 3);
      const figures = [{ value: S.publications.length, label: "publications" }, { value: S.courses.length, label: "courses this term" }].concat(S.figures || []);
      const photo = S.photo ? `<img src="${esc(S.photo)}" alt="Portrait of ${esc(S.name)}">` : `<span aria-hidden="true">${esc(S.initials)}</span>`;
      app.innerHTML = `
      <div class="hero"><div class="wrap hero-grid">
        <div>
          <h1>${esc(S.name)}</h1>
          <p class="role">${esc(S.role)}</p><p class="inst">${esc(S.institution)}</p>
          <p class="lede">${esc(S.lede)}</p>
          <ul class="interests">${(S.interests || []).map((t, i) => `<li class="c-${cyc(i + 1)}">${esc(t)}</li>`).join("")}</ul>
          <div class="actions"><a class="btn" href="teaching.html">Course materials</a><a class="btn plain" href="publications.html">Publications</a></div>
          <div class="linkrow">${a(S.cv, "Download CV")}${S.ids.map((l) => a(l.url, l.label)).join("")}</div>
        </div>
        <div class="portrait"><div class="spine" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div><div class="ph">${photo}</div></div>
      </div></div>
      <div class="wrap">
        ${section("Latest", recent.map((r) => `<div class="entry c-${r.c}"><div class="when">${esc(fmt(r.date, true))}</div><div class="what"><span class="kind">${esc(r.kind)}</span><p class="lead">${r.url ? a(r.url, r.text) : esc(r.text)}</p></div></div>`).join(""), { id: "latest", cls: "c-coral" })}
        ${section("About", `<div class="bio">${S.bio.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
          <dl class="figures">${figures.map((f) => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join("")}</dl>`, { id: "about", more: ["cv.html", "Full CV and contact"], cls: "c-teal" })}
        ${section("Research", S.research.map((r, i) => `<div class="theme c-${cyc(i + 1)}"><h3>${esc(r.title)}</h3><p>${esc(r.text)}</p></div>`).join(""), { more: ["research.html", "More on my research"], cls: "c-indigo" })}
        ${section("Teaching", S.courses.map((c, ci) => {
          const w = c.weeks.slice().sort((x, y) => y.n - x.n)[0];
          return `<div class="entry c-${courseColor(c, ci)}"><div class="when">${esc(c.code)}</div><div class="what"><h3>${a("teaching.html#" + c.id, c.title)}</h3><p>${esc(c.term)}</p>
            ${w ? `<p class="lead">Latest: week ${w.n}, ${esc(w.topic)}</p><div class="files">${availableFiles(w).map(fileChip).join("")}</div>` : ""}</div></div>`;
        }).join(""), { more: ["teaching.html", "All course materials"], cls: "c-green" })}
        ${section(sel.length ? "Selected publications" : "Recent publications", pubList.map((p) => pubHtml(p, S.publications.indexOf(p), true)).join(""), { more: ["publications.html", "All publications"], cls: "c-coral" })}
        ${section("Contact", contactBlock(), { id: "contact", cls: "c-amber" })}
      </div>`;
    },

    research() {
      const op = S.opening;
      app.innerHTML = pageHead("Research", S.lede) + `<div class="wrap">
        ${section("Themes", S.research.map((r, i) => `<div class="theme c-${cyc(i + 1)}"><h3>${esc(r.title)}</h3><p>${esc(r.text)}</p><ul class="kw">${(r.kw || []).map((k) => `<li>${esc(k)}</li>`).join("")}</ul></div>`).join(""), { cls: "c-indigo" })}
        ${section("Projects and funding", S.projects.map((p, i) => `<div class="entry c-${cyc(i + 1)}"><div class="when">${esc(p.years)}</div><div class="what"><h3>${esc(p.title)}</h3><p class="lead">${esc(p.text)}</p><p>${esc(p.funding)}</p></div></div>`).join(""), { cls: "c-teal" })}
        ${section("Supervision", entries(S.students), { cls: "c-coral" })}
        ${op ? section(op.title, `<div class="callout"><p class="lead">${esc(op.text)}</p><a class="btn" href="mailto:${esc(S.email)}">Write to me</a></div>`, { cls: "c-amber" }) : ""}
      </div>`;
    },

    publications() {
      app.innerHTML = pageHead("Publications", "Journal articles, conference papers and preprints. Each entry has a citation and a BibTeX record you can copy.") + `<div class="wrap">
        <section class="sec c-coral"><h2>All publications</h2><div class="sec-body">
          <div class="tools">
            <input class="field" type="search" id="q" placeholder="Search title, author or journal" aria-label="Search publications" autocomplete="off">
            <select class="field" id="yr" aria-label="Filter by year"></select>
            <span id="types" role="group" aria-label="Filter by type" style="display:contents"></span>
            <button type="button" class="toggle" id="selOnly" aria-pressed="false">Selected only</button>
            <span class="count" id="count" aria-live="polite"></span>
          </div>
          <div id="list"></div>
        </div></section></div>`;
      const years = Array.from(new Set(S.publications.map((p) => p.year))).sort((x, y) => y - x);
      $("#yr").innerHTML = `<option value="">All years</option>` + years.map((y) => `<option value="${y}">${y} (${S.publications.filter((p) => p.year === y).length})</option>`).join("");
      const types = ["All"].concat(Array.from(new Set(S.publications.map((p) => p.type))));
      $("#types").innerHTML = types.map((t) => `<button type="button" class="toggle" data-t="${esc(t)}" aria-pressed="${t === "All"}">${esc(t)}</button>`).join("");
      if (!S.publications.some((p) => p.selected)) $("#selOnly").hidden = true;
      const st = { t: "All", q: "", y: "", sel: false };
      function draw() {
        const q = st.q.trim().toLowerCase();
        const list = byYearDesc(S.publications.filter((p) =>
          (st.t === "All" || p.type === st.t) && (!st.y || String(p.year) === st.y) && (!st.sel || p.selected) &&
          (!q || (p.title + " " + p.authors + " " + p.venue).toLowerCase().includes(q))));
        $("#count").textContent = `${list.length} of ${S.publications.length}`;
        let last = null;
        $("#list").innerHTML = list.map((p) => { const html = pubHtml(p, S.publications.indexOf(p), p.year !== last); last = p.year; return html; }).join("")
          || `<p class="empty">No publication matches. Clear the search or choose another year or type.</p>`;
        $$("#types button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.t === st.t)));
        $("#selOnly").setAttribute("aria-pressed", String(st.sel));
      }
      $("#q").addEventListener("input", (e) => { st.q = e.target.value; draw(); });
      $("#yr").addEventListener("change", (e) => { st.y = e.target.value; draw(); });
      $("#types").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { st.t = b.dataset.t; draw(); } });
      $("#selOnly").addEventListener("click", () => { st.sel = !st.sel; draw(); });
      draw();
    },

    teaching() {
      const courses = S.courses;
      let cid = (location.hash || "").slice(1);
      if (!courses.some((c) => c.id === cid)) cid = courses[0].id;
      app.innerHTML = pageHead("Teaching", "Lecture notes, exercise sheets and solutions are added every week. The newest week is at the top.") + `<div class="wrap">
        <section class="sec c-green"><h2>This term</h2><div class="sec-body">
          <div class="tabs" id="tabs" role="tablist" aria-label="Courses"></div>
          <div id="view" role="tabpanel"></div>
        </div></section>
        ${(S.archive && S.archive.length) ? section("Previous terms", S.archive.map((t) => `<div class="entry"><div class="when">${esc(t.term)}</div><div class="what"><ul>${t.items.map((i) => `<li>${i.url ? a(i.url, i.code + " " + i.title) : esc(i.code + " " + i.title)}</li>`).join("")}</ul></div></div>`).join(""), { cls: "c-amber terms" }) : ""}
      </div>`;
      const weekHtml = (c, w, open) => {
        const fresh = daysSince(w.date) >= 0 && daysSince(w.date) <= 8;
        const n = availableFiles(w).length;
        return `<details class="week"${open ? " open" : ""}><summary>
          <span class="wnum"><small>Week</small>${esc(w.n)}</span>
          <span class="wt"><strong>${esc(w.topic)}</strong>${fresh ? '<span class="fresh">New</span>' : ""}<small>${esc(fmt(w.date, true))}, ${n} of ${w.files.length} files available</small></span>
          <span class="chev" aria-hidden="true"></span></summary>
          <div class="wbody">${w.note ? `<p class="lead" style="margin-bottom:12px">${esc(w.note)}</p>` : ""}<div class="files">${w.files.map(fileChip).join("")}</div></div></details>`;
      };
      function drawTabs() {
        $("#tabs").innerHTML = courses.map((c, i) => `<button type="button" role="tab" id="tab-${c.id}" class="tab c-${courseColor(c, i)}" aria-selected="${c.id === cid}" tabindex="${c.id === cid ? 0 : -1}" data-id="${c.id}"><span class="tcode">${esc(c.code)}</span><span class="ttitle">${esc(c.title)}</span></button>`).join("");
      }
      function drawView() {
        const ci = courses.findIndex((c) => c.id === cid), c = courses[ci];
        const weeks = c.weeks.slice().sort((x, y) => y.n - x.n);
        $("#view").setAttribute("aria-labelledby", "tab-" + c.id);
        $("#view").className = "c-" + courseColor(c, ci);
        $("#view").innerHTML = `<div class="course-head"><h3>${esc(c.title)}</h3><p class="term">${esc(c.code)}, ${esc(c.term)}</p><p>${esc(c.about)}</p>
          ${(c.schedule && c.schedule.length) ? `<dl class="sched">${c.schedule.map((s) => `<dt>${esc(s.label)}</dt><dd>${esc(s.value)}</dd>`).join("")}</dl>` : ""}
          ${(c.announcements || []).slice().sort((x, y) => y.date.localeCompare(x.date)).map((n) => `<div class="notice"><time>${esc(fmt(n.date, true))}</time>${esc(n.text)}</div>`).join("")}</div>
          <div class="wtools"><input class="field" type="search" id="wq" placeholder="Search this course" aria-label="Search this course" autocomplete="off">
            <button type="button" class="toggle" id="openAll">Open all weeks</button><button type="button" class="toggle" id="closeAll">Close all</button></div>
          <div id="weeks"></div>`;
        const drawWeeks = () => {
          const q = $("#wq").value.trim().toLowerCase();
          const shown = weeks.filter((w) => !q || (w.topic + " " + w.files.map((f) => f.kind + " " + f.label).join(" ")).toLowerCase().includes(q));
          $("#weeks").innerHTML = shown.map((w, i) => weekHtml(c, w, q ? true : i < 2)).join("") || `<p class="empty">Nothing in this course matches your search.</p>`;
        };
        $("#wq").addEventListener("input", drawWeeks);
        $("#openAll").addEventListener("click", () => $$("#weeks details").forEach((d) => { d.open = true; }));
        $("#closeAll").addEventListener("click", () => $$("#weeks details").forEach((d) => { d.open = false; }));
        drawWeeks();
      }
      function select(id, focus) {
        cid = id; drawTabs(); drawView();
        try { history.replaceState(null, "", "#" + id); } catch (e) {}
        if (focus) $("#tab-" + id).focus();
      }
      $("#tabs").addEventListener("click", (e) => { const b = e.target.closest(".tab"); if (b) select(b.dataset.id, false); });
      $("#tabs").addEventListener("keydown", (e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        const i = courses.findIndex((c) => c.id === cid);
        const n = courses[(i + (e.key === "ArrowRight" ? 1 : courses.length - 1)) % courses.length];
        select(n.id, true);
      });
      drawTabs(); drawView();
    },

    cv() {
      app.innerHTML = pageHead("CV and contact", `${S.role}, ${S.institution}`, `<div class="actions noprint"><a class="btn" href="${esc(S.cv)}" target="_blank" rel="noopener">Download CV as PDF</a><button type="button" class="btn plain" id="print">Print this page</button></div>`) + `<div class="wrap">
        ${section("Positions", timeline(S.positions), { cls: "c-teal" })}
        ${section("Education", timeline(S.education), { cls: "c-indigo" })}
        ${section("Awards and grants", entries(S.awards), { cls: "c-amber" })}
        ${section("Invited talks", entries(S.talks), { cls: "c-coral" })}
        ${section("Supervision", entries(S.students), { cls: "c-green" })}
        ${(S.service && S.service.length) ? section("Service", entries(S.service), { cls: "c-teal" }) : ""}
        ${section("Contact", contactBlock(), { id: "contact", cls: "c-amber" })}
      </div>`;
      $("#print").addEventListener("click", () => window.print());
    },

    notfound() {
      app.innerHTML = pageHead("Page not found", "This address does not exist on the site. Use the menu, or go back to the home page.", `<div class="actions"><a class="btn" href="index.html">Go to the home page</a></div>`);
    }
  };
  pages[page]();
})();
