/* ═══════════════════════════════════════════
   GEOMETRI LINGKARAN — script6.js
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  /* ══════════════════════════════
     CUSTOM CURSOR
  ══════════════════════════════ */
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    if (dot) { dot.style.left = mx + 'px'; dot.style.top = my + 'px'; }
  });

  (function followRing() {
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
    requestAnimationFrame(followRing);
  })();

  document.querySelectorAll('a, button, .qc-opt, .def-item, .formula-block, .about-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring && ring.classList.add('big'));
    el.addEventListener('mouseleave', () => ring && ring.classList.remove('big'));
  });

  document.addEventListener('mouseleave', () => { if (dot) dot.style.opacity = '0'; if (ring) ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { if (dot) dot.style.opacity = '1'; if (ring) ring.style.opacity = '1'; });


  /* ══════════════════════════════
     CLICK SPARK
  ══════════════════════════════ */
  (function initSpark() {
    const canvas = document.getElementById('spark-canvas');
    if (!canvas) return;
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const ctx = canvas.getContext('2d');
    const sparks = [];
    const COUNT = 8, SIZE = 10, RADIUS = 36, DUR = 500;
    const easeOut = t => t * (2 - t);

    (function draw(ts) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        const el = ts - s.t;
        if (el >= DUR) { sparks.splice(i, 1); continue; }
        const p = el / DUR, e = easeOut(p);
        const dist = e * RADIUS, len = SIZE * (1 - e);
        ctx.globalAlpha = 1 - p;
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 1.5; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(s.x + dist * Math.cos(s.a), s.y + dist * Math.sin(s.a));
        ctx.lineTo(s.x + (dist + len) * Math.cos(s.a), s.y + (dist + len) * Math.sin(s.a));
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    })(0);

    document.addEventListener('click', (e) => {
      const now = performance.now();
      for (let i = 0; i < COUNT; i++) {
        sparks.push({ x: e.clientX, y: e.clientY, a: (2 * Math.PI * i) / COUNT, t: now });
      }
    });
  })();


  /* ══════════════════════════════
     NAV — solid + active link
  ══════════════════════════════ */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav && nav.classList.toggle('solid', window.scrollY > 60);
  }, { passive: true });

  const nlLinks = document.querySelectorAll('.nl');
  const sections = document.querySelectorAll('section[id]');
  const secObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      nlLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
    });
  }, { threshold: 0.35 });
  sections.forEach(s => secObs.observe(s));


  /* ══════════════════════════════
     HAMBURGER / DRAWER
  ══════════════════════════════ */
  const hamburger = document.getElementById('hamburger');
  const drawer    = document.getElementById('drawer');
  const overlay   = document.getElementById('drawer-overlay');
  const open  = () => { drawer?.classList.add('open'); overlay?.classList.add('open'); hamburger?.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = () => { drawer?.classList.remove('open'); overlay?.classList.remove('open'); hamburger?.classList.remove('open'); document.body.style.overflow = ''; };
  hamburger?.addEventListener('click', open);
  overlay?.addEventListener('click', close);
  document.querySelectorAll('.dl').forEach(l => l.addEventListener('click', close));


  /* ══════════════════════════════
     SCROLL REVEAL
  ══════════════════════════════ */
  const revObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); } });
  }, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));


  /* ══════════════════════════════
     SMOOTH ANCHORS
  ══════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const t = document.getElementById(this.getAttribute('href').slice(1));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });


  /* ══════════════════════════════
     QUIZ ENGINE
  ══════════════════════════════ */
  const QUESTIONS = [
    // ── REGULER 1-15 ──
    {
      n: 1, topic: 'Keliling',
      q: 'Sebuah lingkaran memiliki jari-jari 14 cm. Keliling lingkaran tersebut adalah...',
      opts: ['44 cm','66 cm','88 cm','154 cm','616 cm'],
      ans: 'C',
      exp: 'K = 2 × 22/7 × 14 = 2 × 44 = <strong>88 cm</strong>. Karena r = 14 merupakan kelipatan 7, gunakan π = 22/7.'
    },
    {
      n: 2, topic: 'Luas',
      q: 'Luas sebuah lingkaran yang memiliki diameter 20 cm (π = 3,14) adalah...',
      opts: ['62,8 cm²','125,6 cm²','314 cm²','628 cm²','1.256 cm²'],
      ans: 'C',
      exp: 'r = 10 cm. L = π × r² = 3,14 × 100 = <strong>314 cm²</strong>.'
    },
    {
      n: 3, topic: 'Sudut Keliling',
      q: 'Diketahui sudut pusat = 60°. Jika sudut keliling menghadap busur yang sama, maka besar sudut kelilingnya adalah...',
      opts: ['30°','45°','60°','120°','180°'],
      ans: 'A',
      exp: 'Sudut Keliling = ½ × Sudut Pusat = ½ × 60° = <strong>30°</strong>.'
    },
    {
      n: 4, topic: 'Sudut Keliling',
      q: 'Sudut keliling ∠ABC menghadap diameter AC. Jika ∠BAC = 35°, maka besar ∠BCA adalah...',
      opts: ['35°','45°','55°','90°','145°'],
      ans: 'C',
      exp: '∠ABC = 90° (menghadap diameter). Maka ∠BCA = 180° − 90° − 35° = <strong>55°</strong>.'
    },
    {
      n: 5, topic: 'Sudut Dalam',
      q: 'Dua tali busur AB dan CD berpotongan di dalam lingkaran pada E. Busur AC = 70°, busur BD = 50°. Besar ∠AEC adalah...',
      opts: ['20°','35°','60°','110°','120°'],
      ans: 'C',
      exp: '∠AEC = ½ × (Busur AC + Busur BD) = ½ × (70° + 50°) = ½ × 120° = <strong>60°</strong>.'
    },
    {
      n: 6, topic: 'Sudut Luar',
      q: 'Dua garis berpotongan di luar lingkaran. Busur terbesar = 110°, busur terkecil = 40°. Besar sudut potongannya adalah...',
      opts: ['35°','70°','75°','150°','160°'],
      ans: 'A',
      exp: '∠ = ½ × (110° − 40°) = ½ × 70° = <strong>35°</strong>.'
    },
    {
      n: 7, topic: 'Panjang Busur',
      q: 'Sebuah lingkaran memiliki jari-jari 21 cm. Panjang busur di hadapan sudut pusat 120° adalah...',
      opts: ['22 cm','44 cm','66 cm','88 cm','132 cm'],
      ans: 'B',
      exp: 'Busur = (120/360) × 2 × 22/7 × 21 = (1/3) × 132 = <strong>44 cm</strong>.'
    },
    {
      n: 8, topic: 'Luas Juring',
      q: 'Luas juring dengan sudut pusat 90° adalah 154 cm². Jari-jari lingkaran tersebut adalah...',
      opts: ['7 cm','14 cm','21 cm','28 cm','35 cm'],
      ans: 'B',
      exp: '154 = (90/360) × 22/7 × r² → 154 = ¼ × 22/7 × r² → r² = 196 → r = <strong>14 cm</strong>.'
    },
    {
      n: 9, topic: 'Tali Busur',
      q: 'Juring memiliki sudut pusat 60° dan jari-jari 12 cm. Dengan sin(30°) = 0,5, panjang tali busur adalah...',
      opts: ['6 cm','6√3 cm','12 cm','12√2 cm','24 cm'],
      ans: 'C',
      exp: 'Tali Busur = 2 × r × sin(α/2) = 2 × 12 × sin(30°) = 2 × 12 × 0,5 = <strong>12 cm</strong>.'
    },
    {
      n: 10, topic: 'GSPL',
      q: 'Dua lingkaran berpusat M dan N, jarak pusat 26 cm. R = 15 cm, r = 5 cm. Berapakah panjang GSPL?',
      opts: ['20 cm','24 cm','25 cm','28 cm','30 cm'],
      ans: 'B',
      exp: 'GSPL = √(j² − (R−r)²) = √(676 − 100) = √576 = <strong>24 cm</strong>.'
    },
    {
      n: 11, topic: 'GSPD',
      q: 'Jarak pusat = 25 cm, GSPD = 20 cm. Jika salah satu jari-jari = 11 cm, jari-jari lingkaran yang lain adalah...',
      opts: ['3 cm','4 cm','5 cm','6 cm','9 cm'],
      ans: 'B',
      exp: '20 = √(25² − (11+r)²) → 400 = 625 − (11+r)² → (11+r)² = 225 → 11+r = 15 → r = <strong>4 cm</strong>.'
    },
    {
      n: 12, topic: 'GSPL',
      q: 'GSPL = 12 cm, jari-jari masing-masing 7 cm dan 2 cm. Jarak antar pusat adalah...',
      opts: ['13 cm','15 cm','17 cm','20 cm','25 cm'],
      ans: 'A',
      exp: 'j = √(GSPL² + (R−r)²) = √(144 + 25) = √169 = <strong>13 cm</strong>.'
    },
    {
      n: 13, topic: 'Luas Juring',
      q: 'Lingkaran berdiameter 42 cm. Sudut pusat 45°. Luas juring tersebut adalah...',
      opts: ['173,25 cm²','346,5 cm²','693 cm²','1.386 cm²','2.772 cm²'],
      ans: 'A',
      exp: 'r = 21 cm. Luas Juring = (45/360) × 22/7 × 21² = (1/8) × 1.386 = <strong>173,25 cm²</strong>.'
    },
    {
      n: 14, topic: 'GSPD',
      q: 'GSPD = 15 cm, jarak pusat = 17 cm. Rasio R : r = 3 : 1. Berapakah jari-jari lingkaran kecil?',
      opts: ['2 cm','4 cm','6 cm','8 cm','10 cm'],
      ans: 'A',
      exp: '15 = √(17² − (R+r)²) → (R+r)² = 289−225 = 64 → R+r = 8. Karena R:r = 3:1, maka 4r = 8 → r = <strong>2 cm</strong>.'
    },
    {
      n: 15, topic: 'Panjang Busur',
      q: 'Panjang busur suatu lingkaran adalah 22 cm. Sudut pusatnya 45°. Keliling total lingkaran tersebut adalah...',
      opts: ['44 cm','88 cm','110 cm','154 cm','176 cm'],
      ans: 'E',
      exp: '45/360 × K = 22 → (1/8) × K = 22 → K = 22 × 8 = <strong>176 cm</strong>.'
    },

    // ── CERITA 16-20 ──
    {
      n: 16, topic: 'IoT Ring Topology',
      q: 'Jaringan IoT Token Ring dengan 12 node, radius 14 meter. Berapa panjang kabel serat optik minimal untuk menghubungkan semua node searah keliling?',
      opts: ['44 meter','88 meter','154 meter','616 meter','1.232 meter'],
      ans: 'B',
      exp: 'K = 2 × 22/7 × 14 = <strong>88 meter</strong>. Gunakan π = 22/7 karena r = 14 kelipatan 7.'
    },
    {
      n: 17, topic: 'UI/UX Pie Chart',
      q: 'Pie Chart diameter 280 px. Kategori "User Aktif" = 30%. Luas area juring kategori tersebut adalah...',
      opts: ['6.160 px²','12.320 px²','18.480 px²','24.640 px²','61.600 px²'],
      ans: 'C',
      exp: 'r = 140 px. Luas total = 22/7 × 140² = 61.600. 30% × 61.600 = <strong>18.480 px²</strong>.'
    },
    {
      n: 18, topic: 'GIS / BTS Coverage',
      q: 'Dua menara BTS 5G: R = 12 km, r = 3 km, jarak = 15 km. Panjang GSPL untuk jalur fiber optik luar adalah...',
      opts: ['9 km','12 km','3√21 km','14 km','12√2 km'],
      ans: 'B',
      exp: 'GSPL = √(15² − (12−3)²) = √(225 − 81) = √144 = <strong>12 km</strong>.'
    },
    {
      n: 19, topic: 'Game Dev / Radar',
      q: 'Radar minimap jari-jari 10 cm. Area deteksi musuh = juring sudut 72° (π = 3,14). Luas area juring tersebut adalah...',
      opts: ['12,56 cm²','31,4 cm²','62,8 cm²','78,5 cm²','314 cm²'],
      ans: 'C',
      exp: 'Luas Juring = (72/360) × 3,14 × 100 = 0,2 × 314 = <strong>62,8 cm²</strong>.'
    },
    {
      n: 20, topic: 'Kriptografi',
      q: 'Dua roda gigi enkripsi: pusat berjarak 20 cm, R = 7 cm, r = 5 cm. Panjang GSPD (rantai penggerak dalam) adalah...',
      opts: ['12 cm','16 cm','√351 cm','24 cm','25 cm'],
      ans: 'B',
      exp: 'GSPD = √(20² − (7+5)²) = √(400 − 144) = √256 = <strong>16 cm</strong>.'
    }
  ];

  function buildQuiz() {
    const gridReg   = document.getElementById('quiz-grid');
    const gridStory = document.getElementById('quiz-grid-story');
    if (!gridReg || !gridStory) return;

    const reguler = QUESTIONS.slice(0, 15);
    const cerita  = QUESTIONS.slice(15, 20);

    [{ questions: reguler, grid: gridReg }, { questions: cerita, grid: gridStory }].forEach(({ questions, grid }) => {
      questions.forEach(q => {
        const card = document.createElement('div');
        card.className = 'quiz-card reveal';
        card.dataset.answered = 'false';

        const labels = ['A','B','C','D','E'];
        const optsHTML = q.opts.map((opt, i) => `
          <button class="qc-opt" data-label="${labels[i]}" data-q="${q.n}">
            <span class="qc-opt-label">${labels[i]}</span>
            <span>${opt}</span>
          </button>
        `).join('');

        card.innerHTML = `
          <div class="qc-header">
            <span class="qc-num">No. ${q.n}</span>
            <span class="qc-topic">${q.topic}</span>
            <span class="qc-q">${q.q}</span>
          </div>
          <div class="qc-options">${optsHTML}</div>
          <div class="qc-explanation" id="exp-${q.n}">📐 ${q.exp}</div>
        `;

        card.querySelectorAll('.qc-opt').forEach(btn => {
          btn.addEventListener('click', function () {
            if (card.dataset.answered === 'true') return;
            card.dataset.answered = 'true';

            const chosen = this.dataset.label;
            const correct = q.ans;

            card.querySelectorAll('.qc-opt').forEach(b => {
              b.classList.add('disabled');
              if (b.dataset.label === correct) b.classList.add('correct');
              else if (b.dataset.label === chosen) b.classList.add('wrong');
            });

            const expEl = document.getElementById('exp-' + q.n);
            if (expEl) expEl.classList.add('show');
          });
        });

        grid.appendChild(card);
      });
    });

    // re-observe new reveal elements
    document.querySelectorAll('.quiz-card.reveal:not(.visible)').forEach(el => revObs.observe(el));
  }

  // We need revObs in scope — rebuild after quiz renders
  const revObsQuiz = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revObsQuiz.unobserve(e.target); } });
  }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });

  buildQuiz();
  document.querySelectorAll('.quiz-card.reveal').forEach(el => revObsQuiz.observe(el));

})();