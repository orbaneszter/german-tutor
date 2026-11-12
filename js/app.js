// German C2 Tutor: drill trainer (M1), production trainer and feedback bridge (M2),
// error log and progress (M3), exam tools (M4). Runs offline; data stays in this browser
// and, if sync is set up, in a private GitHub repository of the user's own.
"use strict";
(function () {

const KEY = "germanTutor.v1";
const PLACEMENT_KEY = "placementTest.v1";
const SYNC_KEY = "germanTutor.sync";      // per device: repository and access key, never synced or backed up
const TYPE_NAMES = { L: "Gap fill", T: "Transformation", E: "Find the error", O: "Word order", S: "Combine sentences", M: "Multiple choice" };
const OPEN_TYPES = ["T", "S", "E"];          // more than one answer can be right: unmatched answers are "unsure"
const TIME_LIMIT = { L: 25, M: 20, O: 40, T: 60, S: 60, E: 45 };  // seconds per item in timed mode
const SPRINT_LIMIT = { L: 15, M: 8 };       // seconds per item in the endings sprint
const SPRINT_GOAL = { pct: 90, sec: 8 };    // plan v3: 90% right at under 8 seconds an item
const CAT_NAMES = { G1: "Gender (der, die, das)", G2: "Choosing the case", G3: "Ending pattern" };
// Error categories for writing and speaking feedback (plan v3, section 7).
const ERR_CATS = { G1: "gender", G2: "case", G3: "ending pattern", W: "word order", V: "verb form, tense or mood", P: "preposition or government",
  L: "word choice or collocation", R: "register or style", K: "connector or cohesion", O: "spelling or punctuation" };
const REVIEW_MODES = ["mixed", "check", "warm"];     // the modes that count towards mastery
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// ---------- State ----------

function fresh() {
  return {
    v: 1, created: new Date().toISOString(),
    settings: { track: "J", unit: "1", unitWeek: 1, startDate: "2026-11-16", examDate: "" },
    settingsT: 0,      // when the settings last changed (the newer side wins in sync)
    placement: null,
    attempts: [],      // { id, u, n, t, r: R|W|U, m: mode, a?: answer }
    unsure: [],        // { k, id, a, t } answers waiting for Claude's verdict
    extra: {},         // item id → extra accepted answers
    flags: {},         // item id → { note, t, a }
    drafts: {},        // task id → { text, t }
    production: [],    // finished production tasks with Claude's feedback
    errorLog: [],      // { date, unit, node, error, correction, rule, task, src }
    cards: [],         // { k, front, back, tags, t, exported }
    checkpoints: [],   // { t, right, n, units: { u: [right, n] } }
    sprints: [],       // { t, right, n, sec, cats: { G1: [right, n] } } endings sprints
    mocks: [],         // { date, module, source, score, t }
    time: [],          // { t, k: A|B|anki|listen, min } study time log
    gone: {},          // deleted things, key → time, so sync doesn't bring them back
    flagsCleared: 0,
    lastBackup: null
  };
}

// Fills a stored state up with the fields newer versions added.
function adopt(s) {
  const f = fresh();
  const st = Object.assign(f, s, { settings: Object.assign(f.settings, s.settings) });
  if (!GT.TRACKS[st.settings.track]) st.settings.track = "J";
  return st;
}
function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (s && s.v === 1) return adopt(s);
  } catch (e) { /* unreadable: start fresh */ }
  return fresh();
}

let S = load();
let saveFailed = false;
let lastSettings = JSON.stringify(S.settings);
function store() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); saveFailed = false; }
  catch (e) { if (!saveFailed) toast("Could not save: browser storage is full or blocked. Download a backup in Setup."); saveFailed = true; }
}
function save() {
  const now = JSON.stringify(S.settings);
  if (now !== lastSettings) { S.settingsT = Date.now(); lastSettings = now; }
  store();
  syncSoon();
}
function forget(k) { S.gone[k] = Date.now(); }
let saveTimer = null;
function saveSoon() { clearTimeout(saveTimer); saveTimer = setTimeout(save, 600); }

// ---------- Utilities ----------

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pct = (r, n) => n ? Math.round(r / n * 100) : null;
const view = () => $("#view");

function localDate(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
// Week number counted in Monday-to-Sunday weeks, so consecutive weeks differ by exactly 1.
function weekIdx(t) {
  const d = new Date(t);
  return Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5 + 3) / 7);
}
function daysAgo(iso) { return iso ? Math.floor((Date.now() - new Date(iso).getTime()) / 864e5) : null; }
function mmss(ms) { const s = Math.max(0, Math.ceil(ms / 1000)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; }
function wordCount(t) { return (t.trim().match(/\S+/g) || []).length; }

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function weightedSample(pool, weightOf, n) {
  const items = pool.map(x => ({ x, w: weightOf(x) })), out = [];
  while (out.length < n && items.length) {
    let r = Math.random() * items.reduce((s, i) => s + i.w, 0), k = 0;
    while (k < items.length - 1 && (r -= items[k].w) > 0) k++;
    out.push(items.splice(k, 1)[0].x);
  }
  return out;
}

function download(name, text, type = "text/plain") {
  const blob = new Blob([text], { type: type + ";charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
  const ta = document.createElement("textarea");
  ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
  document.body.appendChild(ta); ta.select();
  const ok = document.execCommand("copy");
  ta.remove();
  return ok ? Promise.resolve() : Promise.reject();
}
function copyAndTell(text, what) {
  copyText(text).then(() => toast(`Copied${what ? " " + what : ""}. Paste it into your German tutor project in Claude.`),
    () => toast("Copy failed. Your browser blocked the clipboard."));
}
let toastTimer = null;
function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 3500);
}
function readFile(input) {
  return new Promise((res, rej) => {
    const f = input.files && input.files[0];
    if (!f) return rej(new Error("No file chosen"));
    const r = new FileReader(); r.onload = () => res(r.result); r.onerror = () => rej(r.error); r.readAsText(f, "utf-8");
  });
}
function csvField(s) { s = String(s ?? ""); return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; }
function parseCsv(text, sep = ";") {
  const rows = []; let row = [], f = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true;
    else if (c === sep) { row.push(f); f = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(f); rows.push(row); row = []; f = ""; }
    else f += c;
  }
  if (f || row.length) { row.push(f); rows.push(row); }
  return rows.filter(r => r.some(x => x.trim()));
}

// ---------- Exercise bank ----------

const ITEMS = {};
function loadBank() {
  return Promise.all(GT.BANK_FILES.map(f => new Promise(res => {
    const s = document.createElement("script");
    s.src = "data/" + f; s.onload = res;
    s.onerror = () => { console.warn("Exercise file missing:", f); res(); };
    document.head.appendChild(s);
  }))).then(() => {
    Object.values(GT.sets).forEach(set => set.items.forEach(it => { it.unit = String(it.unit); if (set.thread) it.thread = set.thread; ITEMS[it.id] = it; }));
  });
}
const unitItems = u => (GT.sets[String(u)] || { items: [] }).items;
const hasSet = u => unitItems(u).length > 0;

// ---------- Curriculum and track ----------

const ORDER = GT.UNITS.map(u => u.id);
const UNIT = id => GT.UNITS.find(u => u.id === String(id));
const unitName = id => (/^F/.test(id) ? id : "Unit " + id);
const unitTag = id => (/^\d+$/.test(id) ? String(id).padStart(2, "0") : id);
const trackName = t => (GT.TRACKS[t] ? GT.TRACKS[t].name : "No track chosen yet");

function placementRight(u) {
  const p = S.placement;
  if (!p || !p.units) return null;
  const e = p.units.find(x => String(x.unit) === String(u));
  return e && e.asked ? e.right : null;
}

// The unit sequence of a track: J follows plan v3, A–C the older plan v2.
function sequence(track = S.settings.track || "B") {
  const seq = [], two = track === "B" || track === "C";
  if (track === "J") { // plan v3: units 9–25 take two weeks, except the review unit 13 and unit 17
    for (let n = 1; n <= 34; n++) seq.push({ u: String(n), weeks: n >= 9 && n <= 25 && n !== 13 && n !== 17 ? 2 : 1 });
    return seq;
  }
  if (track === "C") ["F1", "F2", "F3", "F4", "F5"].forEach(u => seq.push({ u, weeks: 2 }));
  for (let n = 1; n <= 8; n++) {
    const u = String(n), r = placementRight(u);
    if (track === "A") { if (r === 3) continue; seq.push({ u, weeks: 1, short: r === 2 }); }
    else seq.push({ u, weeks: track === "C" ? 2 : 1 });
  }
  for (let n = 9; n <= 25; n++) seq.push({ u: String(n), weeks: two ? 2 : 1 });
  for (let n = 26; n <= 34; n++) seq.push({ u: String(n), weeks: 1 });
  return seq;
}
function seqPos() {
  const seq = sequence();
  let i = seq.findIndex(s => s.u === S.settings.unit);
  if (i < 0) { // current unit not on this track: take the next one that is
    const o = ORDER.indexOf(S.settings.unit);
    i = Math.max(0, seq.findIndex(s => ORDER.indexOf(s.u) > o));
  }
  return { seq, i, entry: seq[i] };
}
function moveUnit(dir) {
  const { seq, i, entry } = seqPos();
  let w = Math.min(S.settings.unitWeek || 1, entry.weeks);
  if (dir > 0) { if (w < entry.weeks) w++; else if (i < seq.length - 1) { S.settings.unit = seq[i + 1].u; w = 1; } }
  else { if (w > 1) w--; else if (i > 0) { S.settings.unit = seq[i - 1].u; w = seq[i - 1].weeks; } }
  S.settings.unitWeek = w; save(); render();
}
// All units up to and including the current one, in curriculum order (also units the track skipped).
function unitsSoFar() {
  const cur = ORDER.indexOf(S.settings.unit);
  const useF = S.settings.track === "C";
  return ORDER.filter((u, i) => i <= cur && (useF || !/^F/.test(u)));
}

// ---------- Cards for Anki ----------

function addCard(k, front, back, tags) {
  if (S.cards.some(c => c.k === k)) return false;
  S.cards.push({ k, front, back, tags, t: Date.now(), exported: false });
  return true;
}
function drillCard(it) {
  let front = it.instruction ? it.instruction + "\n" : "";
  if (it.type === "O") front += `${it.prompt}\n${it.start ? it.start + " … " : ""}${shuffle(it.words).join(" / ")}`;
  else if (it.type === "M") front += `${it.prompt}\n(${it.options.join(" | ")})`;
  else if (it.type === "E") front += `Find the error: ${it.prompt}`;
  else front += it.prompt;
  const back = `${solutionText(it)}\n${it.explain}`;
  addCard("d:" + it.id, front, back, `unit::${unitTag(it.unit)} node::${it.node} type::drill${it.thread ? " thread::" + it.thread : ""}`);
}
function ankiFile(cards) {
  const head = "#separator:Semicolon\n#html:false\n#notetype:Basic\n#deck:German C2\n#tags column:3\n";
  return head + cards.map(c => [c.front, c.back, c.tags].map(f => `"${String(f).replace(/"/g, '""')}"`).join(";")).join("\n") + "\n";
}
function exportCards(all) {
  const list = all ? S.cards : S.cards.filter(c => !c.exported);
  if (!list.length) { toast("No new cards to export."); return; }
  download(`anki-german-c2-${localDate()}${all ? "-all" : ""}.txt`, ankiFile(list));
  list.forEach(c => { c.exported = true; }); save(); render();
}
const newCards = () => S.cards.filter(c => !c.exported).length;

// ---------- Answer checking ----------

