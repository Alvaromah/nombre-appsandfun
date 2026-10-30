// Escribe tu nombre: the letters of a name burst into stars that draw an animal constellation.
// Same name, same animal, for everyone: a salted hash of the normalised name (accents kept) picks it.
// What the sky shows is a pure function of (events, t). The page plays it live; the film mode
// (?film=1) renders any instant on demand, so the video is this page, frame by frame.
// Nothing is stored or sent: the name never leaves the browser.
(function (root) {
  'use strict';

  // ---- The pure part (also loaded by the Node tools) ------------------------------------------
  const SALT = 'cielo-126758';               // found by tools/find-salt.mjs (see LOG.md)
  const IDS = ['zorro', 'búho', 'ballena', 'dragón', 'gato', 'conejo', 'tortuga', 'pulpo', 'mariposa', 'dinosaurio'];
  const GIANT_LETTERS = 14;                  // from this many letters on, the animal does not fit

  function normalize(name) {
    return String(name).normalize('NFC').replace(/[^\p{L}\p{M}\s'’-]/gu, '').replace(/\s+/g, ' ').trim()
      .toLocaleLowerCase('es');
  }
  const letterCount = norm => (norm.match(/\p{L}/gu) || []).length;
  function hash(str) {                        // FNV-1a over UTF-8, then a murmur3 finaliser
    let h = 0x811c9dc5;
    for (const b of new TextEncoder().encode(str)) { h ^= b; h = Math.imul(h, 0x01000193); }
    h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16;
    return h >>> 0;
  }
  function animalOf(name, salt = SALT) {
    const n = normalize(name);
    return n ? IDS[hash(salt + '|' + n) % IDS.length] : null;
  }
  root.TuNombre = { SALT, IDS, GIANT_LETTERS, normalize, letterCount, hash, animalOf };
  if (typeof document === 'undefined') return;

  // ---- The animals: strokes on a 200×200 sheet, facing right; "L:" marks a leg ----------------
  const ring = (cx, cy, r, n) => Array.from({ length: n + 1 }, (_, i) =>
    `${Math.round(cx + r * Math.cos(i / n * 2 * Math.PI))},${Math.round(cy + r * Math.sin(i / n * 2 * Math.PI))}`).join(' ');
  const SHAPES = {
    zorro: { article: 'UN', leave: 'run', eyes: [[158, 63]], strokes: [
      '132,58 140,30 150,50 166,62 184,72 170,80 152,84 138,97', '132,58 112,72 80,76 52,80',
      'T:52,80 34,68 12,64 -10,70 -28,84 -38,102 -40,116 -30,126 -12,124 8,116 28,106 44,96 52,92',
      'T:34,68 20,80 2,86 -16,96 -38,102', 'T:28,106 8,104 -12,110 -30,126', 'T:-28,84 -22,98 -12,110', 'T:-38,102 -46,108 -40,116',
      '52,92 62,96 76,100 112,100 124,100 138,97',
      'L:138,97 142,124 146,148', 'L:124,100 120,126 114,148', 'L:76,100 80,124 84,148', 'L:62,96 56,122 50,148'] },
    'búho': { article: 'UN', leave: 'fly', eyes: [[82, 84], [118, 84]], strokes: [
      '100,46 122,50 138,30 136,58 142,80 138,104 142,132 136,160 120,178 100,182 80,178 64,160 58,132 62,104 58,80 64,58 62,30 78,50 100,46',
      ring(82, 84, 13, 8), ring(118, 84, 13, 8), '100,94 95,103 100,112 105,103 100,94',
      '66,116 76,142 72,164', '134,116 124,142 128,164', '90,128 100,134 110,128', '88,146 100,152 112,146',
      'L:90,180 88,194', 'L:98,182 98,196', 'L:102,182 102,196', 'L:110,180 112,194'] },
    ballena: { article: 'UNA', leave: 'swim', eyes: [[150, 90]], strokes: [
      '178,100 172,80 156,66 128,60 92,62 64,74 44,90 30,74 22,56', '22,56 6,44', '22,56 36,36',
      '22,56 34,80 52,102', '52,102 82,118 120,124 156,118 178,104 178,100', '178,104 152,106 136,100',
      '168,112 140,116', '128,121 116,142 104,124', 'S:138,60 132,40 124,28', 'S:138,60 144,40 152,28', 'S:138,60 138,32'] },
    'dragón': { article: 'UN', leave: 'fly', eyes: [[183, 43]], strokes: [
      '168,42 176,34 188,38 198,46 186,52 174,50 168,42', '176,34 170,20', '186,37 184,24',
      '168,42 158,54 156,68 146,82 130,88', '174,50 168,62 166,76 154,92 140,98',
      '130,88 104,86 78,92', '140,98 128,112 100,116 80,108',
      '78,92 56,100 36,114 22,130 20,146 32,152 40,144', '78,108 60,110',
      '124,88 112,56 120,28 96,12 106,40 132,8 136,40 158,22 146,62 136,86', '120,28 106,40', '120,28 136,40',
      'L:136,102 142,124 154,128', 'L:94,114 96,136 108,140'] },
    gato: { article: 'UN', leave: 'run', eyes: [[132, 62], [150, 62]], strokes: [
      '118,44 124,22 134,40 146,22 150,46', '118,44 110,62 118,80 138,86 156,78 162,62 150,46',
      '118,80 96,96 80,124 76,156 88,178 128,180 150,172 154,140 146,104 138,86', 'T:88,178 60,182 40,170 34,150 42,136',
      'L:140,118 140,178', '160,70 184,64', '160,74 184,80'] },
    conejo: { article: 'UN', leave: 'run', eyes: [[150, 76]], strokes: [
      '126,60 116,14 128,10 136,56', '138,58 148,16 160,20 148,62', '126,60 116,76 122,92 142,98 162,88 166,74 148,62',
      '122,92 96,96 66,112 54,142 64,168 100,176 134,172 144,150 142,112 142,98', '56,150 42,146 40,160 54,162',
      'L:100,176 136,178 158,174'] },
    tortuga: { article: 'UNA', leave: 'run', eyes: [[186, 106]], strokes: [
      '40,120 54,84 84,64 116,62 146,78 160,110 160,120 40,120', '84,64 92,92 116,62', '92,92 132,92 146,78',
      '92,92 78,120', '132,92 134,120', '160,108 176,98 192,100 196,112 184,120 160,120', '40,120 22,126',
      'L:62,120 58,140 76,140 78,120', 'L:128,120 126,140 144,140 146,120'] },
    pulpo: { article: 'UN', leave: 'swim', eyes: [[84, 74], [116, 74]], strokes: [
      '100,20 72,30 58,58 62,90 78,106 122,106 138,90 142,58 128,30 100,20',
      'L:72,104 56,128 62,150 46,172', 'L:84,106 78,138 90,160 82,188', 'L:96,106 98,144 108,168 102,192',
      'L:108,106 112,144 102,170 112,192', 'L:120,106 128,138 116,160 124,186', 'L:130,100 150,128 144,150 160,172',
      'L:64,94 40,106 26,126', 'L:136,94 160,106 174,126'] },
    mariposa: { article: 'UNA', leave: 'fly', eyes: [[100, 46]], strokes: [
      '100,46 100,56 100,150', '100,46 86,26 78,20', '100,46 114,26 122,20',
      '100,70 70,40 36,32 20,56 32,90 70,104 100,96', '100,70 130,40 164,32 180,56 168,90 130,104 100,96',
      '100,104 64,112 44,136 56,162 84,156 100,128', '100,104 136,112 156,136 144,162 116,156 100,128'] },
    dinosaurio: { article: 'UN', leave: 'run', eyes: [[182, 38]], strokes: [
      '172,34 184,32 192,38 188,46 176,46', '172,34 156,46 142,70 128,96', '176,46 164,60 152,86 144,112',
      '128,96 100,90 70,96 48,110', '48,110 26,124 10,140 2,150 30,138 52,128', '144,112 134,120 120,130 80,132 64,130 52,128',
      'L:134,120 134,160', 'L:120,130 122,160', 'L:80,132 78,162', 'L:64,130 64,160'] },
  };

  // Each animal becomes stars (the strokes' vertices, merged when they touch) and the edges between them.
  const BUILT = {};
  function build(id) {
    if (BUILT[id]) return BUILT[id];
    const s = SHAPES[id], stars = [], edges = [], legs = [];
    const find = (x, y) => {
      for (let i = 0; i < stars.length; i++) if (Math.hypot(stars[i].x - x, stars[i].y - y) < 3) return i;
      stars.push({ x, y, leg: -1, k: 0 }); return stars.length - 1;
    };
    s.strokes.forEach(st => {
      const leg = st.startsWith('L:'), spout = st.startsWith('S:'), tail = st.startsWith('T:');
      const pts = (leg || spout || tail ? st.slice(2) : st).trim().split(/\s+/).map(p => p.split(',').map(Number));
      const ids = pts.map(([x, y]) => find(x, y));
      if (leg) { const li = legs.length; legs.push(ids); ids.forEach((id, k) => { if (k > 0) { stars[id].leg = li; stars[id].k = k / (ids.length - 1); } }); }
      if (spout) ids.forEach((id, k) => { if (k > 0) { stars[id].spout = true; stars[id].k = k / (ids.length - 1); } });
      if (tail) ids.forEach((id, k) => { if (k > 0 && k < ids.length - 1) stars[id].tail = true; });
      for (let i = 1; i < ids.length; i++) if (ids[i] !== ids[i - 1]) edges.push([ids[i - 1], ids[i]]);
    });
    const eyes = s.eyes.map(([x, y]) => find(x, y));
    const xs = stars.map(p => p.x), ys = stars.map(p => p.y);
    const box = { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
    return (BUILT[id] = { ...s, id, stars, edges, eyes, legs: legs.length, box });
  }

  // ---- Small helpers ---------------------------------------------------------------------------
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = p => 1 - Math.pow(1 - clamp(p), 3);
  const easeIn = p => Math.pow(clamp(p), 2);
  function rng(seed) {                        // mulberry32
    let a = seed >>> 0;
    return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const FONT = '"Segoe UI", system-ui, -apple-system, Roboto, "Helvetica Neue", Arial, sans-serif';
  const upper = s => String(s).normalize('NFC').toLocaleUpperCase('es');

  // Timings after a name is sent (seconds).
  // The name rises from the box into the sky, growing (rise), holds, and bursts at `lift`.
  const T = { rise: 0.32, lift: 0.62, flyMin: 0.46, flyMax: 0.62, stagger: 0.14, line: 0.26, label: 1.35, blink: 0.18, dash: 0.22, zip: 0.22, hang: 0.45, tailZip: 0.2, gone: 0.9 };
  // A long name's animal forms at the normal size, then grows until it does not fit, stamps and walks off.
  const GIANT = { grow: 2.6, growDur: 0.6, stomp: 3.25, delay: 4.0, speed: 230, pause: 7, step: 0.4 };

  // ---- The page ---------------------------------------------------------------------------------
  const film = /[?&]film=1\b/.test(location.search);
  const reduce = !film && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = s => document.querySelector(s);
  const canvas = $('#cielo'), ctx = canvas.getContext('2d'), front = $('#letras'), ftx = front.getContext('2d');
  const form = $('#formulario'), input = $('#nombre'), caret = $('#cursor'), live = $('#anuncio');
  if (film) document.documentElement.classList.add('film');
  let W = 0, H = 0, DPR = 1;
  function resize() {
    DPR = window.devicePixelRatio || 1; W = innerWidth; H = innerHeight;
    canvas.width = front.width = Math.round(W * DPR); canvas.height = front.height = Math.round(H * DPR);
  }
  resize();

  const sky = (() => { const r = rng(7); return Array.from({ length: 190 }, () => ({ x: r(), y: r(), s: 0.35 + r() * 1.25, p: r() * 6.28, f: 0.6 + r() * 1.6 })); })();
  let period = 0;                            // film only: the twinkles repeat every `period` seconds
  const glow = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d');
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,250,230,1)'); gr.addColorStop(0.18, 'rgba(255,236,170,0.85)');
    gr.addColorStop(0.45, 'rgba(255,210,120,0.22)'); gr.addColorStop(1, 'rgba(255,200,100,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return c;
  })();

  const boxSize = () => Math.min(W * 0.62, H * 0.34);
  // The box's text shrinks to fit a long name; the flying letters use the same size.
  const measurer = document.createElement('canvas').getContext('2d');
  function fitFont(text) {
    const cs = getComputedStyle(input), avail = input.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    measurer.font = `800 40px ${FONT}`;
    const w = measurer.measureText(upper(text)).width;
    return w <= avail - 10 ? 40 : Math.max(14, Math.floor(40 * (avail - 10) / w));
  }
  // Where the letters of `text` sit inside the input, in CSS pixels.
  function glyphs(text) {
    const r = input.getBoundingClientRect(), fs = fitFont(text), up = upper(text);
    measurer.font = `800 ${fs}px ${FONT}`;
    const total = measurer.measureText(up).width, cx = r.left + r.width / 2, x0 = cx - total / 2, base = r.top + r.height / 2 + fs * 0.36;
    const sky = Math.min(2.4, W * 0.74 / Math.max(1, total)), ty = H * 0.375;   // in the sky: centred and bigger
    return { fs, up, sky, list: [...up].map((ch, i) => {
      const before = measurer.measureText([...up].slice(0, i).join('')).width, w = measurer.measureText(ch).width, x = x0 + before + w / 2;
      return { ch, x, y: base - fs * 0.36, base, tx: W / 2 + (x - cx) * sky, ty };
    }) };
  }

  // A creature: one sent name, its animal, its stars' flights. Memoised by (name, time).
  const cache = new Map();
  function creature(name, ts) {
    const key = ts + '|' + name;
    if (cache.has(key)) return cache.get(key);
    const norm = normalize(name), id = animalOf(name), shape = build(id), r = rng(hash('v|' + norm));
    const n = letterCount(norm), giant = n >= GIANT_LETTERS;
    const g = glyphs(name);
    const order = shape.stars.map((s, i) => i).sort((a, b) => shape.stars[a].x - shape.stars[b].x);
    const flights = [];
    order.forEach((si, rank) => {
      const li = Math.min(g.list.length - 1, Math.floor(rank * g.list.length / order.length));
      const dep = T.lift + r() * T.stagger, dur = T.flyMin + r() * (T.flyMax - T.flyMin);
      flights[si] = { li, dep, arr: dep + dur, bend: (r() - 0.5) * 120, lift: 60 + r() * 80, size: 0.8 + r() * 0.55, tw: r() * 6.28 };
    });
    const sparks = g.list.flatMap((gl, li) => Array.from({ length: 9 }, () => ({ li, a: r() * 6.28, v: 60 + r() * 140, s: 0.6 + r() })));
    const c = { name, norm, id, shape, giant, n, ts, tilt: (r() - 0.5) * 0.1, blink0: 1.8 + r() * 1.2, g, flights, sparks, leaveAt: null };
    cache.set(key, c);
    return c;
  }

  // The state at time t: the text in the box and the creatures on screen.
  let events = [];
  function stateAt(t) {
    let text = '', current = null, lastKey = null;
    const list = [];
    for (const e of events) {
      if (e.t > t) break;
      if (e.type === 'text') {
        if (e.value && current && current.leaveAt === null && e.t > current.ts) current.leaveAt = e.t;
        lastKey = e.t;
        text = e.value;
      } else if (e.type === 'submit' && normalize(text)) {
        const c = Object.assign(Object.create(null), creature(text, e.t), { leaveAt: null });
        if (current && current.leaveAt === null) current.leaveAt = e.t;
        list.push(c); current = c; text = '';
      }
    }
    return { text, lastKey, list: list.filter(c => c.leaveAt === null || t < c.leaveAt + (c.giant ? 0.9 : T.gone)) };
  }

  // Where a creature stands at time t: its centre, scale and the walk of a giant.
  function placement(c, t) {
    const b = c.shape.box, w = b.x1 - b.x0, h = b.y1 - b.y0;
    const size = boxSize(), cy = H * 0.375;
    const k = c.n > 10 && !c.giant ? 1 + (c.n - 10) * 0.12 : 1;
    const s0 = size / Math.max(w, h) * k, ay0 = (b.y0 + b.y1) / 2;
    if (!c.giant) return { s: s0, x: W / 2, y: cy, ax: (b.x0 + b.x1) / 2, ay: ay0, walk: 0, half: w * s0 / 2 };
    const s = size / Math.max(w, h) * Math.min(3.4, 2.9 + (c.n - GIANT_LETTERS) * 0.05);
    const ground = H * 0.64, half = w * s / 2, start = c.ts + GIANT.delay, speed = GIANT.speed;
    const lap = (W + 2 * half) / speed + GIANT.pause;          // walk out, then come back after a while
    let x = W / 2;
    const dt = t - start;
    if (dt > 0) {
      const outT = (W / 2 + half) / speed;
      if (dt < outT) x = W / 2 - speed * dt;
      else { const q = (dt - outT) % lap; x = q < GIANT.pause ? -half - 10 : W + half - speed * (q - GIANT.pause); }
    }
    const g = ease((t - c.ts - GIANT.grow) / GIANT.growDur), sg = s0 + (s - s0) * g;
    return { s: sg, x, y: cy + (ground - cy) * g, ax: (b.x0 + b.x1) / 2, ay: ay0 + (b.y1 - ay0) * g, walk: Math.max(0, dt), half: w * sg / 2, g };
  }

  // The screen position of star i of creature c at time t (after it has arrived).
  function starPos(c, i, t, P, leaveP) {
    const st = c.shape.stars[i];
    let x = st.x - P.ax, y = st.y - P.ay;
    if (c.shape.id === 'mariposa') x *= 0.82 + 0.18 * Math.cos((t - c.ts) * (leaveP > 0 ? 22 : 2.2));
    if (st.spout) { const puff = Math.max(0, Math.sin((t - c.ts) * 2.6)); y -= st.k * 14 * puff; x += (x - 38) * 0.25 * st.k * puff; }
    if (st.leg >= 0) {
      const moving = c.giant ? P.walk > 0 : leaveP > 0;
      const ph = c.giant ? P.walk * 7 : (t - c.ts) * 26;
      if (moving) x += Math.sin(ph + st.leg * Math.PI) * (c.shape.id === 'pulpo' ? 7 : 9) * st.k;
      else if (c.shape.id === 'pulpo') x += Math.sin((t - c.ts) * 2.4 + st.leg) * 3 * st.k;
    }
    const cs = Math.cos(c.tilt), sn = Math.sin(c.tilt);
    const breathe = 1 + 0.012 * Math.sin((t - c.ts) * 1.7);
    return [P.x + (x * cs - y * sn) * P.s * breathe, P.y + (x * sn + y * cs) * P.s * breathe];
  }

  // The leaving motion, in screen pixels, p = 0..1 over the dash.
  function leaveOffset(c, p) {
    const d = W * 1.3 * Math.pow(p, 1.5);
    if (c.shape.leave === 'fly') return [d * 0.45, -H * 0.75 * Math.pow(p, 1.5) + Math.sin(p * 18) * 6];
    if (c.shape.leave === 'swim') return [d, Math.sin(p * 9) * 14];
    return [d, -Math.abs(Math.sin(p * 14)) * 22];
  }

  function draw(t) {
    const S = stateAt(t);
    ftx.setTransform(1, 0, 0, 1, 0, 0); ftx.clearRect(0, 0, front.width, front.height); ftx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#060a1c'); bg.addColorStop(0.55, '#0d1438'); bg.addColorStop(1, '#1d2058');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    for (const s of sky) {
      const f = period ? Math.max(1, Math.round(s.f * period / (2 * Math.PI))) * 2 * Math.PI / period : s.f;
      const a = 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(t * f + s.p));
      ctx.fillStyle = `rgba(220,228,255,${a.toFixed(3)})`;
      ctx.fillRect(s.x * W, s.y * H, s.s, s.s);
    }
    // A giant's steps shake the sky.
    let sx = 0, sy = 0;
    for (const c of S.list) if (c.giant && !reduce) {
      const P = placement(c, t), stomp = t - (c.ts + GIANT.stomp);
      if (stomp > 0 && stomp < 0.6) sy += Math.sin(stomp * 55) * 9 * Math.exp(-stomp / 0.14);
      if (P.walk > 0 && P.x + P.half > 0 && P.x - P.half < W) { const ph = P.walk % GIANT.step; sy += Math.sin(ph * 60) * 4 * Math.exp(-ph / 0.1); }
    }
    ctx.setTransform(DPR, 0, 0, DPR, sx * DPR, sy * DPR);
    for (const c of S.list) drawCreature(c, t);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    // The box shows the text being typed, its size fitted to its length.
    const fs = fitFont(S.text);
    if (input.style.fontSize !== fs + 'px') input.style.fontSize = fs + 'px';
    if (film) {
      input.value = S.text;
      const up = upper(S.text); measurer.font = `800 ${fs}px ${FONT}`;
      caret.style.transform = `translateX(${(measurer.measureText(up).width / 2 + 3).toFixed(1)}px)`;
      caret.style.height = Math.round(fs * 1.1) + 'px';
      caret.style.opacity = S.lastKey !== null && t - S.lastKey < 0.45 ? 1 : (Math.floor(t * 1.9) % 2 ? 0 : 1);
    }
    return S;
  }

  function drawCreature(c, t) {
    const age = t - c.ts, P = placement(c, t);
    const leaveAge = c.leaveAt === null ? -1 : t - c.leaveAt;
    const leaveP = c.giant ? 0 : clamp((leaveAge - T.dash) / T.zip);
    const fade = c.giant && leaveAge >= 0 ? 1 - clamp(leaveAge / 0.8) : 1;
    const leaving = leaveAge >= 0 && !c.giant;
    const hop = leaving && leaveAge < T.dash && !reduce ? -Math.sin(Math.PI * leaveAge / T.dash) * 22 : 0;   // startled
    const [lx, ly0] = leaving ? leaveOffset(c, leaveP) : [0, 0], ly = ly0 + hop;
    // The body zips off; a tail is left hanging alone for a beat, wiggles, then zips after it.
    const split = leaving && leaveAge > T.dash, tailP = leaving ? clamp((leaveAge - T.dash - T.hang) / T.tailZip) : 0;
    const wiggle = 0;              // the forgotten tail stays still
    const [tlx, tly] = leaving ? leaveOffset(c, tailP) : [0, 0];
    const L = c.g.list;
    // The letters rise out of the box, glowing, then burst.
    if (age < T.lift + 0.12) {
      ftx.save(); ftx.font = `800 ${c.g.fs}px ${FONT}`; ftx.textAlign = 'center'; ftx.textBaseline = 'alphabetic';
      const p = reduce ? 1 : ease(age / T.rise), burst = clamp((age - T.lift) / 0.12);
      const hold = age > T.rise ? 1 + 0.035 * Math.sin((age - T.rise) * 38) : 1;
      for (const gl of L) {
        const sc = (1 + (c.g.sky - 1) * p) * hold * (1 + 0.5 * burst);
        ftx.save(); ftx.translate(gl.x + (gl.tx - gl.x) * p, gl.y + (gl.ty - gl.y) * p); ftx.scale(sc, sc);
        ftx.globalAlpha = 1 - burst; ftx.shadowColor = 'rgba(255,214,120,0.95)'; ftx.shadowBlur = 8 + 14 * p;
        ftx.fillStyle = '#fff6dc'; ftx.fillText(gl.ch, 0, c.g.fs * 0.36); ftx.restore();
      }
      ftx.restore();
    }
    // Sparks from the burst.
    if (age > T.lift && age < T.lift + 0.55 && !reduce) {
      const q = (age - T.lift) / 0.55;
      for (const sp of c.sparks) {
        const gl = L[sp.li], d = sp.v * ease(q);
        ftx.globalAlpha = (1 - q) * 0.9;
        const sz = 16 * sp.s * (1 - q * 0.6);
        ftx.drawImage(glow, gl.tx + Math.cos(sp.a) * d - sz / 2, gl.ty + Math.sin(sp.a) * d - sz / 2, sz, sz);
      }
      ftx.globalAlpha = 1;
    }
    // Where every star is now.
    const pos = [], arrived = [];
    const stars = c.shape.stars;
    const tailCentre = (() => { const ts = stars.map((st, i) => st.tail ? starPos(c, i, t, P, 0) : null).filter(Boolean);
      return ts.length ? [ts.reduce((a, q) => a + q[0], 0) / ts.length, ts.reduce((a, q) => a + q[1], 0) / ts.length] : [0, 0]; })();
    for (let i = 0; i < stars.length; i++) {
      const f = c.flights[i];
      let [x, y] = starPos(c, i, t, P, leaveP);
      if (stars[i].tail && leaving) { x += tlx + wiggle; y += tly + (split ? 0 : hop); } else { x += lx; y += ly; }
      if (stars[i].tail && split) {               // left alone, the tail puffs up so it reads
        const g = 1 + 0.25 * ease((leaveAge - T.dash) / 0.12), cx = tailCentre[0] + tlx + wiggle, cy = tailCentre[1] + tly;
        x = cx + (x - cx) * g; y = cy + (y - cy) * g;
      }
      if (age < f.arr && !reduce) {
        if (age < f.dep) { pos[i] = null; arrived[i] = 0; continue; }
        const p = ease((age - f.dep) / (f.arr - f.dep)), gl = L[f.li];
        const sx0 = gl.tx, sy0 = gl.ty;
        const mx = (sx0 + x) / 2 + f.bend, my = (sy0 + y) / 2 - f.lift * 0.6;
        x = (1 - p) * (1 - p) * sx0 + 2 * (1 - p) * p * mx + p * p * x;
        y = (1 - p) * (1 - p) * sy0 + 2 * (1 - p) * p * my + p * p * y;
        arrived[i] = 0;
      } else if (reduce && age < T.lift + 0.4) { arrived[i] = clamp((age - T.lift) / 0.4); }
      else arrived[i] = 1;
      pos[i] = [x, y];
    }
    ctx.globalAlpha = fade;
    // The lines, each drawn once both its stars have arrived.
    ctx.lineCap = 'round'; ctx.lineWidth = c.giant ? 2.4 : 1.6; ctx.strokeStyle = 'rgba(164,198,255,0.62)';
    ctx.beginPath();
    for (const [a, b] of c.shape.edges) {
      if (!pos[a] || !pos[b] || !arrived[a] || !arrived[b]) continue;
      if (split && !stars[a].tail !== !stars[b].tail) continue;     // the tail has come off
      const start = Math.max(c.flights[a].arr, c.flights[b].arr) + 0.04;
      const p = reduce ? 1 : ease((age - start) / T.line);
      if (p <= 0) continue;
      ctx.moveTo(pos[a][0], pos[a][1]); ctx.lineTo(pos[a][0] + (pos[b][0] - pos[a][0]) * p, pos[a][1] + (pos[b][1] - pos[a][1]) * p);
    }
    ctx.stroke();
    // The stars; the eyes blink now and then, and once more just before running off.
    for (let i = 0; i < stars.length; i++) {
      if (!pos[i]) continue;
      const f = c.flights[i];
      let size = (c.giant ? 15 : 11) * f.size * (0.86 + 0.14 * Math.sin(t * 3.1 + f.tw));
      if (stars[i].tail) size *= split ? 1.3 : 1.1;
      if (c.shape.eyes.includes(i)) {
        size *= 1.35;
        const since = age - c.blink0, period = 3.1;
        const idleBlink = since > 0 && since % period < 0.16;
        const leaveBlink = leaveAge >= 0 && leaveAge < T.blink;
        if (idleBlink || leaveBlink) size *= 0.08;
      }
      if (age < f.arr && !reduce) size *= 0.75;
      ctx.globalAlpha = fade * (reduce ? arrived[i] : 1);
      ctx.drawImage(glow, pos[i][0] - size, pos[i][1] - size, size * 2, size * 2);
    }
    ctx.globalAlpha = 1;
    // A puff of star dust where it stood, as it zips off.
    if (split && leaveAge < T.dash + 0.45 && !reduce) {
      const q = (leaveAge - T.dash) / 0.45;
      for (let k = 0; k < 12; k++) {
        const sp = c.sparks[k % c.sparks.length], d = 26 + 70 * ease(q), sz = 18 * (1 - q);
        ctx.globalAlpha = 0.8 * (1 - q);
        ctx.drawImage(glow, P.x + Math.cos(sp.a) * d - sz / 2, P.y + Math.sin(sp.a) * d * 0.55 + 20 - sz / 2, sz, sz);
      }
      ctx.globalAlpha = 1;
    }
    // Startled: a «!» pops over its head as it notices the new name, then it runs.
    if (leaveAge >= 0 && leaveAge < T.dash + 0.35 && !c.giant) {
      const eye = c.shape.eyes[0], ep = pos[eye];
      if (ep) {
        const pop = ease(leaveAge / 0.12), fadeOut = 1 - clamp((leaveAge - T.dash - 0.15) / 0.2);
        ctx.save(); ctx.globalAlpha = fadeOut; ctx.translate(ep[0] + 6, ep[1] - 44 - 10 * pop); ctx.scale(0.6 + 0.6 * pop, 0.6 + 0.6 * pop);
        ctx.font = `900 46px ${FONT}`; ctx.textAlign = 'center'; ctx.shadowColor = 'rgba(255,214,120,0.95)'; ctx.shadowBlur = 16;
        ctx.fillStyle = '#ffe9a8'; ctx.fillText('!', 0, 0); ctx.restore();
      }
    }
    // The tail left behind wonders where its fox went: a «?» over it, until it zips after.
    if (split && tailP < 0.6 && leaveAge > T.dash + 0.06) {
      const tails = pos.filter((q, i) => q && stars[i].tail);
      if (tails.length) {
        const cx = tails.reduce((a, q) => a + q[0], 0) / tails.length, top = Math.min(...tails.map(q => q[1]));
        const pop = ease((leaveAge - T.dash - 0.06) / 0.1);
        ctx.save(); ctx.globalAlpha = 1 - clamp((tailP - 0.35) / 0.25); ctx.translate(cx, top - 26 - 8 * pop); ctx.scale(0.5 + 0.6 * pop, 0.5 + 0.6 * pop);
        ctx.font = `900 60px ${FONT}`; ctx.textAlign = 'center'; ctx.shadowColor = 'rgba(255,214,120,0.95)'; ctx.shadowBlur = 18;
        ctx.fillStyle = '#ffe9a8'; ctx.fillText('?', 0, 0); ctx.restore();
      }
    }
    // The words under it: the name, then what it is.
    const seen = c.giant ? clamp((P.x + P.half) / 160) * clamp((W - P.x + P.half) / 160) : 1;
    const la = clamp((age - T.label) / 0.3) * (leaveAge >= 0 ? 1 - clamp(leaveAge / 0.2) : 1) * seen;
    if (la > 0) {
      const y0 = H * 0.375 + boxSize() / 2 + 26;
      ctx.save(); ctx.globalAlpha = la; ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,10,0.9)'; ctx.shadowBlur = 10;
      if (c.giant && age >= GIANT.grow) {
        const big = age < GIANT.delay + 0.1;
        ctx.globalAlpha = la * clamp((age - GIANT.grow - 0.35) / 0.15);
        ctx.font = `900 ${big ? 40 : 30}px ${FONT}`; ctx.fillStyle = '#ffd56b';
        ctx.fillText(big ? '¡NO CABE!' : `${c.shape.article} ${upper(c.id)}`, W / 2, y0 + 14);
        if (!big) { ctx.font = `900 30px ${FONT}`; ctx.fillText('GIGANTE', W / 2, y0 + 50); }
      } else {
        ctx.font = `800 20px ${FONT}`; ctx.fillStyle = '#eef2ff';
        ctx.fillText(upper(c.name.trim()), W / 2, y0);
        ctx.font = `900 34px ${FONT}`; ctx.fillStyle = '#ffd56b';
        ctx.fillText(`ES ${c.shape.article} ${upper(c.id)}`, W / 2, y0 + 38);
      }
      ctx.restore();
    }
  }

  // Every sound the page makes for the events up to `until`: what the film's soundtrack synthesizes.
  function soundEvents(until) {
    const out = [], S = stateAt(until);
    let prev = '';
    for (const e of events) {
      if (e.t > until) break;
      if (e.type === 'text') { if (e.value.length > prev.length) out.push({ t: e.t, kind: 'key' }); prev = e.value; }
    }
    const all = [];
    let text = '', current = null;
    for (const e of events) {                 // the same replay as stateAt, keeping every creature
      if (e.t > until) break;
      if (e.type === 'text') { if (e.value && current && current.leaveAt === null && e.t > current.ts) current.leaveAt = e.t; text = e.value; }
      else if (e.type === 'submit' && normalize(text)) {
        const c = Object.assign(Object.create(null), creature(text, e.t), { leaveAt: null });
        if (current && current.leaveAt === null) current.leaveAt = e.t;
        all.push(c); current = c; text = '';
      }
    }
    for (const c of all) {
      out.push({ t: c.ts + T.lift, kind: 'burst', giant: c.giant });
      c.shape.stars.forEach((st, i) => { if (i % 3 === 0) out.push({ t: c.ts + c.flights[i].arr, kind: 'plink', i }); });
      out.push({ t: c.ts + T.label, kind: 'chime' });
      if (c.leaveAt !== null && !c.giant) out.push({ t: c.leaveAt + T.blink, kind: 'leave', how: c.shape.leave });
      if (c.leaveAt !== null && !c.giant && c.shape.stars.some(st => st.tail)) out.push({ t: c.leaveAt + T.dash + T.hang, kind: 'tail' });
      if (c.giant) {
        out.push({ t: c.ts + GIANT.stomp, kind: 'stomp' });
        for (let w = 0; ; w += GIANT.step) {
          const t = c.ts + GIANT.delay + w;
          if (t > until || (c.leaveAt !== null && t > c.leaveAt)) break;
          const P = placement(c, t);
          if (P.x + P.half > 0 && P.x - P.half < W) out.push({ t, kind: 'step' });
        }
      }
    }
    void S;
    return out.filter(e => e.t <= until).sort((a, b) => a.t - b.t);
  }

  // ---- Live: the page as people use it ----------------------------------------------------------
  if (film) {
    window.__film = {
      load(list, opts = {}) { events = list.slice().sort((a, b) => a.t - b.t); period = opts.period || 0; cache.clear(); return events.length; },
      sounds: soundEvents,
      seek(t) { const S = draw(t); return { text: S.text, creatures: S.list.map(c => c.id + (c.giant ? '*' : '')) }; },
      animalOf, normalize,
    };
    return;
  }
  // ---- Sound: synthesized, only after the first key; the button turns it off --------------------
  const sound = (() => {
    let ac = null, on = true;
    const btn = $('#sonido');
    btn.addEventListener('click', () => { on = !on; btn.setAttribute('aria-pressed', String(on)); btn.classList.toggle('off', !on); });
    const ctxA = () => { if (!ac) ac = new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === 'suspended') ac.resume(); return ac; };
    function tone(f, at, dur, gain, type = 'sine') {
      const a = ctxA(), o = a.createOscillator(), g = a.createGain();
      o.type = type; o.frequency.value = f; o.connect(g); g.connect(a.destination);
      const t = a.currentTime + at; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur); o.start(t); o.stop(t + dur + 0.02);
    }
    const PENTA = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51, 1567.98];
    let k = 0;
    return {
      key() { if (on) tone(PENTA[(k++ * 3) % 5] * 2, 0, 0.06, 0.05); },
      burst(c) {
        if (!on) return;
        tone(220, T.lift, 0.35, 0.08, 'triangle');
        c.shape.stars.forEach((s, i) => { if (i % 3 === 0) tone(PENTA[i % PENTA.length], c.flights[i].arr, 0.5, 0.035); });
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, T.label + i * 0.04, 1.1, 0.05));
        if (c.giant) { tone(48, GIANT.stomp, 0.5, 0.3); tone(96, GIANT.stomp, 0.35, 0.12); }
      },
      step() { if (on) { tone(55, 0, 0.32, 0.25); tone(110, 0, 0.22, 0.08); } },
      leave(tail) {
        if (!on) return;
        [0, 1, 2, 3, 4].forEach(i => tone(1400 - i * 120, T.blink + i * 0.07, 0.05, 0.03, 'triangle'));
        if (tail) { tone(900, T.dash + T.hang, 0.05, 0.035, 'triangle'); tone(1300, T.dash + T.hang + 0.05, 0.06, 0.035, 'triangle'); }
      },
    };
  })();
  const t0 = performance.now(), now = () => (performance.now() - t0) / 1000;
  input.addEventListener('input', () => {
    const t = now(), before = stateAt(t).list.at(-1);
    events.push({ t, type: 'text', value: input.value });
    sound.key();
    if (input.value && before && before.leaveAt === null && !before.giant) sound.leave(before.shape.stars.some(st => st.tail));
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = input.value;
    if (!normalize(name)) { input.focus(); return; }
    const t = now();
    events.push({ t, type: 'submit' }, { t, type: 'text', value: '' });
    input.value = '';
    const c = creature(name, t);
    sound.burst(c);
    setTimeout(() => {
      live.textContent = `${name.trim()} ${c.giant ? `es ${c.shape.article.toLowerCase()} ${c.id} gigante: no cabe en la pantalla` : `es ${c.shape.article.toLowerCase()} ${c.id}`}.`;
    }, 1000);
  });
  addEventListener('resize', () => { resize(); cache.clear(); });
  const steps = new Map();
  (function loop() {
    const t = now();
    for (const c of stateAt(t).list) if (c.giant) {
      const P = placement(c, t), k = Math.floor(P.walk / 0.6), key = c.ts;
      if (P.walk > 0 && steps.get(key) !== k && P.x > -W * 0.3 && P.x < W * 1.3) sound.step();
      steps.set(key, k);
    }
    draw(t);
    requestAnimationFrame(loop);
  })();

})(typeof window !== 'undefined' ? window : globalThis);