function norm(s) {
  return String(s ?? "").normalize("NFC")
    .replace(/[’‘‚`´]/g, "'").replace(/[„“”«»]/g, '"').replace(/[–—]/g, "-")
    .replace(/\s+/g, " ").trim()
    .replace(/\s+([,.;:!?])/g, "$1").replace(/[.!?]+$/, "")
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue")
    .replace(/Ä/g, "Ae").replace(/Ö/g, "Oe").replace(/Ü/g, "Ue").replace(/ß/g, "ss");
}
const loose = s => norm(s).toLowerCase().replace(/[,;:"'()!?.-]/g, " ").replace(/\s+/g, " ").trim();

function acceptedAnswers(it) { return it.answers.concat(S.extra[it.id] || []); }

function judge(it, given) {
  given = String(given ?? "").trim();
  if (!given) return { r: "W", note: "No answer." };
  const acc = acceptedAnswers(it);
  if (it.type === "E" && loose(given) === loose(it.prompt)) return { r: "W", note: "You left the sentence unchanged, but it contains one error." };
  if (acc.some(a => norm(a) === norm(given))) return { r: "R" };
  if (acc.some(a => loose(a) === loose(given))) {
    return it.type === "O" || it.type === "M" ? { r: "R" } : { r: "R", note: "Accepted, but compare capitalisation and punctuation with the solution." };
  }
  if (OPEN_TYPES.includes(it.type)) return { r: "U", note: "Your answer isn't on the list of accepted answers. It may still be right: compare it with the solution." };
  return { r: "W" };
}

// The full solution as a sentence (gap-fills show the whole sentence).
function solutionText(it) {
  const a = it.answers[0];
  if (it.type === "L" && it.prompt.includes("___")) return it.prompt.replace("___", a).replace(/\s*\([^)]*\)\s*$/, "");
  if (it.type === "M" && it.prompt.includes("___")) return it.prompt.replace("___", a);
  return a;
}

function record(it, r, mode, answer) {
  const t = Date.now();
  const a = { id: it.id, u: it.unit, n: it.node, t, r, m: mode };
  if (r !== "R") a.a = answer;
  S.attempts.push(a);
  if (r === "U") S.unsure.push({ k: it.id + "#" + t, id: it.id, a: answer, t });
  if (r === "W") drillCard(it);
  save();
  return a;
}
function changeResult(att, r) {
  const it = ITEMS[att.id];
  S.unsure = S.unsure.filter(u => u.k !== att.id + "#" + att.t);
  if (att.r === "W" && r !== "W") { S.cards = S.cards.filter(c => c.k !== "d:" + att.id || c.exported); forget("c:d:" + att.id); }
  att.r = r; att.c = Date.now();
  if (r === "U") S.unsure.push({ k: att.id + "#" + att.t, id: att.id, a: att.a, t: att.t });
  if (r === "W" && it) drillCard(it);
  save();
}
function lastResult(id) {
  for (let i = S.attempts.length - 1; i >= 0; i--) if (S.attempts[i].id === id) return S.attempts[i];
  return null;
}

// ---------- Router ----------

const ROUTES = { today: renderToday, drills: renderDrills, session: renderSession, write: renderWrite, progress: renderProgress, exam: renderExam, setup: renderSetup };
function route() { const h = location.hash.slice(1); return ROUTES[h] ? h : "today"; }
function go(r) { if (location.hash.slice(1) === r) render(); else location.hash = r; }
function render() {
  const r = route();
  if (r !== "session") stopItemTimer();
  if (r === "session" && !session) { go("drills"); return; }
  $$("#nav a").forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + (r === "session" ? "drills" : r)));
  ROUTES[r]();
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", render);

// ---------- Today ----------

const DAY = 864e5;
function parseDate(iso) { const [y, m, d] = iso.split("-").map(Number); return new Date(y, m - 1, d); }
function daysTo(iso) { const n = new Date(); return Math.round((parseDate(iso) - new Date(n.getFullYear(), n.getMonth(), n.getDate())) / DAY); }
// Calendar week of plan v3: 1 is the week of GT.PLAN.start; 0 or less is before the start.
function planWeek() { return Math.floor(-daysTo(GT.PLAN.start) / 7) + 1; }
function planEntry(w = planWeek()) { return GT.PLAN.weeks[w - 1] || null; }

// Study time this week (Monday to Sunday), in minutes.
function weekTime() {
  const w = weekIdx(Date.now()), list = S.time.filter(e => weekIdx(e.t) === w);
  const sum = k => list.filter(e => e.k === k).reduce((n, e) => n + e.min, 0);
  return { list, A: sum("A"), B: sum("B"), anki: sum("anki"), listen: sum("listen"), total: list.reduce((n, e) => n + e.min, 0) };
}
function logTime(k, min) { S.time.push({ t: Date.now(), k, min }); save(); render(); }

function unitNotes(u) {
  const n = GT.NOTES[u];
  if (!n) return "";
  const ul = list => `<ul class="list">${list.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`;
  return `<details><summary>The rule: ${esc(unitName(u))}</summary>
    <h3>Rules</h3>${ul(n.rules)}<h3>Model sentences</h3>${ul(n.models)}<h3>For Hungarian speakers</h3>${ul(n.hu)}</details>`;
}

// The two weekly sessions of plan v3 (section 5): [minutes, title, text, action].
function sessionSteps(u, week) {
  const second = week > 1;
  return {
    A: [
      [10, "Mixed warm-up", "12 items from earlier units, shuffled.", "warm"],
      [10, "Endings sprint", "20 genders and short phrases against the clock. Do it twice if there is time.", "sprint"],
      second ? [25, "Timed drill", "The same grammar against the clock.", "timed"]
        : [20, "The new rule", GT.NOTES[u] ? "Read the rule, the model sentences and the notes for Hungarian speakers below." : "Read the rule in your reference grammar: this unit has no page in the app yet.", null],
      [second ? 25 : 30, "Unit drills", "New items first, then the ones you missed.", "new"],
      [10, "Error spotting", "Find and correct the errors, then download the new Anki cards.", "E"]
    ],
    B: [
      [5, "Mixed warm-up", "12 items from earlier units, shuffled.", "warm"],
      [5, "Endings sprint", "20 genders and short phrases against the clock.", "sprint"],
      [35, "Writing task", second ? "The longer task or the speaking task of this unit." : "A timed text that needs this unit's grammar.", "write"],
      [25, "Feedback from Claude", "Copy for Claude, read the correction and paste the reply back. The errors go to the log and to Anki.", null],
      [10, "Unit drills, second round", "Only what you missed.", "new"],
      [10, "Weekly checkpoint", "20 items across all units so far.", "check"]
    ]
  };
}

function actionButton(a, u) {
  const map = {
    warm: ["Start warm-up", () => startSession("warm", u), unitsSoFar().some(hasSet)],
    sprint: ["Start sprint", () => startSession("sprint", u), threadItems("G").length > 0],
    new: ["Drill: new and missed", () => startSession("new", u), hasSet(u)],
    all: ["Drill the whole unit", () => startSession("all", u), hasSet(u)],
    E: ["Find the errors", () => startSession("E", u), unitItems(u).some(i => i.type === "E")],
    timed: ["Timed drill", () => startSession("timed", u), hasSet(u)],
    mixed: ["Mixed review", () => startSession("mixed", u), unitsSoFar().some(hasSet)],
    check: ["Weekly checkpoint", () => startSession("check", u), unitsSoFar().some(hasSet)],
    write: ["Open the task", () => {
      const t = unitTasks(u).find(x => x.current && x.kind !== "register") || unitTasks(u)[0];
      writeState.unit = u; writeState.task = t ? t.id : null; writeState.pending = null; go("write");
    }, !!GT.TASKS[u]]
  };
  return map[a];
}

function renderToday() {
  const { seq, i, entry } = seqPos();
  const u = entry.u, unit = UNIT(u), week = Math.min(S.settings.unitWeek || 1, entry.weeks);
  const onPlan = S.settings.track === "J";
  const pw = planWeek(), pe = planEntry(pw), left = daysTo(GT.PLAN.goal);
  const offPlan = onPlan && pe && pe.u && (pe.u !== u || (pe.w || 1) !== week);
  const wt = weekTime(), target = GT.PLAN.hours * 60;
  const backupAge = daysAgo(S.lastBackup);
  const nUnsure = S.unsure.length, nCards = newCards();
  const steps = sessionSteps(u, week), examBlock = Number(u) >= 26;
  const btns = [];
  const stepRows = list => list.map(([min, title, text, act]) => {
    let b = "";
    if (act) { const x = actionButton(act, u); btns.push(x[1]); b = `<button class="small" data-k="${btns.length - 1}" ${x[2] ? "" : "disabled"}>${esc(x[0])}</button>`; }
    return `<tr><td class="muted" style="white-space:nowrap">${min} min</td><td><b>${esc(title)}.</b> ${esc(text)}</td><td>${b}</td></tr>`;
  }).join("");
  const planLine = !onPlan ? ""
    : pw < 1 ? `Setup week. Week 1 starts on ${esc(GT.PLAN.start)}.`
    : !pe ? "The June calendar has ended. Phase 2 (C1 to C2) starts here."
    : `Plan week ${pw} of ${GT.PLAN.weeks.length}: ${pe.u ? esc(unitName(pe.u)) + (pe.w ? `, week ${pe.w}` : "") + (pe.note ? ". " : "") : ""}${esc(pe.note || "")}`;
  const doneTag = min => min ? `<span class="tag t-good">done this week</span>` : "";

  view().innerHTML = `
    <div class="card">
      <div class="row spread"><span class="muted">${esc(trackName(S.settings.track))}</span>
        <span class="muted">${onPlan && left >= 0 ? `${left} day${left === 1 ? "" : "s"} to the C1 practice exam` : `Step ${i + 1} of ${seq.length}`}</span></div>
      <h1>${esc(unitName(u))}: ${esc(unit.name)}</h1>
      <p class="muted">${unit.nodes.map(n => `<span class="tag t-acc">${n}</span> ${esc(GT.NODES[n])}`).join(" · ") || "No new grammar"}
        ${entry.weeks > 1 ? ` · <b>week ${week} of ${entry.weeks}</b>` : ""}
        ${entry.short ? ` · <span class="tag t-mid">short version: your placement score was 2/3</span>` : ""}</p>
      ${planLine ? `<p>${planLine} ${offPlan ? `<button id="toPlan" class="small">Go to the plan's unit</button>` : ""}</p>` : ""}
      ${!hasSet(u) && !examBlock && unit.nodes.length ? `<p class="note">There is no exercise set for this unit in the app yet. Claude Code writes sets two weeks ahead.</p>` : ""}
      <div class="row"><button id="prevU">← Previous</button><button id="nextU">${week < entry.weeks ? "Next week of this unit →" : "Finish unit →"}</button></div>
    </div>

    <div class="card">
      <div class="row spread"><h2>This week</h2><span><span class="stat">${(wt.total / 60).toFixed(1)}</span> of ${GT.PLAN.hours} hours</span></div>
      <div class="progress"><div style="width:${Math.min(100, Math.round(wt.total / target * 100))}%"></div></div>
      <p class="muted">Session A ${wt.A ? "✓" : "—"} · Session B ${wt.B ? "✓" : "—"} · Anki ${wt.anki} min · listening and reading ${wt.listen} min</p>
      <div class="row">
        <button data-t="A" data-min="90" ${wt.A ? "disabled" : ""}>Session A done</button>
        <button data-t="B" data-min="90" ${wt.B ? "disabled" : ""}>Session B done</button>
        <button data-t="anki" data-min="15">+ Anki (15 min)</button>
        <button data-t="listen" data-min="15">+ 15 min listening</button>
        <button data-t="listen" data-min="30">+ 30 min</button>
        <button id="undoT" class="small" ${wt.list.length ? "" : "disabled"}>Undo last</button>
      </div>
      <p class="note">The June goal needs about ${GT.PLAN.hours} hours a week: two sessions, 10–15 minutes of Anki on six days, and 25–30 minutes of listening or reading a day.</p>
    </div>

    <div class="card">
      <div class="row spread"><h2>Session A: ${week > 1 ? "more practice" : "new grammar"}</h2>${doneTag(wt.A)}</div>
      <div class="scroll"><table><tbody>${stepRows(steps.A)}</tbody></table></div>
      ${unitNotes(u)}
    </div>

    <div class="card">
      <div class="row spread"><h2>Session B: using it</h2>${doneTag(wt.B)}</div>
      ${examBlock ? `<p>Exam training block: use the <a href="#exam">exam tools</a> for timed modules and your mock scores.</p>` : ""}
      <div class="scroll"><table><tbody>${stepRows(steps.B)}</tbody></table></div>
    </div>

    <div class="grid2">
      <div class="card"><h2>Anki</h2><p><span class="stat">${nCards}</span> new card${nCards === 1 ? "" : "s"} to import</p>
        <button id="ankiBtn" ${nCards ? "" : "disabled"}>Download for Anki</button></div>
      <div class="card"><h2>Unsure answers</h2><p><span class="stat">${nUnsure}</span> waiting for Claude's verdict</p>
        <button id="unsureBtn" ${nUnsure ? "" : "disabled"}>Check them with Claude</button></div>
      <div class="card"><h2>${syncCfg ? "Sync" : "Backup"}</h2>
        ${syncCfg ? `<p>${esc(syncText())}</p><button id="syncBtn">Sync now</button>`
        : `<p>${backupAge === null ? "No backup yet." : `Last backup ${backupAge === 0 ? "today" : backupAge + " day" + (backupAge === 1 ? "" : "s") + " ago"}.`}
          ${backupAge === null || backupAge >= 7 ? ` <span class="tag t-mid">due</span>` : ""}</p>
          <button id="backupBtn">Download backup</button>`}</div>
    </div>`;

  $("#prevU").onclick = () => moveUnit(-1);
  $("#nextU").onclick = () => moveUnit(1);
  if ($("#toPlan")) $("#toPlan").onclick = () => { S.settings.unit = pe.u; S.settings.unitWeek = pe.w || 1; save(); render(); };
  $$("button[data-k]").forEach(b => { b.onclick = btns[b.dataset.k]; });
  $$("button[data-t]").forEach(b => { b.onclick = () => logTime(b.dataset.t, Number(b.dataset.min)); });
  $("#undoT").onclick = () => { const e = wt.list[wt.list.length - 1]; S.time = S.time.filter(x => x !== e); forget("t:" + e.t); save(); render(); };
  $("#ankiBtn").onclick = () => exportCards(false);
  $("#unsureBtn").onclick = () => go("drills");
  if ($("#backupBtn")) $("#backupBtn").onclick = backup;
  if ($("#syncBtn")) $("#syncBtn").onclick = () => syncNow(true);
}

// ---------- Drills: setup ----------

let drillUnit = null;
function renderDrills() {
  const units = ORDER.filter(hasSet);
  if (drillUnit === null || !hasSet(drillUnit)) drillUnit = hasSet(S.settings.unit) ? S.settings.unit : units[0];
  const items = unitItems(drillUnit || "");
  const seen = items.filter(it => lastResult(it.id)).length;
  const solved = items.filter(it => { const l = lastResult(it.id); return l && l.r === "R"; }).length;
  const flags = Object.keys(S.flags).length;

  view().innerHTML = `
    <div class="card">
      <h2>Drill a unit</h2>
      ${units.length ? `
      <label for="unitSel">Unit</label>
      <select id="unitSel">${units.map(u => `<option value="${u}" ${u === drillUnit ? "selected" : ""}>${esc(unitName(u))}: ${esc(UNIT(u).name)} (${unitItems(u).length})</option>`).join("")}</select>
      <p class="note">${items.length} items · ${seen} seen · ${solved} right on the last try · nodes ${UNIT(drillUnit).nodes.join(", ")}</p>
      <div class="row">
        <button class="primary" data-m="new">New and missed (15)</button>
        <button data-m="all">Whole unit</button>
        <button data-m="E">Find the errors</button>
        <button data-m="timed">Timed (Z)</button>
      </div>` : `<p>No exercise sets are installed.</p>`}
      <p class="note">Units with sets: ${units.map(unitName).join(", ") || "none"}. Answers are checked ignoring ß/ss, ä/ae and spacing. For transformations, an answer that isn't on the list is marked <i>unsure</i>, not wrong.</p>
    </div>

    <div class="card">
      <h2>Across units</h2>
      <p>Units so far on your track: ${unitsSoFar().filter(hasSet).map(unitName).join(", ") || "none with a set yet"}.</p>
      <div class="row">
        <button data-m="sprint" ${threadItems("G").length ? "" : "disabled"}>Endings sprint (20)</button>
        <button data-m="mixed">Mixed review (20)</button>
        <button data-m="check">Weekly checkpoint (20)</button>
      </div>
      <p class="note">Mixed review favours items you missed or haven't seen in a while. A node counts as mastered at 85% or more in mixed review and checkpoints two weeks running, with no errors in your last three writing tasks.</p>
    </div>

    <div class="card">
      <h2>Unsure answers (${S.unsure.length})</h2>
      ${S.unsure.length ? `
        <p>Copy them for Claude in one message, then paste Claude's answer back here. Answers Claude accepts are added to the item, so the app knows them next time.</p>
        <div class="row"><button id="copyUnsure" class="primary">Copy unsure answers for Claude</button></div>
        <label for="verdicts">Claude's answer</label>
        <textarea id="verdicts" placeholder="Paste Claude's whole reply here"></textarea>
        <div class="row"><button id="readVerdicts">Read verdicts</button></div>
        <details><summary>Show the list</summary><ul class="list">${S.unsure.map(u => { const it = ITEMS[u.id]; return `<li><b>${esc(u.a)}</b> <span class="muted">(${esc(u.id)}: ${esc(it ? it.prompt : "item removed")})</span></li>`; }).join("")}</ul></details>`
      : `<p class="muted">Nothing waiting. When the app can't match a transformation, it collects it here.</p>`}
    </div>
    ${flags ? `<p class="note">${flags} item${flags === 1 ? "" : "s"} reported. Export them for Claude Code in <a href="#setup">Setup</a>.</p>` : ""}`;

  const sel = $("#unitSel");
  if (sel) sel.onchange = () => { drillUnit = sel.value; renderDrills(); };
  $$("button[data-m]").forEach(b => { b.onclick = () => startSession(b.dataset.m, drillUnit || S.settings.unit); });
  if ($("#copyUnsure")) {
    $("#copyUnsure").onclick = () => copyAndTell(unsurePrompt(), "the unsure answers");
    $("#readVerdicts").onclick = () => readVerdicts($("#verdicts").value);
  }
}

// ---------- Drills: session ----------

let session = null, itemTimer = null;

const threadItems = t => (GT.sets["thread" + t] || { items: [] }).items;
// Right and total per error category (G1 gender, G2 case, G3 ending pattern) for a list of attempts.
function sprintCats(atts) {
  const m = {};
  atts.forEach(a => { const it = ITEMS[a.id]; if (!it || !it.cat) return; m[it.cat] = m[it.cat] || [0, 0]; m[it.cat][1]++; if (a.r === "R") m[it.cat][0]++; });
  return m;
}

function startSession(mode, u) {
  let items = [];
  const so = unitsSoFar().filter(hasSet);
  if (mode === "new") {
    items = unitItems(u).filter(it => { const l = lastResult(it.id); return !l || l.r !== "R"; }).slice(0, 15);
    if (!items.length) { toast("You've answered every item in this unit correctly at least once. Try the whole unit or a timed drill."); return; }
  } else if (mode === "all") items = shuffle(unitItems(u));
  else if (mode === "E") items = shuffle(unitItems(u).filter(it => it.type === "E"));
  else if (mode === "timed") items = shuffle(unitItems(u)).slice(0, 20);
  else if (mode === "mixed" || mode === "warm") {
    const earlier = so.filter(x => x !== S.settings.unit);
    const pool = (earlier.length ? earlier : so).flatMap(unitItems);
    items = weightedSample(pool, it => {
      const l = lastResult(it.id);
      if (!l) return 3;
      return 1 + (l.r !== "R" ? 4 : 0) + Math.min((Date.now() - l.t) / 864e5, 14) / 7;
    }, mode === "warm" ? 12 : 20);
  } else if (mode === "sprint") {
    // 20 thread items; unseen, missed and stale ones are favoured, and so is the weakest category
    const acc = sprintCats(S.attempts.filter(a => a.m === "sprint").slice(-60));
    const written = {};   // endings errors in the last five corrected tasks, by category
    S.production.slice(-5).forEach(p => p.errors.forEach(e => { if (CAT_NAMES[e.cat]) written[e.cat] = (written[e.cat] || 0) + 1; }));
    items = weightedSample(threadItems("G"), it => {
      const l = lastResult(it.id), c = acc[it.cat];
      const base = !l ? 3 : 1 + (l.r !== "R" ? 4 : 0) + Math.min((Date.now() - l.t) / 864e5, 14) / 7;
      return base * (c && c[1] >= 5 ? 2 - c[0] / c[1] : 1.5) * (1 + Math.min(written[it.cat] || 0, 5) / 5);
    }, 20);
  } else if (mode === "check") {
    // spread 20 items evenly over the units so far
    const per = so.map(x => shuffle(unitItems(x)));
    while (items.length < 20 && per.some(p => p.length)) per.forEach(p => { if (p.length && items.length < 20) items.push(p.pop()); });
    items = shuffle(items);
  }
  if (!items.length) { toast("No items for this choice yet."); return; }
  session = { mode, unit: u, items, i: 0, results: [], timed: mode === "timed" || mode === "sprint", done: false };
  prepItem();
  go("session");
}

function prepItem() {
  const it = session.items[session.i];
  session.checked = null; session.choice = null;
  session.order = it.type === "M" ? (it.thread ? it.options.slice() : shuffle(it.options)) : null;   // der/die/das keep their order
  session.shown = Date.now();
  session.pool = it.type === "O" ? shuffle(it.words.map((w, k) => k)) : null;
  session.placed = [];
}

const MODE_NAMES = { new: "New and missed", all: "Whole unit", E: "Find the errors", timed: "Timed drill", mixed: "Mixed review", warm: "Warm-up", check: "Weekly checkpoint", sprint: "Endings sprint" };

function renderSession() {
  if (session.done) return renderSummary();
  const it = session.items[session.i], n = session.items.length, c = session.checked;
  const meta = `${unitName(it.unit)} · ${it.node} · ${TYPE_NAMES[it.type]} · ${it.level}`;
  let body = "";
  if (it.instruction) body += `<p class="instruction">${esc(it.instruction)}</p>`;

  if (it.type === "L") {
    const parts = it.prompt.split("___");
    const size = Math.max(...it.answers.map(a => a.length)) + 3;
    body += parts.length > 1
      ? `<p class="prompt">${esc(parts[0])}<input type="text" id="ans" class="gap" size="${size}" autocomplete="off" autocapitalize="off" spellcheck="false" ${c ? "disabled" : ""}>${esc(parts.slice(1).join("___"))}</p>`
      : `<p class="prompt">${esc(it.prompt)}</p><input type="text" id="ans" class="wide" autocomplete="off" spellcheck="false">`;
  } else if (it.type === "M") {
    body += `<p class="prompt">${esc(it.prompt)}</p><div class="options">${session.order.map((o, k) =>
      `<button data-o="${k}" class="${session.choice === o ? "picked" : ""}" ${c ? "disabled" : ""}><span class="key">${k + 1}</span>${esc(o)}</button>`).join("")}</div>`;
  } else if (it.type === "O") {
    body += `<p class="instruction">${esc(it.prompt)}</p>
      <div class="tiles placed" id="placed">${it.start ? `<span class="start">${esc(it.start)}</span>` : ""}${session.placed.map((k, p) => `<button class="tile" data-p="${p}" ${c ? "disabled" : ""}>${esc(it.words[k])}</button>`).join("")}</div>
      <div class="tiles" id="pool">${session.pool.map((k, p) => `<button class="tile" data-q="${p}" ${c ? "disabled" : ""}>${esc(it.words[k])}</button>`).join("") || `<span class="note">All words placed.</span>`}</div>
      <p class="note">Click words to build the sentence; click a placed word to take it back. Punctuation doesn't matter here.</p>`;
  } else {
    const label = it.type === "E" ? "Correct the sentence (it contains one error):" : "Your answer:";
    body += `${it.type !== "E" ? `<p class="prompt">${esc(it.prompt)}</p>` : ""}<label for="ans">${label}</label>
      <input type="text" id="ans" class="wide" autocomplete="off" spellcheck="false" ${c ? "disabled" : ""}>`;
  }

  let fb = "";
  if (c) {
    const label = { R: "Richtig", W: "Leider falsch", U: "Not on the list: marked unsure" }[c.att.r];
    const others = acceptedAnswers(it).filter(a => a !== it.answers[0]);
    fb = `<div class="verdict v-${c.att.r}">${label}</div>
      ${c.note ? `<p class="note">${esc(c.note)}</p>` : ""}
      ${c.att.r !== "R" ? `<p>Your answer: <b>${esc(c.given || "—")}</b></p>` : ""}
      <p>Solution: <b>${esc(solutionText(it))}</b>${others.length ? `<br><span class="note">Also accepted: ${others.map(esc).join(" · ")}</span>` : ""}</p>
      <p class="explain">${esc(it.explain)}</p>
      <div class="row">
        <button id="nextBtn" class="primary">${session.i + 1 < n ? "Next" : "Finish"} <kbd>Enter</kbd></button>
        ${c.att.r === "W" && c.given ? `<button id="mineOk">Mine is correct too</button>` : ""}
        ${c.att.r === "U" ? `<button id="mineWrong">Mine is wrong</button>` : ""}
        <button id="flagBtn" class="small">${S.flags[it.id] ? "Reported ✓" : "Report this item"}</button>
      </div>
      ${c.att.r === "U" ? `<p class="note">Not sure? Leave it: it waits under Drills → Unsure answers for Claude's verdict.</p>` : ""}`;
  }

  view().innerHTML = `
    <div class="card">
      <div class="row spread"><span class="muted">${esc(MODE_NAMES[session.mode])} · ${esc(meta)}</span><span class="muted">${session.i + 1} / ${n}</span></div>
      <div class="progress"><div style="width:${(session.i / n) * 100}%"></div></div>
      ${session.timed && !c ? `<div class="progress timer"><div id="tbar" style="width:100%"></div></div>` : ""}
      ${body}
      ${!c ? `<div class="row"><button id="checkBtn" class="primary">Check <kbd>Enter</kbd></button><button id="dunnoBtn">Ich weiß es nicht</button>
        <span class="note" id="tleft"></span></div>` : fb}
    </div>
    <div class="row"><button id="quitBtn" class="small">End session</button></div>`;

  const ans = $("#ans");
  if (ans) {
    if (it.type === "E" && !c) ans.value = it.prompt;
    if (c) ans.value = c.given;
    if (!c) { ans.focus(); if (it.type === "E") ans.setSelectionRange(0, 0); }
  }
  if (!c) {
    $("#checkBtn").onclick = () => doCheck();
    $("#dunnoBtn").onclick = () => doCheck(true);
    $$(".options button").forEach(b => { b.onclick = () => { session.choice = session.order[b.dataset.o]; doCheck(); }; });
    $$("#pool .tile").forEach(b => { b.onclick = () => { session.placed.push(session.pool.splice(b.dataset.q, 1)[0]); renderSession(); }; });
    $$("#placed .tile").forEach(b => { b.onclick = () => { session.pool.push(session.placed.splice(b.dataset.p, 1)[0]); renderSession(); }; });
    if (session.timed && !itemTimer) startItemTimer((session.mode === "sprint" ? SPRINT_LIMIT : TIME_LIMIT)[it.type] || 30);
  } else {
    $("#nextBtn").onclick = nextItem;
    $("#nextBtn").focus();
    if ($("#mineOk")) $("#mineOk").onclick = () => { changeResult(c.att, "U"); renderSession(); toast("Moved to unsure answers for Claude to check."); };
    if ($("#mineWrong")) $("#mineWrong").onclick = () => { changeResult(c.att, "W"); renderSession(); };
    $("#flagBtn").onclick = () => {
      const note = prompt("What's wrong with this item? (wrong German, a correct answer missing, unclear instruction …)", S.flags[it.id] ? S.flags[it.id].note : "");
      if (note === null) return;
      S.flags[it.id] = { note, t: Date.now(), a: c.given }; save(); renderSession(); toast("Reported. Export reported items for Claude Code in Setup.");
    };
  }
  $("#quitBtn").onclick = () => { stopItemTimer(); if (session.results.length) { session.done = true; renderSession(); } else { session = null; go("drills"); } };
}

function startItemTimer(sec) {
  const end = Date.now() + sec * 1000;
  stopItemTimer();
  itemTimer = setInterval(() => {
    const left = end - Date.now();
    const bar = $("#tbar"), tl = $("#tleft");
    if (bar) bar.style.width = Math.max(0, left / (sec * 1000) * 100) + "%";
    if (tl) tl.textContent = mmss(left);
    if (left <= 0) { stopItemTimer(); doCheck(false, true); }
  }, 250);
}
function stopItemTimer() { clearInterval(itemTimer); itemTimer = null; }

function currentAnswer(it) {
  if (it.type === "M") return session.choice || "";
  if (it.type === "O") return [it.start || "", ...session.placed.map(k => it.words[k])].join(" ").trim();
  const a = $("#ans"); return a ? a.value : "";
}

function doCheck(dunno, timeout) {
  if (session.checked) return;
  stopItemTimer();
  const it = session.items[session.i];
  let given = dunno ? "" : currentAnswer(it);
  if (it.type === "O" && !session.placed.length) given = "";
  const j = dunno ? { r: "W", note: "No problem: look at the solution and the rule." } : judge(it, given);
  if (timeout && j.r !== "R") j.note = "Time's up. " + (j.note || "");
  const att = record(it, j.r, session.mode, given);
  session.checked = { att, given, note: j.note };
  session.results.push(att);
  renderSession();
  if (session.mode === "sprint") {
    att.d = Date.now() - session.shown; saveSoon();
    const at = session.i;   // a right answer moves on by itself, so the sprint keeps its pace
    if (j.r === "R") setTimeout(() => { if (session && session.mode === "sprint" && session.i === at && !session.done) nextItem(); }, 700);
  }
}

function nextItem() {
  session.i++;
  if (session.i >= session.items.length) session.done = true;
  else prepItem();
  renderSession();
}

function renderSummary() {
  const res = session.results, right = res.filter(a => a.r === "R").length;
  const byKey = (key) => {
    const m = {};
    res.forEach(a => { const k = a[key]; m[k] = m[k] || [0, 0]; m[k][1]++; if (a.r === "R") m[k][0]++; });
    return m;
  };
  const nodes = byKey("n"), units = byKey("u");
  const missed = res.filter(a => a.r !== "R");
  const sprint = session.mode === "sprint";
  const cats = sprint ? sprintCats(res) : null;
  const rightTimes = res.filter(a => a.r === "R" && a.d).map(a => a.d / 1000);
  const sec = rightTimes.length ? Math.round(rightTimes.reduce((x, y) => x + y, 0) / rightTimes.length * 10) / 10 : null;
  if (sprint && !session.saved) {
    S.sprints.push({ t: Date.now(), right, n: res.length, sec, cats });
    session.saved = true; save();
  }
  if (session.mode === "check" && !session.saved) {
    S.checkpoints.push({ t: Date.now(), right, n: res.length, units });
    session.saved = true; save();
  }
  view().innerHTML = `
    <div class="card">
      <h2>${esc(MODE_NAMES[session.mode])}: ${right} / ${res.length} (${pct(right, res.length)}%)</h2>
      ${sprint ? `<p>${sec === null ? "" : `Average time for a right answer: <b>${sec} s</b>. `}Target: ${SPRINT_GOAL.pct}% right at under ${SPRINT_GOAL.sec} seconds.
        ${pct(right, res.length) >= SPRINT_GOAL.pct && sec !== null && sec < SPRINT_GOAL.sec ? `<span class="tag t-good">target reached</span>` : ""}</p>
      <div class="scroll"><table><thead><tr><th>Kind of error</th><th>Score</th></tr></thead><tbody>
        ${Object.keys(CAT_NAMES).filter(k => cats[k]).map(k => `<tr><td>${esc(CAT_NAMES[k])}</td><td>${cats[k][0]}/${cats[k][1]}</td></tr>`).join("")}
      </tbody></table></div>` : ""}
      <div class="scroll ${sprint ? "hidden" : ""}"><table><thead><tr><th>${session.mode === "check" ? "Unit" : "Node"}</th><th>Score</th></tr></thead><tbody>
        ${Object.entries(session.mode === "check" ? units : nodes).map(([k, [r, n]]) => `<tr><td>${esc(session.mode === "check" ? unitName(k) + ": " + UNIT(k).name : k + " " + GT.NODES[k])}</td><td>${r}/${n} <span class="tag ${pct(r, n) >= 85 ? "t-good" : pct(r, n) >= 60 ? "t-mid" : "t-bad"}">${pct(r, n)}%</span></td></tr>`).join("")}
      </tbody></table></div>
      ${missed.length ? `<h3>Not right this time</h3><ul class="list">${missed.map(a => { const it = ITEMS[a.id]; return `<li>${a.r === "U" ? `<span class="tag t-mid">unsure</span> ` : ""}${esc(solutionText(it))}${a.a ? ` <span class="muted">(you: ${esc(a.a)})</span>` : ""}</li>`; }).join("")}</ul>
        <p class="note">Missed items are queued as Anki cards (${newCards()} new). Unsure ones wait for Claude's verdict.</p>` : `<p>Everything right.</p>`}
      <div class="row">
        ${missed.length ? `<button id="againBtn" class="primary">Practise the missed ones again</button>` : ""}
        <button id="ankiBtn" ${newCards() ? "" : "disabled"}>Download Anki cards</button>
        <button id="backBtn">Back to drills</button>
      </div>
    </div>`;
  if ($("#againBtn")) $("#againBtn").onclick = () => {
    const items = shuffle(missed.map(a => ITEMS[a.id]).filter(Boolean));
    session = { mode: "all", unit: session.unit, items, i: 0, results: [], timed: false, done: false };
    prepItem(); renderSession();
  };
  $("#ankiBtn").onclick = () => { exportCards(false); };
  $("#backBtn").onclick = () => { session = null; go("drills"); };
}

document.addEventListener("keydown", e => {
  if (route() !== "session" || !session || session.done) return;
  const it = session.items[session.i];
  if (e.key === "Enter" && !e.isComposing) {
    e.preventDefault();
    if (session.checked) nextItem();
    else if (!(it.type === "M" && !session.choice) && !(it.type === "O" && !session.placed.length)) doCheck();
    return;
  }
  if (it && it.type === "M" && !session.checked && /^[1-9]$/.test(e.key)) {
    const k = Number(e.key) - 1;
    if (k < session.order.length) { session.choice = session.order[k]; doCheck(); }
  }
  if (it && it.type === "O" && !session.checked && e.key === "Backspace" && session.placed.length && !(e.target instanceof HTMLInputElement)) {
    e.preventDefault(); session.pool.push(session.placed.pop()); renderSession();
  }
});

// ---------- Unsure bridge ----------

function unsurePrompt() {
  const lines = S.unsure.map((u, k) => {
    const it = ITEMS[u.id];
    if (!it) return "";
    return `${k + 1}. key: ${u.k}\n   Type: ${TYPE_NAMES[it.type]}${it.instruction ? "\n   Instruction: " + it.instruction : ""}\n   Prompt: ${it.prompt}\n   Accepted so far: ${acceptedAnswers(it).join(" | ")}\n   My answer: ${u.a}`;
  }).filter(Boolean);
  return `Please check these answers from my German grammar drills. For each, decide whether my answer is correct standard written German AND does what the instruction asks (same meaning, the target structure used). Be strict but fair: a different correct word order or synonym counts as correct.

Answer with a short explanation for each one I got wrong, then one JSON code block at the end in exactly this shape:
\`\`\`json
[{"key": "u03-023#1730000000000", "correct": true, "note": "short reason"}]
\`\`\`

${lines.join("\n\n")}

If you are not sure that something is correct German, say so in the note and set "correct" to false. Never invent a rule.`;
}

function extractJson(text) {
  const blocks = [...String(text).matchAll(/```(?:json)?\s*([\s\S]*?)```/gi)].map(m => m[1]).reverse();
  const first = Math.min(...["{", "["].map(ch => { const i = text.indexOf(ch); return i < 0 ? Infinity : i; }));
  const last = Math.max(text.lastIndexOf("}"), text.lastIndexOf("]"));
  if (first !== Infinity && last > first) blocks.push(text.slice(first, last + 1));
  for (const b of blocks) {
    for (const cand of [b, b.replace(/,\s*([}\]])/g, "$1")]) {
      try { return JSON.parse(cand); } catch (e) { /* try the next candidate */ }
    }
  }
  return null;
}

function readVerdicts(text) {
  const data = extractJson(text || "");
  const list = Array.isArray(data) ? data : data && Array.isArray(data.verdicts) ? data.verdicts : null;
  if (!list) { toast("Couldn't find the JSON block in that text. Paste Claude's whole reply."); return; }
  let ok = 0, wrong = 0;
  list.forEach(v => {
    const u = S.unsure.find(x => x.k === v.key);
    if (!u) return;
    const att = S.attempts.find(a => a.id === u.id && a.t === u.t);
    const it = ITEMS[u.id];
    if (v.correct === true) {
      S.extra[u.id] = S.extra[u.id] || [];
      if (it && !acceptedAnswers(it).some(a => norm(a) === norm(u.a))) S.extra[u.id].push(u.a.trim());
      if (att) { att.r = "R"; att.c = Date.now(); }
      ok++;
    } else {
      if (att) { att.r = "W"; att.c = Date.now(); }
      if (it) drillCard(it);
      wrong++;
    }
    S.unsure = S.unsure.filter(x => x.k !== u.k);
  });
  save(); renderDrills();
  toast(`${ok} accepted and added to the items, ${wrong} wrong (queued as Anki cards).`);
}

// ---------- Writing and speaking (M2) ----------

const writeState = { unit: null, task: null, pending: null, timer: null };
const KIND = { write: "Writing", speak: "Speaking", register: "Register" };

function unitTasks(u) {
  const { entry } = seqPos();
  const twoWeeks = entry && entry.u === u && entry.weeks > 1;
  return (GT.TASKS[u] || []).map(t => Object.assign({ current: !twoWeeks || t.week === (S.settings.unitWeek || 1) }, t));
}

function renderWrite() {
  const units = ORDER.filter(u => GT.TASKS[u]);
  if (!writeState.unit || !GT.TASKS[writeState.unit]) writeState.unit = GT.TASKS[S.settings.unit] ? S.settings.unit : units[0];
  const tasks = unitTasks(writeState.unit);
  const task = tasks.find(t => t.id === writeState.task);
  const history = S.production.slice().reverse();

  view().innerHTML = `
    <div class="card">
      <h2>Writing and speaking tasks</h2>
      <label for="wUnit">Unit</label>
      <select id="wUnit">${units.map(u => `<option value="${u}" ${u === writeState.unit ? "selected" : ""}>${esc(unitName(u))}: ${esc(UNIT(u).name)}</option>`).join("")}</select>
      <div class="grid2" style="margin-top:12px">${tasks.map(t => {
        const done = S.production.some(p => p.taskId === t.id);
        return `<button class="taskcard ${t.id === writeState.task ? "on" : ""}" data-t="${t.id}">
          <b>${esc(t.title)}</b><br><span class="note">${KIND[t.kind]}${t.words ? ` · ~${t.words} words` : ""} · ${t.minutes} min${t.week === 2 ? " · week 2" : ""}${t.current && writeState.unit === seqPos().entry.u ? " · this week" : ""}${done ? " · done ✓" : ""}</span></button>`;
      }).join("")}</div>
    </div>
    ${task ? taskEditor(task) : `<p class="muted">Choose a task. Writing is the main part of Session B.</p>`}
    ${history.length ? `<div class="card"><h2>Your corrected tasks</h2><div class="scroll"><table>
      <thead><tr><th>Date</th><th>Task</th><th>Overall</th><th>Errors</th></tr></thead><tbody>
      ${history.map(p => `<tr><td>${esc(p.date)}</td><td>${esc(unitName(p.unit))}: ${esc(p.title)}</td><td>${p.levels && p.levels.overall ? `<span class="tag t-acc">${esc(p.levels.overall)}</span>` : "—"}</td>
        <td><details><summary>${p.errors.length}</summary><ul class="list">${p.errors.map(e => `<li><s>${esc(e.original)}</s> → <b>${esc(e.correction)}</b> <span class="muted">${esc(e.node)} ${esc(e.rule)}</span></li>`).join("")}</ul>
        ${p.priorities && p.priorities.length ? `<p class="note">Priorities: ${p.priorities.map(esc).join(" · ")}</p>` : ""}</details></td></tr>`).join("")}
      </tbody></table></div></div>` : ""}`;

  $("#wUnit").onchange = e => { writeState.unit = e.target.value; writeState.task = null; writeState.pending = null; renderWrite(); };
  $$(".taskcard").forEach(b => { b.onclick = () => { writeState.task = b.dataset.t; writeState.pending = null; renderWrite(); }; });
  if (task) bindEditor(task);
}

function taskEditor(task) {
  const d = S.drafts[task.id] || { text: "" };
  const p = writeState.pending;
  return `<div class="card" id="editor">
    <div class="row spread"><h2 style="margin:0">${esc(task.title)}</h2><span class="tag t-acc">${KIND[task.kind]}</span></div>
    <p class="prompt" style="font-size:1rem">${esc(task.prompt)}</p>
    <p><b>Focus:</b> ${esc(task.focus)}</p>
    <div class="row noprint">
      <button id="timerBtn">${task.kind === "speak" ? `Start ${task.prep} min preparation` : `Start ${task.minutes}-minute timer`}</button>
      <span id="wTimer" class="big"></span>
      <span id="wCount" class="muted"></span>
    </div>
    <label for="essay">${task.kind === "speak" ? "Transcript of your recording" : "Your text"}</label>
    <textarea id="essay" class="essay" spellcheck="false" placeholder="${task.kind === "speak" ? "Type or paste the transcript of your recording" : "Schreiben Sie hier … (no spell-checker, no dictionary)"}">${esc(d.text)}</textarea>
    <p class="note">Your draft is saved as you type. Feedback comes in two rounds from your German tutor project in Claude.</p>
    <h3>Round 1: find your own errors</h3>
    <p>Claude marks where the errors are and what kind they are, without correcting them. Fix as many as you can in the box below.</p>
    <div class="row"><button id="copyM" class="primary">1. Copy for Claude: mark my errors</button><button id="startRev" class="small">Copy my text into the box below</button></div>
    <label for="rev">Your corrected version</label>
    <textarea id="rev" class="essay" style="min-height:160px" spellcheck="false" placeholder="Correct the places Claude marked. Leave this empty to skip round 1.">${esc(d.rev || "")}</textarea>
    <h3>Round 2: full correction</h3>
    <div class="row"><button id="copyK" class="primary">2. Copy for Claude: full correction</button></div>
    <label for="fb">Claude's reply to round 2</label>
    <textarea id="fb" placeholder="Paste Claude's whole reply here, including the JSON block at the end"></textarea>
    <div class="row"><button id="readFb">Read feedback</button></div>
    ${p ? feedbackPreview(p) : ""}
  </div>`;
}

function catTag(c) { return c ? `<span class="tag ${/^G/.test(c) ? "t-bad" : c === "W" ? "t-mid" : ""}" title="${esc(ERR_CATS[c] || "")}">${esc(c)}</span> <span class="note">${esc(ERR_CATS[c] || "")}</span>` : ""; }

function feedbackPreview(p) {
  const L = p.levels || {};
  return `<h3>Feedback found</h3>
    <p>${["task", "coherence", "vocabulary", "grammar"].map(k => `${k}: <span class="tag t-acc">${esc(L[k] || "?")}</span>`).join(" ")} · overall <span class="tag t-good">${esc(L.overall || "?")}</span></p>
    ${p.errors.length ? `<div class="scroll"><table><thead><tr><th></th><th>Original</th><th>Correction</th><th>Kind</th><th>Node</th><th>Rule</th></tr></thead><tbody>
      ${p.errors.map((e, k) => `<tr><td><input type="checkbox" data-e="${k}" checked aria-label="keep error ${k + 1}"></td><td>${esc(e.original)}</td><td>${esc(e.correction)}${e.fixed ? ` <span class="tag t-good">fixed by you</span>` : ""}</td><td>${catTag(e.cat)}</td><td>${esc(e.unit ? unitName(e.unit) + " " : "")}${esc(e.node)}</td><td>${esc(e.rule)}</td></tr>`).join("")}
    </tbody></table></div><p class="note">Untick any error you don't want as an Anki card. Errors you fixed yourself in round 1 get a low-priority card.</p>` : `<p>No errors listed.</p>`}
    ${p.priorities.length ? `<p><b>Priorities:</b></p><ul class="list">${p.priorities.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
    <div class="row"><button id="saveFb" class="primary">Save to error log and Anki cards</button></div>`;
}

function bindEditor(task) {
  const ta = $("#essay");
  const upd = () => { $("#wCount").textContent = `${wordCount(ta.value)} words${task.words ? " / ~" + task.words : ""}`; };
  upd();
  const rev = $("#rev");
  const keep = () => { const o = S.drafts[task.id] || {}; S.drafts[task.id] = { text: ta.value, rev: rev.value, t: Date.now(), started: o.started || Date.now() }; saveSoon(); };
  ta.oninput = () => { keep(); upd(); };
  rev.oninput = keep;
  $("#timerBtn").onclick = () => startWriteTimer(task);
  if (writeState.timer) tickWrite();
  $("#copyM").onclick = () => {
    if (!ta.value.trim()) { toast("Write your text first."); return; }
    if (!rev.value.trim()) { rev.value = ta.value; keep(); }
    copyAndTell(markPrompt(task, ta.value), "the round 1 prompt");
  };
  $("#startRev").onclick = () => {
    if (rev.value.trim() && rev.value !== ta.value && !confirm("Replace your corrected version with the original text?")) return;
    rev.value = ta.value; keep();
  };
  $("#copyK").onclick = () => {
    if (!ta.value.trim()) { toast("Write your text first."); return; }
    copyAndTell(korrekturPrompt(task, ta.value, rev.value), "the round 2 prompt");
  };
  $("#readFb").onclick = () => {
    const data = extractJson($("#fb").value || "");
    if (!data || typeof data !== "object" || Array.isArray(data)) { toast("Couldn't find the JSON block. Paste Claude's whole reply, or ask Claude for the JSON block again."); return; }
    writeState.pending = normaliseFeedback(data);
    const fbText = $("#fb").value;
    renderWrite();
    $("#fb").value = fbText;
    const save = $("#saveFb"); if (save) save.scrollIntoView({ block: "center" });
  };
  if ($("#saveFb")) $("#saveFb").onclick = () => saveFeedback(task);
}

function normaliseFeedback(d) {
  const lv = d.levels || {};
  const errors = (Array.isArray(d.errors) ? d.errors : []).map(e => ({
    original: String(e.original || ""), correction: String(e.correction || ""),
    unit: e.unit === undefined || e.unit === null ? "" : String(e.unit).replace(/^0+(?=\d)/, ""),
    node: /^(N\d{2}|F\d)$/i.test(String(e.node || "").trim()) ? String(e.node).trim().toUpperCase() : "",
    cat: ERR_CATS[String(e.cat || "").trim().toUpperCase()] ? String(e.cat).trim().toUpperCase() : "",
    fixed: e.fixed === true,
    rule: String(e.rule || ""), front: String(e.front || e.original || ""), back: String(e.back || e.correction || "")
  })).filter(e => e.original || e.correction);
  return {
    levels: { task: lv.task || lv.taskFulfilment || "", coherence: lv.coherence || "", vocabulary: lv.vocabulary || "", grammar: lv.grammar || "", overall: lv.overall || "" },
    errors, priorities: (Array.isArray(d.priorities) ? d.priorities : []).map(String)
  };
}

function saveFeedback(task) {
  const p = writeState.pending, text = $("#essay").value;
  const keep = $$("input[data-e]").filter(c => c.checked).map(c => Number(c.dataset.e));
  const errors = p.errors.filter((e, k) => keep.includes(k));
  const id = "p" + Date.now(), date = localDate();
  const draft = S.drafts[task.id] || {};
  const revised = $("#rev").value.trim();
  S.production.push({ id, taskId: task.id, unit: writeState.unit, title: task.title, kind: task.kind, date, text, rev: revised && revised !== text.trim() ? revised : "", words: wordCount(text),
    minutes: draft.started ? Math.round((Date.now() - draft.started) / 60000) : null, levels: p.levels, errors, priorities: p.priorities });
  errors.forEach((e, k) => {
    S.errorLog.push({ date, unit: e.unit || writeState.unit, node: e.node, cat: e.cat, fixed: e.fixed, error: e.original, correction: e.correction, rule: e.rule, task: task.title, src: "production" });
    const back = e.back + (e.rule ? `\n${e.rule}` : "");
    addCard(`p:${id}:${k}`, e.front, back, `unit::${unitTag(e.unit || writeState.unit)}${e.node ? " node::" + e.node : ""} type::error${e.cat ? " cat::" + e.cat : ""}${e.fixed ? " prio::low" : ""}`);
  });
  delete S.drafts[task.id]; forget("dr:" + task.id);
  writeState.pending = null; writeState.timer = null;
  save(); renderWrite();
  const own = errors.filter(e => e.fixed).length;
  toast(`Saved: ${errors.length} errors in the error log and as Anki cards${own ? `. You fixed ${own} of them yourself` : ""}.`);
}

function nodeListText() {
  return GT.UNITS.filter(u => u.nodes.length).map(u => `${u.id}: ${u.nodes.map(n => `${n} ${GT.NODES[n]}`).join("; ")}`).join("\n");
}

function catListText() { return Object.entries(ERR_CATS).map(([k, v]) => `${k} ${v}`).join(" · "); }
function taskText(task) {
  return `Task (${KIND[task.kind]}${task.words ? `, about ${task.words} words` : ""}, ${task.minutes} minutes): ${task.title}
${task.prompt}
Focus: ${task.focus}`;
}

// Round 1: Claude marks where the errors are and their category, without correcting them.
function markPrompt(task, text) {
  return `MARKIEREN

Round 1 of 2. Mark my errors, but do NOT correct them: I will try to fix them myself first.

${taskText(task)}

My ${task.kind === "speak" ? "transcript" : "text"}:
"""
${text.trim()}
"""

Return my text unchanged, with every error wrapped like this: [[wrong part]](1:G3). The number counts the errors; the code is the error category:
${catListText()}
Mark a missing word as [[ ]] at the place where it belongs.${task.kind === "speak" ? " This is a transcript of speech: don't mark features of normal spoken German." : ""}
Give no corrections, no hints beyond the category, no ratings and no explanations. After the text, add one line with the number of errors per category.`;
}

function korrekturPrompt(task, text, revised) {
  revised = (revised || "").trim();
  const twoRounds = revised && revised !== text.trim();
  const unit = UNIT(writeState.unit);
  const level = S.settings.track ? GT.TRACKS[S.settings.track].level : "B2";
  const d = S.drafts[task.id] || {};
  const mins = d.started ? Math.round((Date.now() - d.started) / 60000) : null;
  const tpl = `{
  "levels": {"task": "C1", "coherence": "B2", "vocabulary": "C1", "grammar": "B2", "overall": "B2"},
  "errors": [
    {"original": "the wrong phrase", "correction": "the corrected phrase", "cat": "P", "fixed": false, "unit": 3, "node": "N06",
     "rule": "rule in at most 12 words", "front": "my whole sentence with the wrong part in [[double brackets]]",
     "back": "the corrected whole sentence"}
  ],
  "priorities": ["first", "second", "third"]
}`;
  return `KORREKTUR

${twoRounds ? "Round 2 of 2. " : ""}My goal is a steady C1 by June 2027, then the Goethe-Zertifikat C2: GDS. My starting level: ${level}. My first language is Hungarian. Current unit: ${unit.id} (${unit.name}), grammar nodes: ${unit.nodes.join(", ") || "none"}.

${taskText(task)}

My ${task.kind === "speak" ? "transcript" : "text"} (${wordCount(text)} words${mins ? `, written in about ${mins} minutes` : ""}):
"""
${text.trim()}
"""
${twoRounds ? `
My corrected version after round 1 (I fixed what I could by myself):
"""
${revised}
"""

Rate and correct the ORIGINAL text. For each of its errors, set "fixed" to true if my corrected version repairs it correctly, otherwise false. If my corrected version introduces a new error, list it too, with "fixed": false.
` : ""}
1. Rate task fulfilment, coherence and cohesion, vocabulary, and grammar, each with a CEFR level (B1–C2) and one sentence of evidence; then one overall level. Be strict: rate what is reliably shown, not what is attempted.${task.kind === "speak" ? " This is a transcript of speech: judge it as spoken German." : ""}
2. A table of every error: original | correction | category | unit | node | rule (short). Categories: ${catListText()}.
3. My 3 priorities for next week.
4. At the very end, one JSON code block for my tutor app, in exactly this shape (valid JSON, no comments, one entry per error from the table):
\`\`\`json
${tpl}
\`\`\`
"cat" is one category code from the list above. "fixed" is ${twoRounds ? "as described above" : "always false, because there was no round 1"}. Use the unit numbers and node IDs from the list below; use "" for the node if none fits.

If you are not sure that something is correct German, say so. Never invent a rule.

Units and nodes:
${nodeListText()}`;
}

function startWriteTimer(task) {
  const now = Date.now();
  if (task.kind === "speak") writeState.timer = { end: now + task.prep * 60000, phase: "prep", task };
  else writeState.timer = { end: now + task.minutes * 60000, phase: "write", task };
  const d = S.drafts[task.id] || { text: $("#essay").value };
  d.started = now; S.drafts[task.id] = d; save();
  tickWrite();
}
let writeTick = null;
function tickWrite() {
  clearInterval(writeTick);
  const step = () => {
    const t = writeState.timer, el = $("#wTimer");
    if (!t || !el) { clearInterval(writeTick); return; }
    const left = t.end - Date.now();
    if (left <= 0) {
      if (t.phase === "prep") { writeState.timer = { end: Date.now() + t.task.minutes * 60000, phase: "speak", task: t.task }; toast("Preparation over: start speaking and recording now."); return; }
      el.textContent = t.phase === "speak" ? "Time's up. Stop the recording." : "Time's up. Finish your sentence.";
      writeState.timer = null; clearInterval(writeTick); return;
    }
    el.textContent = `${t.phase === "prep" ? "Preparation " : t.phase === "speak" ? "Speaking " : ""}${mmss(left)}`;
  };
  step(); writeTick = setInterval(step, 1000);
}

// ---------- Progress and error log (M3) ----------

function nodeStats(node) {
  const atts = S.attempts.filter(a => a.n === node && a.m !== "sprint");
  const recent = atts.slice(-20);
  const weeks = {};
  atts.filter(a => REVIEW_MODES.includes(a.m) && a.r !== "U").forEach(a => {
    const w = weekIdx(a.t); weeks[w] = weeks[w] || [0, 0]; weeks[w][1]++; if (a.r === "R") weeks[w][0]++;
  });
  const qual = Object.keys(weeks).map(Number).filter(w => weeks[w][1] >= 5).sort((a, b) => b - a);
  const w1 = qual[0], w0 = qual[1];
  const reviewMet = w1 !== undefined && w0 !== undefined && w1 - w0 === 1 && pct(...weeks[w1]) >= 85 && pct(...weeks[w0]) >= 85;
  const last3 = S.production.slice(-3);
  const prodErrors = last3.reduce((s, p) => s + p.errors.filter(e => e.node === node).length, 0);
  const allErrors = S.errorLog.filter(e => e.node === node).length;
  let status = "not started";
  if (atts.length || allErrors) status = "learning";
  if (reviewMet) status = prodErrors ? "review secure, writing errors" : "mastered";
  return {
    count: atts.length, drill: pct(recent.filter(a => a.r === "R").length, recent.filter(a => a.r !== "U").length),
    weekScores: qual.slice(0, 2).map(w => pct(...weeks[w])), prodErrors, allErrors, status
  };
}

let logFilter = "";
function renderProgress() {
  const relevant = new Set(unitsSoFar().flatMap(u => UNIT(u).nodes));
  S.attempts.forEach(a => relevant.add(a.n));
  S.errorLog.forEach(e => e.node && relevant.add(e.node));
  const nodes = Object.keys(GT.NODES).filter(n => relevant.has(n));
  const stats = nodes.map(n => ({ n, ...nodeStats(n) }));
  const statusTag = s => `<span class="tag ${s === "mastered" ? "t-good" : s === "not started" ? "" : s === "learning" ? "t-mid" : "t-acc"}">${s}</span>`;
  const score = s => s.weekScores[0] ?? s.drill ?? 100;
  const focus = stats.filter(s => s.status !== "mastered" && (s.prodErrors || score(s) < 85))
    .sort((a, b) => (b.prodErrors - a.prodErrors) || (score(a) - score(b))).slice(0, 3);
  const unitOf = n => GT.UNITS.find(u => u.nodes.includes(n));
  const log = S.errorLog.filter(e => !logFilter || e.unit === logFilter).slice().reverse();
  const totalR = S.attempts.filter(a => a.r === "R").length;

  const sprints = S.sprints.slice(-5).reverse();
  const kindMap = {}, last3ids = new Set(S.production.slice(-3).map(p => p.id));
  S.production.forEach(p => p.errors.forEach(e => {
    if (!e.cat) return;
    const k = kindMap[e.cat] = kindMap[e.cat] || { all: 0, last3: 0, fixed: 0 };
    k.all++; if (last3ids.has(p.id)) k.last3++; if (e.fixed) k.fixed++;
  }));
  const kinds = Object.entries(kindMap).sort((a, b) => b[1].last3 - a[1].last3 || b[1].all - a[1].all);
  const catAll = sprintCats(S.attempts.filter(a => a.m === "sprint").slice(-100));
  view().innerHTML = `
    <div class="card">
      <h2>Endings sprint</h2>
      ${sprints.length ? `
        <p>Target: ${SPRINT_GOAL.pct}% right at under ${SPRINT_GOAL.sec} seconds an item. Your last 100 answers by kind of error:
          ${Object.keys(CAT_NAMES).filter(k => catAll[k]).map(k => `${esc(CAT_NAMES[k])} <b>${pct(...catAll[k])}%</b>`).join(" · ")}</p>
        <div class="scroll"><table><thead><tr><th>Date</th><th>Score</th><th>Seconds per right answer</th></tr></thead><tbody>
          ${sprints.map(s => `<tr><td>${esc(localDate(new Date(s.t)))}</td><td>${s.right}/${s.n} <span class="tag ${pct(s.right, s.n) >= SPRINT_GOAL.pct ? "t-good" : pct(s.right, s.n) >= 70 ? "t-mid" : "t-bad"}">${pct(s.right, s.n)}%</span></td><td>${s.sec ?? "—"}</td></tr>`).join("")}
        </tbody></table></div>`
      : `<p class="muted">No sprint yet. It is part of every session: 20 genders and short phrases against the clock.</p>`}
    </div>
    <div class="grid2">
      <div class="card"><h2>Drill answers</h2><p><span class="stat">${S.attempts.length}</span> · ${pct(totalR, S.attempts.length) ?? "—"}% right</p></div>
      <div class="card"><h2>Writing tasks</h2><p><span class="stat">${S.production.length}</span> corrected${S.production.length ? ` · last overall ${esc((S.production[S.production.length - 1].levels || {}).overall || "—")}` : ""}</p></div>
      <div class="card"><h2>Error log</h2><p><span class="stat">${S.errorLog.length}</span> entries</p></div>
    </div>

    ${kinds.length ? `<div class="card">
      <h2>Your errors by kind</h2>
      <p class="note">From your corrected writing and speaking tasks. "Fixed by you" counts the errors you repaired in round 1.</p>
      <div class="scroll"><table><thead><tr><th>Kind</th><th>All tasks</th><th>Last three tasks</th><th>Fixed by you</th></tr></thead><tbody>
        ${kinds.map(([c, n]) => `<tr><td>${catTag(c)}</td><td>${n.all}</td><td>${n.last3}</td><td>${n.fixed} <span class="note">(${pct(n.fixed, n.all)}%)</span></td></tr>`).join("")}
      </tbody></table></div>
    </div>` : ""}

    <div class="card">
      <h2>Review this week</h2>
      ${focus.length ? `<ul class="list">${focus.map(s => `<li><b>${s.n}</b> ${esc(GT.NODES[s.n])} <span class="muted">(${unitName(unitOf(s.n).id)}${s.prodErrors ? ` · ${s.prodErrors} error${s.prodErrors === 1 ? "" : "s"} in your last three tasks` : ""}${s.weekScores.length ? ` · review ${s.weekScores[0]}%` : s.drill !== null ? ` · drills ${s.drill}%` : ""})</span></li>`).join("")}</ul>
        <p class="note">Drill these units again; their items also come up more often in the warm-up.</p>` : `<p class="muted">Nothing to flag yet. Do some drills and a writing task first.</p>`}
    </div>

    <div class="card">
      <h2>Mastery by grammar node</h2>
      <div class="scroll"><table><thead><tr><th>Node</th><th>Drills (last 20)</th><th>Review, last 2 weeks</th><th>Errors in last 3 tasks</th><th>Status</th></tr></thead><tbody>
      ${stats.map(s => {
        const pr = placementRight(unitOf(s.n).id);
        return `<tr><td><b>${s.n}</b> ${esc(GT.NODES[s.n])}<br><span class="note">${unitName(unitOf(s.n).id)}${pr !== null ? ` · placement ${pr}/3` : ""}</span></td>
        <td>${s.drill === null ? "—" : s.drill + "%"} <span class="note">(${s.count})</span></td>
        <td>${s.weekScores.length ? s.weekScores.map(x => x + "%").join(" · ") : "—"}</td>
        <td>${s.prodErrors}</td><td>${statusTag(s.status)}</td></tr>`;
      }).join("")}
      </tbody></table></div>
      <p class="note">Mastered = at least 85% in mixed review and checkpoints in two weeks running (5+ answers each week), and no errors on that node in your last three writing tasks.</p>
    </div>

    ${S.checkpoints.length ? `<div class="card"><h2>Weekly checkpoints</h2><div class="scroll"><table><thead><tr><th>Date</th><th>Score</th><th>By unit</th></tr></thead><tbody>
      ${S.checkpoints.slice().reverse().map(c => `<tr><td>${localDate(new Date(c.t))}</td><td>${c.right}/${c.n} (${pct(c.right, c.n)}%)</td><td>${Object.entries(c.units).map(([u, [r, n]]) => `${unitName(u)} ${r}/${n}`).join(" · ")}</td></tr>`).join("")}
      </tbody></table></div></div>` : ""}

    <div class="card">
      <div class="row spread"><h2 style="margin:0">Error log</h2>
        <select id="logF"><option value="">All units</option>${[...new Set(S.errorLog.map(e => e.unit))].sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b)).map(u => `<option value="${esc(u)}" ${u === logFilter ? "selected" : ""}>${esc(unitName(u))}</option>`).join("")}</select></div>
      ${log.length ? `<div class="scroll"><table><thead><tr><th>Date</th><th>Unit</th><th>Error</th><th>Correction</th><th>Task</th></tr></thead><tbody>
        ${log.slice(0, 100).map(e => `<tr><td>${esc(e.date)}</td><td>${esc(e.unit)}${e.node ? ` <span class="note">${esc(e.node)}</span>` : ""}</td><td>${e.cat ? `<span class="tag" title="${esc(ERR_CATS[e.cat] || "")}">${esc(e.cat)}</span> ` : ""}${esc(e.error)}</td><td><b>${esc(e.correction)}</b>${e.rule ? `<br><span class="note">${esc(e.rule)}</span>` : ""}</td><td class="note">${esc(e.task)}</td></tr>`).join("")}
      </tbody></table></div>${log.length > 100 ? `<p class="note">Showing the latest 100 of ${log.length}.</p>` : ""}` : `<p class="muted">No entries yet.</p>`}
      <div class="row" style="margin-top:10px">
        <label class="btn" for="csvIn" style="margin:0;font-weight:400">Import error-log.csv</label><input type="file" id="csvIn" accept=".csv,.txt" class="hidden">
        <button id="csvOut" ${S.errorLog.length ? "" : "disabled"}>Export as CSV</button>
      </div>
      <p class="note">Import takes the file from your solo study period: columns date;unit;error;correction;task (a sixth column, node, is optional). Rows already in the log are skipped.</p>
    </div>`;

  $("#logF").onchange = e => { logFilter = e.target.value; renderProgress(); };
  $("#csvIn").onchange = e => importErrorCsv(e.target);
  $("#csvOut").onclick = () => download(`error-log-${localDate()}.csv`,
    "date;unit;error;correction;task;node;category\n" + S.errorLog.map(e => [e.date, e.unit, e.error, e.correction, e.task, e.node, e.cat || ""].map(csvField).join(";")).join("\n") + "\n", "text/csv");
}

function importErrorCsv(input) {
  readFile(input).then(text => {
    const rows = parseCsv(text.replace(/^﻿/, ""));
    if (rows.length && /date/i.test(rows[0][0])) rows.shift();
    const have = new Set(S.errorLog.map(e => [e.date, e.unit, e.error, e.correction].join("|")));
    let added = 0;
    rows.forEach(r => {
      if (r.length < 4) return;
      const e = { date: r[0].trim(), unit: r[1].trim().replace(/^0+(?=\d)/, ""), error: r[2].trim(), correction: r[3].trim(), task: (r[4] || "").trim(),
        node: /^(N\d{2}|F\d)$/i.test((r[5] || "").trim()) ? r[5].trim().toUpperCase() : "", rule: "", src: "import" };
      const k = [e.date, e.unit, e.error, e.correction].join("|");
      if (have.has(k)) return;
      have.add(k); S.errorLog.push(e); added++;
    });
    save(); renderProgress(); toast(`${added} error-log entries imported.`);
  }).catch(() => toast("Couldn't read that file."));
}

// ---------- Exam tools (M4) ----------

const examState = { timer: null };
function renderExam() {
  const latest = {};
  S.mocks.forEach(m => { if (!latest[m.module] || m.date >= latest[m.module].date) latest[m.module] = m; });
  const ready = s => s >= 70 ? ["t-good", "ready to register"] : s >= 65 ? ["t-good", "register (at the 65–70% mark)"] : s >= 60 ? ["t-mid", "pass mark, but risky"] : ["t-bad", "not yet"];

  view().innerHTML = `
    <div class="card">
      <h2>Module timer</h2>
      <p class="note">Timings of the Goethe-Zertifikat C2: GDS. Sprechen starts with 15 minutes of preparation.</p>
      <div class="row">${GT.EXAM.map(m => `<button data-x="${m.id}">${m.name} · ${m.prep ? m.prep + " + " : ""}${m.minutes} min</button>`).join("")}</div>
      <p class="clock" id="xClock">—</p>
      <p id="xLabel" class="muted"></p>
      <div class="row"><button id="xStop" class="small">Stop</button></div>
    </div>

    <div class="card">
      <h2>Readiness per module</h2>
      <div class="scroll"><table><thead><tr><th>Module</th><th>Latest mock</th><th>Status</th></tr></thead><tbody>
      ${GT.EXAM.map(m => { const l = latest[m.id]; const r = l ? ready(l.score) : null;
        return `<tr><td>${m.name}</td><td>${l ? `${l.score}% <span class="note">${esc(l.date)} · ${esc(l.source)}</span>` : "—"}</td><td>${r ? `<span class="tag ${r[0]}">${r[1]}</span>` : "—"}</td></tr>`; }).join("")}
      </tbody></table></div>
      <p class="note">You need about 60% per module to pass. Register only for modules where your mock score is 65–70% or more, and book the others for the next date.</p>
    </div>

    <div class="card">
      <h2>Log a mock score</h2>
      <div class="row">
        <div><label for="mDate">Date</label><input type="date" id="mDate" value="${localDate()}"></div>
        <div><label for="mMod">Module</label><select id="mMod">${GT.EXAM.map(m => `<option value="${m.id}">${m.name}</option>`).join("")}</select></div>
        <div><label for="mScore">Score %</label><input type="number" id="mScore" min="0" max="100" style="width:6em"></div>
      </div>
      <label for="mSrc">Material</label>
      <input type="text" id="mSrc" class="wide" list="mSrcList" placeholder="e.g. Goethe C2 Übungssatz">
      <datalist id="mSrcList"><option>Goethe C2 Übungssatz</option><option>Goethe C1 Modellsatz (modular)</option><option>Goethe C1 Übungssatz 03</option><option>Mit Erfolg zum Goethe-Zertifikat C2: Test 1</option><option>Mit Erfolg zum Goethe-Zertifikat C2: Test 2</option><option>Claude prompt (Schreiben/Sprechen)</option></datalist>
      <div class="row" style="margin-top:10px"><button id="mAdd" class="primary">Add</button></div>
      ${S.mocks.length ? `<h3>All mock scores</h3><div class="scroll"><table><thead><tr><th>Date</th><th>Module</th><th>Material</th><th>Score</th><th></th></tr></thead><tbody>
        ${S.mocks.map((m, k) => ({ m, k })).sort((a, b) => b.m.date.localeCompare(a.m.date)).map(({ m, k }) => `<tr><td>${esc(m.date)}</td><td>${esc((GT.EXAM.find(x => x.id === m.module) || {}).name)}</td><td>${esc(m.source)}</td><td>${m.score}%</td><td><button class="small" data-del="${k}">Delete</button></td></tr>`).join("")}
      </tbody></table></div>` : ""}
    </div>

    <div class="card">
      <h2>Exam date</h2>
      <div class="row"><input type="date" id="exDate" value="${esc(S.settings.examDate)}"><span class="muted">${S.settings.examDate ? Math.max(0, -daysAgo(S.settings.examDate)) + " days to go" : "Check the dates of your Goethe centre once you know your track."}</span></div>
    </div>`;

  $$("button[data-x]").forEach(b => { b.onclick = () => startExamTimer(GT.EXAM.find(m => m.id === b.dataset.x)); });
  $("#xStop").onclick = () => { examState.timer = null; tickExam(); };
  if (examState.timer) tickExam();
  $("#mAdd").onclick = () => {
    const score = Number($("#mScore").value);
    if ($("#mScore").value === "" || isNaN(score) || score < 0 || score > 100) { toast("Enter a score between 0 and 100."); return; }
    S.mocks.push({ date: $("#mDate").value || localDate(), module: $("#mMod").value, source: $("#mSrc").value.trim() || "—", score: Math.round(score), t: Date.now() });
    save(); renderExam();
  };
  $$("button[data-del]").forEach(b => { b.onclick = () => { if (confirm("Delete this score?")) { forget("m:" + JSON.stringify(S.mocks.splice(Number(b.dataset.del), 1)[0])); save(); renderExam(); } }; });
  $("#exDate").onchange = e => { S.settings.examDate = e.target.value; save(); renderExam(); };
}

function startExamTimer(m) {
  examState.timer = m.prep ? { m, phase: "prep", end: Date.now() + m.prep * 60000 } : { m, phase: "run", end: Date.now() + m.minutes * 60000 };
  tickExam();
}
let examTick = null;
function tickExam() {
  clearInterval(examTick);
  const step = () => {
    const t = examState.timer, c = $("#xClock"), l = $("#xLabel");
    if (!c) { clearInterval(examTick); return; }
    if (!t) { c.textContent = "—"; l.textContent = ""; clearInterval(examTick); return; }
    const left = t.end - Date.now();
    if (left <= 0) {
      if (t.phase === "prep") { examState.timer = { m: t.m, phase: "run", end: Date.now() + t.m.minutes * 60000 }; toast("Preparation over: the exam part starts now."); return; }
      c.textContent = "0:00"; l.textContent = `${t.m.name}: time is up.`; examState.timer = null; clearInterval(examTick); return;
    }
    c.textContent = mmss(left);
    l.textContent = `${t.m.name}${t.phase === "prep" ? " · preparation" : ""}`;
  };
  step(); examTick = setInterval(step, 1000);
}

// ---------- Setup and data ----------

function cautious(a, b) { const o = ["C", "B", "A"]; return b ? o[Math.min(o.indexOf(a), o.indexOf(b))] : a; }

function renderSetup() {
  const p = S.placement;
  const suggested = p ? cautious(p.grammarTrack, p.skillsTrack) : null;
  let localPlacement = false;
  try { localPlacement = !!localStorage.getItem(PLACEMENT_KEY); } catch (e) { /* storage blocked */ }
  const seq = sequence();
  const flags = Object.entries(S.flags), extras = Object.entries(S.extra).filter(([, v]) => v.length);

  view().innerHTML = `
    <div class="card">
      <h2>Placement test</h2>
      ${p ? `<p>Imported (${esc((p.exported || "").slice(0, 10))}). Grammar suggests <b>${esc(trackName(p.grammarTrack))}</b>${p.skillsTrack ? `, reading, listening and writing suggest <b>${esc(trackName(p.skillsTrack))}</b>` : ", and Parts 2–3 weren't filled in"}.</p>
        <p class="big">Suggested: ${esc(trackName(suggested))}</p>
        ${p.grammarTrack && p.skillsTrack && Math.abs(["C", "B", "A"].indexOf(p.grammarTrack) - ["C", "B", "A"].indexOf(p.skillsTrack)) === 2 ? `<p class="note">The two results are two tracks apart. Plan v2 suggests one tutor session to confirm your level before you commit.</p>` : ""}
        ${S.settings.track !== suggested ? `<button id="useSug" class="primary">Use ${esc(GT.TRACKS[suggested].name)}</button>` : `<p class="note">You're on the suggested track.</p>`}`
      : `<p>Optional. Open the <a href="placement-test.html">placement test</a>, do Part 1 (grammar, about 40 minutes) and use <b>Download results (JSON)</b> on its results page. Then import the file here. Skip Parts 2 and 3, so the C1 Modellsatz stays unused for June.</p>
         ${localPlacement ? `<p class="note">This browser has placement-test answers saved, so you've started it here. Download the results JSON from its results page.</p>` : ""}`}
      <div class="row" style="margin-top:8px"><label class="btn" for="plIn" style="margin:0;font-weight:400">Import placement results (JSON)</label><input type="file" id="plIn" accept=".json" class="hidden"></div>
    </div>

    <div class="card">
      <h2>Your track and unit</h2>
      <div class="row">
        <div><label for="trk">Track</label><select id="trk"><option value="">— choose —</option>${Object.entries(GT.TRACKS).map(([k, t]) => `<option value="${k}" ${S.settings.track === k ? "selected" : ""}>${esc(t.name)} (${t.length})</option>`).join("")}</select></div>
        <div><label for="cur">Current unit</label><select id="cur">${seq.map(s => `<option value="${s.u}" ${s.u === seqPos().entry.u ? "selected" : ""}>${esc(unitName(s.u))}: ${esc(UNIT(s.u).name)}${s.weeks > 1 ? " (2 weeks)" : ""}</option>`).join("")}</select></div>
        <div><label for="wk">Week of unit</label><select id="wk">${[1, 2].map(w => `<option ${S.settings.unitWeek === w ? "selected" : ""}>${w}</option>`).join("")}</select></div>
      </div>
      <p class="note">${S.settings.track ? `${esc(GT.TRACKS[S.settings.track].name)}: ${seq.length} units, ${seq.reduce((s, x) => s + x.weeks, 0)} study weeks, target exam ${esc(GT.TRACKS[S.settings.track].exam)}.` : ""}
        ${S.settings.track === "A" ? " Units 1–8 where you scored 3/3 in the placement test are skipped; their items still come up in mixed review." : ""}</p>
    </div>

    <div class="card">
      <h2>Anki</h2>
      <p>${newCards()} new of ${S.cards.length} cards. The file has headers that tell Anki the deck (<i>German C2</i>), note type (Basic) and tags column: in Anki choose <b>File → Import</b>, pick the file, check the preview and import.</p>
      <div class="row"><button id="ankiNew" class="primary" ${newCards() ? "" : "disabled"}>Download new cards</button><button id="ankiAll" ${S.cards.length ? "" : "disabled"}>Download all cards again</button></div>
    </div>

    <div class="card">
      <h2>Feedback for the exercise bank</h2>
      <p>${flags.length} reported item${flags.length === 1 ? "" : "s"} · ${extras.length} item${extras.length === 1 ? "" : "s"} with answers Claude accepted. Give this file to Claude Code when it writes the next sets, so it can fix the items and add the answers to the data files.</p>
      ${flags.length ? `<ul class="list">${flags.map(([id, f]) => `<li><b>${esc(id)}</b>: ${esc(f.note)}</li>`).join("")}</ul>` : ""}
      <div class="row"><button id="bankOut" ${flags.length || extras.length ? "" : "disabled"}>Download bank-feedback.json</button><button id="flagClear" ${flags.length ? "" : "disabled"}>Clear reports (after fixing)</button></div>
    </div>

    <div class="card">
      <h2>Sync between devices</h2>
      ${syncCfg ? `
        <p>Connected to the private repository <b>${esc(syncCfg.owner)}/${esc(syncCfg.repo)}</b>. ${esc(syncText())}</p>
        <div class="row"><button id="syncNow" class="primary">Sync now</button><button id="syncOff">Disconnect this device</button></div>
        <p class="note">The app syncs when you open it, about 20 seconds after each change, and when you come back to the tab. The access key is stored in this browser only and is not part of backups.</p>`
      : `
        <p>Keeps your progress the same at home, at the office and on your phone, through a private repository in your own GitHub account. It's free.</p>
        <ol class="list">
          <li>On github.com, create a new <b>private</b> repository, for example <i>german-tutor-data</i>, and tick "Add a README file".</li>
          <li>Open Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token. Under "Repository access" choose "Only select repositories" and pick that repository. Under "Repository permissions" set <b>Contents</b> to "Read and write".</li>
          <li>Enter the three values below. Do this once on each of your own devices; on a shared computer, use the backup file instead.</li>
        </ol>
        <div class="row">
          <div><label for="ghUser">GitHub user name</label><input type="text" id="ghUser" autocomplete="off"></div>
          <div><label for="ghRepo">Repository</label><input type="text" id="ghRepo" value="german-tutor-data" autocomplete="off"></div>
          <div><label for="ghKey">Access key</label><input type="password" id="ghKey" autocomplete="off" style="font:inherit;padding:8px 10px;border-radius:8px;border:1px solid var(--line);background:var(--card);color:var(--text)"></div>
        </div>
        <div class="row" style="margin-top:10px"><button id="syncOn" class="primary">Connect</button></div>`}
    </div>

    <div class="card">
      <h2>Backup</h2>
      <p>${syncCfg ? "Sync is on, so a backup file is only an extra safety copy." : "Everything lives in this browser only. Download a backup every week and keep it in your cloud drive."} ${S.lastBackup ? `Last backup: ${esc(S.lastBackup.slice(0, 10))}.` : "No backup yet."}</p>
      <div class="row">
        <button id="bkOut" class="primary">Download backup</button>
        <label class="btn" for="bkIn" style="margin:0;font-weight:400">Restore from backup</label><input type="file" id="bkIn" accept=".json" class="hidden">
        <button id="wipe" class="small">Delete all data</button>
      </div>
      <p class="note">Exercise sets installed: ${ORDER.filter(hasSet).map(u => `${unitName(u)} (${unitItems(u).length})`).join(", ") || "none"}.</p>
    </div>`;

  if ($("#useSug")) $("#useSug").onclick = () => { setTrack(suggested); };
  $("#plIn").onchange = e => importPlacement(e.target);
  $("#trk").onchange = e => setTrack(e.target.value);
  $("#cur").onchange = e => { S.settings.unit = e.target.value; S.settings.unitWeek = 1; save(); renderSetup(); };
  $("#wk").onchange = e => { S.settings.unitWeek = Math.min(Number(e.target.value), seqPos().entry.weeks); save(); renderSetup(); };
  $("#ankiNew").onclick = () => exportCards(false);
  $("#ankiAll").onclick = () => exportCards(true);
  $("#bankOut").onclick = () => download(`bank-feedback-${localDate()}.json`, JSON.stringify({
    exported: new Date().toISOString(),
    reported: flags.map(([id, f]) => ({ id, note: f.note, myAnswer: f.a || "", item: ITEMS[id] || null })),
    acceptedAnswers: extras.map(([id, v]) => ({ id, add: v }))
  }, null, 2), "application/json");
  $("#flagClear").onclick = () => { if (confirm("Clear all reports?")) { S.flags = {}; S.flagsCleared = Date.now(); save(); renderSetup(); } };
  if ($("#syncNow")) {
    $("#syncNow").onclick = () => syncNow(true);
    $("#syncOff").onclick = () => { if (confirm("Stop syncing on this device? Your data stays in this browser and in the repository.")) { syncCfg = null; storeSyncCfg(); paintSync(); renderSetup(); } };
  } else {
    $("#syncOn").onclick = () => {
      const owner = $("#ghUser").value.trim(), repo = $("#ghRepo").value.trim(), token = $("#ghKey").value.trim();
      if (!owner || !repo || !token) { toast("Fill in all three fields."); return; }
      syncCfg = { owner, repo, token }; storeSyncCfg();
      syncNow(true).then(() => {
        if (syncState.error) { toast("Could not connect: " + syncState.error); syncCfg = null; storeSyncCfg(); paintSync(); }
        else toast("Connected. Your progress is now synced.");
        if (route() === "setup") renderSetup();
      });
    };
  }
  $("#bkOut").onclick = backup;
  $("#bkIn").onchange = e => restore(e.target);
  $("#wipe").onclick = () => {
    if (!confirm("Delete ALL your tutor data in this browser? Download a backup first if you might need it.")) return;
    if (!confirm("Really delete everything? This can't be undone.")) return;
    syncCfg = null; storeSyncCfg(); paintSync();   // otherwise the next sync would bring the data back
    S = fresh(); save(); render(); toast("All data in this browser deleted. Sync is disconnected on this device.");
  };
}

function setTrack(t) {
  S.settings.track = t;
  if (t) {
    const seq = sequence(t);
    if (!seq.some(s => s.u === S.settings.unit)) { S.settings.unit = seq[0].u; S.settings.unitWeek = 1; }
  }
  save(); render();
}

function importPlacement(input) {
  readFile(input).then(text => {
    const d = JSON.parse(text);
    if (d.test !== "placement" || !Array.isArray(d.units)) throw new Error("not a placement file");
    S.placement = { exported: d.exported, grammarTrack: d.grammarTrack, skillsTrack: d.skillsTrack, bands: d.bands, units: d.units.map(u => ({ unit: String(u.unit), right: u.right, asked: u.asked })), lesen: d.lesen, hoeren: d.hoeren, writing: d.writing };
    if (!S.settings.track) setTrack(cautious(d.grammarTrack, d.skillsTrack));
    save(); renderSetup(); toast("Placement results imported.");
  }).catch(() => toast("That doesn't look like the placement-results JSON file."));
}

function backup() {
  S.lastBackup = new Date().toISOString(); save();
  download(`german-tutor-backup-${localDate()}.json`, JSON.stringify(S), "application/json");
  if (route() === "today" || route() === "setup") render();
}

function restore(input) {
  readFile(input).then(text => {
    const d = JSON.parse(text);
    if (d.v !== 1 || !Array.isArray(d.attempts)) throw new Error("not a backup");
    if (!confirm(`Replace the data in this browser with the backup from ${(d.lastBackup || d.created || "").slice(0, 10)}?`)) return;
    S = adopt(d); save(); render(); toast("Backup restored.");
  }).catch(() => toast("That file isn't a tutor backup."));
}

// ---------- Sync through a private GitHub repository ----------
// One file, progress.json, in a repository the user owns. Every sync pulls the file, merges it
// with this browser's data record by record, and pushes the result if it differs.

const SYNC_FILE = "progress.json";
let syncCfg = null, syncTimer = null;
const syncState = { busy: false, dirty: false, last: null, error: "" };
try { syncCfg = JSON.parse(localStorage.getItem(SYNC_KEY)); } catch (e) { /* storage blocked */ }
function storeSyncCfg() {
  try { if (syncCfg) localStorage.setItem(SYNC_KEY, JSON.stringify(syncCfg)); else localStorage.removeItem(SYNC_KEY); } catch (e) { /* storage blocked */ }
}

function b64encode(str) {
  const bytes = new TextEncoder().encode(str); let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}
function b64decode(b64) {
  const bin = atob(b64.replace(/\s/g, "")), bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function mergeStates(a, b) {
  const m = fresh();
  const union = (la, lb, key, pick) => {
    const map = new Map();
    (la || []).concat(lb || []).forEach(x => { const k = key(x), o = map.get(k); map.set(k, o && pick ? pick(o, x) : o || x); });
    return [...map.values()];
  };
  const by = f => (x, y) => { const p = f(x), q = f(y); return p < q ? -1 : p > q ? 1 : 0; };
  const sorted = o => Object.fromEntries(Object.keys(o).sort().map(k => [k, o[k]]));
  const each = (oa, ob, fn) => [oa, ob].forEach(o => Object.entries(o || {}).forEach(([k, v]) => fn(k, v)));

  const gone = {};
  each(a.gone, b.gone, (k, t) => { gone[k] = Math.max(gone[k] || 0, t); });
  m.gone = sorted(gone);
  m.created = [a.created, b.created].filter(Boolean).sort()[0] || m.created;
  const ta = a.settingsT || 0, tb = b.settingsT || 0;
  m.settings = Object.assign(m.settings, tb > ta ? b.settings : a.settings);
  m.settingsT = Math.max(ta, tb);
  m.placement = !a.placement ? b.placement || null : !b.placement ? a.placement
    : String(b.placement.exported || "") > String(a.placement.exported || "") ? b.placement : a.placement;

  m.attempts = union(a.attempts, b.attempts, x => x.id + "#" + x.t, (o, x) => ((x.c || 0) > (o.c || 0) ? x : o))
    .sort((x, y) => x.t - y.t || (x.id < y.id ? -1 : x.id > y.id ? 1 : 0));
  const result = new Map(m.attempts.map(x => [x.id + "#" + x.t, x.r]));
  m.unsure = union(a.unsure, b.unsure, x => x.k).filter(x => result.get(x.k) === "U").sort(by(x => x.k));

  const extra = {};
  each(a.extra, b.extra, (id, list) => { extra[id] = [...new Set((extra[id] || []).concat(list))].sort(); });
  m.extra = sorted(extra);
  m.flagsCleared = Math.max(a.flagsCleared || 0, b.flagsCleared || 0);
  const flags = {};
  each(a.flags, b.flags, (id, f) => { if ((f.t || 0) > m.flagsCleared && (!flags[id] || f.t > flags[id].t)) flags[id] = f; });
  m.flags = sorted(flags);
  const drafts = {};
  each(a.drafts, b.drafts, (id, d) => { if ((d.t || 0) > (gone["dr:" + id] || 0) && (!drafts[id] || (d.t || 0) > (drafts[id].t || 0))) drafts[id] = d; });
  m.drafts = sorted(drafts);

  m.production = union(a.production, b.production, x => x.id).sort(by(x => x.id));
  m.errorLog = union(a.errorLog, b.errorLog, x => JSON.stringify(x)).sort(by(x => (x.date || "") + JSON.stringify(x)));
  m.cards = union(a.cards, b.cards, x => x.k, (o, x) => Object.assign({}, o, { exported: o.exported || x.exported, t: Math.min(o.t, x.t) }))
    .filter(c => c.exported || !((gone["c:" + c.k] || 0) > c.t))
    .sort((x, y) => x.t - y.t || (x.k < y.k ? -1 : x.k > y.k ? 1 : 0));
  m.checkpoints = union(a.checkpoints, b.checkpoints, x => x.t).sort(by(x => x.t));
  m.sprints = union(a.sprints, b.sprints, x => x.t).sort(by(x => x.t));
  m.mocks = union(a.mocks, b.mocks, x => JSON.stringify(x)).filter(x => !gone["m:" + JSON.stringify(x)]).sort(by(x => (x.date || "") + JSON.stringify(x)));
  m.time = union(a.time, b.time, x => x.t + x.k).filter(x => !gone["t:" + x.t]).sort(by(x => x.t));
  m.lastBackup = [a.lastBackup, b.lastBackup].filter(Boolean).sort().pop() || null;
  return m;
}

function ghFetch(method, body, raw) {
  const url = `https://api.github.com/repos/${encodeURIComponent(syncCfg.owner)}/${encodeURIComponent(syncCfg.repo)}/contents/${SYNC_FILE}`;
  return fetch(url, {
    method, cache: "no-store",
    headers: { Authorization: "Bearer " + syncCfg.token, Accept: raw ? "application/vnd.github.raw+json" : "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" },
    body: body ? JSON.stringify(body) : undefined
  });
}
function ghError(res) {
  if (res.status === 401) return new Error("GitHub rejected the access key (expired or mistyped)");
  if (res.status === 403) return new Error("the access key isn't allowed to do this (it needs Contents: Read and write)");
  if (res.status === 404) return new Error("repository not found, or the access key can't reach it");
  return new Error("GitHub answered with error " + res.status);
}
async function pullRemote() {
  const res = await ghFetch("GET");
  if (res.status === 404) return { sha: null, data: null };   // no file yet (a wrong repository shows up when pushing)
  if (!res.ok) throw ghError(res);
  const meta = await res.json();
  let text;
  if (meta.content) text = b64decode(meta.content);
  else { const big = await ghFetch("GET", null, true); if (!big.ok) throw ghError(big); text = await big.text(); }   // files over 1 MB
  const data = JSON.parse(text);
  if (!data || data.v !== 1 || !Array.isArray(data.attempts)) throw new Error("progress.json in the repository isn't tutor data");
  return { sha: meta.sha, data };
}

async function syncNow(manual) {
  if (!syncCfg || syncState.busy) return;
  // A merge replaces the state object, so wait until a running drill is finished.
  if (!manual && route() === "session") { syncState.dirty = true; clearTimeout(syncTimer); syncTimer = setTimeout(syncNow, 30000); return; }
  syncState.busy = true; paintSync();
  let changed = false;
  try {
    for (let round = 0; ; round++) {
      const remote = await pullRemote();
      const merged = remote.data ? mergeStates(S, remote.data) : S;
      if (remote.data && JSON.stringify(merged) !== JSON.stringify(S)) { S = merged; lastSettings = JSON.stringify(S.settings); store(); changed = true; }
      const out = JSON.stringify(S);
      if (remote.data && out === JSON.stringify(remote.data)) break;
      const res = await ghFetch("PUT", Object.assign({ message: "Sync " + new Date().toISOString(), content: b64encode(out) }, remote.sha ? { sha: remote.sha } : {}));
      if (res.ok) break;
      if ((res.status === 409 || res.status === 422) && round < 2) continue;   // another device pushed in between: merge again
      throw ghError(res);
    }
    syncState.last = Date.now(); syncState.error = ""; syncState.dirty = false;
  } catch (e) {
    syncState.error = navigator.onLine === false ? "offline" : (e && e.message) || "network problem";
    syncState.dirty = true;
  }
  syncState.busy = false; paintSync();
  if (changed && ["today", "progress"].includes(route())) render();
}
function syncSoon() {
  if (!syncCfg) return;
  syncState.dirty = true;
  clearTimeout(syncTimer); syncTimer = setTimeout(syncNow, 20000);
}
function syncText() {
  if (syncState.busy) return "Syncing…";
  if (syncState.error) return syncState.error === "offline" ? "Offline: changes are kept here and synced later." : "Sync problem: " + syncState.error + ".";
  if (!syncState.last) return "Not synced yet in this session.";
  const d = new Date(syncState.last);
  return `Synced at ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}${syncState.dirty ? ", newer changes waiting" : ""}.`;
}
function paintSync() {
  const el = $("#syncDot");
  if (!el) return;
  el.textContent = !syncCfg ? "" : syncState.busy ? "syncing…" : syncState.error ? (syncState.error === "offline" ? "offline" : "sync problem") : "synced";
  el.title = syncCfg ? syncText() : "";
}
document.addEventListener("visibilitychange", () => { if (syncCfg && (document.visibilityState === "visible" || syncState.dirty)) syncNow(); });
window.addEventListener("online", () => syncNow());

// ---------- Start ----------

loadBank().then(() => { render(); paintSync(); syncNow(); });
if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
  navigator.serviceWorker.register("sw.js").catch(() => { /* offline use just won't be available */ });
  // On the very first visit the exercise files load before the service worker is in control,
  // so save them for offline use from here. The cache name matches sw.js.
  if (window.caches) caches.open("german-tutor-v1").then(c => c.addAll(GT.BANK_FILES.map(f => "data/" + f).concat("placement-test.html"))).catch(() => {});
}

})();
