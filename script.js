document.addEventListener("DOMContentLoaded", () => {

  const canvas = document.getElementById("cosmos-engine");
  if (!canvas) return console.warn("Canvas not found");
  const ctx = canvas.getContext("2d");
  let width, height, scrollY = 0;

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("scroll", () => {
    scrollY = window.pageYOffset;
    // side vignette fades in once user scrolls
    if (scrollY > 40) document.body.classList.add("scrolled");
    else document.body.classList.remove("scrolled");
  });
  resizeCanvas();


  /* ===================== SCIENTIFIC STAR COLORS ===================== */
  const SPECTRAL_CLASSES = [
    { color: "#9bb0ff", weight: 5 },  // O-type (Blue, very rare)
    { color: "#aabfff", weight: 5 },  // B-type (Blue-white)
    { color: "#cad7ff", weight: 10 }, // A-type (White)
    { color: "#f8f7ff", weight: 15 }, // F-type (Yellow-white)
    { color: "#fff4ea", weight: 20 }, // G-type (Yellow, like Sun)
    { color: "#ffd2a1", weight: 30 }, // K-type (Orange)
    { color: "#ffcc6f", weight: 31 }  // M-type (Red, most common)
  ];

  function getStarColor() {
    const totalWeight = SPECTRAL_CLASSES.reduce((acc, type) => acc + type.weight, 0);
    let random = Math.random() * totalWeight;
    for (let type of SPECTRAL_CLASSES) {
      if (random < type.weight) return type.color;
      random -= type.weight;
    }
    return "#ffffff";
  }

  /* ===================== STARS ===================== */
  const STAR_COUNT = 700;

  /* — hex colour helpers for tinted twinkle (5) — */
  function hexToRgb(hex) {
    return {
      r: parseInt(hex.slice(1,3), 16),
      g: parseInt(hex.slice(3,5), 16),
      b: parseInt(hex.slice(5,7), 16)
    };
  }
  function lerpColor(hex, tr, tg, tb, t) {
    const { r, g, b } = hexToRgb(hex);
    return `rgb(${Math.round(r+(tr-r)*t)},${Math.round(g+(tg-g)*t)},${Math.round(b+(tb-b)*t)})`;
  }

  class Star {
    constructor(speedMultiplier) {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 1.2 + 0.2;
      this.baseColor = getStarColor();
      this.speed = speedMultiplier;
      this.opacity = Math.random();
      this.twinkleSpeed = Math.random() * 0.008 + 0.004;
      // 5. each star shifts toward warm or cool at peak brightness
      this.tintTarget = Math.random() < 0.5
        ? { r: 255, g: 240, b: 200 }  // warm
        : { r: 200, g: 220, b: 255 }; // cool
      // 6. ~1.5% of larger stars can flare
      this.isVariable = this.radius > 0.9 && Math.random() < 0.015;
      this.flaring = false;
      this.flareOpacity = 0;
      this.flareRadius = 0;
    }
    update() {
      this.opacity += this.twinkleSpeed;
      if (this.opacity > 1 || this.opacity < 0.2) this.twinkleSpeed *= -1;
      this.renderY = (this.y + scrollY * this.speed) % height;
      if (this.renderY < 0) this.renderY += height;
      // 6. flare decay
      if (this.flaring) {
        this.flareOpacity -= 0.012;
        this.flareRadius  += 0.18;
        if (this.flareOpacity <= 0) {
          this.flaring = false;
          this.flareOpacity = 0;
          this.flareRadius  = 0;
        }
      }
    }
    draw() {
      // 5. tinted twinkle — colour shifts above 60% opacity
      const tintT = Math.max(0, this.opacity - 0.6) / 0.4;
      const drawColor = tintT > 0
        ? lerpColor(this.baseColor, this.tintTarget.r, this.tintTarget.g, this.tintTarget.b, tintT * 0.35)
        : this.baseColor;

      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = drawColor;
      ctx.beginPath();
      ctx.arc(this.x, this.renderY, this.radius, 0, Math.PI * 2);
      ctx.fill();

      // glow halo for larger stars
      if (this.radius > 0.9) {
        const glowRadius = this.radius * 5;
        const glow = ctx.createRadialGradient(this.x, this.renderY, 0, this.x, this.renderY, glowRadius);
        glow.addColorStop(0, this.baseColor + "33");
        glow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.globalAlpha = this.opacity * 0.35;
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(this.x, this.renderY, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 6. flare ring
      if (this.flaring && this.flareOpacity > 0) {
        const flare = ctx.createRadialGradient(this.x, this.renderY, 0, this.x, this.renderY, this.flareRadius);
        flare.addColorStop(0,   `rgba(255,248,220,${this.flareOpacity})`);
        flare.addColorStop(0.4, `rgba(255,220,150,${this.flareOpacity * 0.5})`);
        flare.addColorStop(1,   "rgba(0,0,0,0)");
        ctx.globalAlpha = 1;
        ctx.fillStyle = flare;
        ctx.beginPath();
        ctx.arc(this.x, this.renderY, this.flareRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    triggerFlare() {
      this.flaring      = true;
      this.flareOpacity = 0.75;
      this.flareRadius  = this.radius * 2;
    }
  }

  /* ===================== 2. GIANT STAR CLUSTERS ===================== */
  const GIANT_COUNT = 10;
  class GiantStar {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 1.8 + 2.5; // 2.5–4.3px
      this.baseColor = getStarColor();
      this.opacity = Math.random() * 0.4 + 0.6;
      this.twinkleSpeed = Math.random() * 0.005 + 0.002;
    }
    update() {
      this.opacity += this.twinkleSpeed;
      if (this.opacity > 1 || this.opacity < 0.5) this.twinkleSpeed *= -1;
      this.renderY = (this.y + scrollY * 0.05) % height;
      if (this.renderY < 0) this.renderY += height;
    }
    draw() {
      // inner bright core
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(this.x, this.renderY, this.radius * 0.4, 0, Math.PI * 2);
      ctx.fill();
      // mid glow
      const mid = ctx.createRadialGradient(this.x, this.renderY, 0, this.x, this.renderY, this.radius * 2);
      mid.addColorStop(0, this.baseColor + "cc");
      mid.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalAlpha = this.opacity * 0.8;
      ctx.fillStyle = mid;
      ctx.beginPath();
      ctx.arc(this.x, this.renderY, this.radius * 2, 0, Math.PI * 2);
      ctx.fill();
      // wide soft halo
      const halo = ctx.createRadialGradient(this.x, this.renderY, 0, this.x, this.renderY, this.radius * 8);
      halo.addColorStop(0, this.baseColor + "44");
      halo.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalAlpha = this.opacity * 0.35;
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(this.x, this.renderY, this.radius * 8, 0, Math.PI * 2);
      ctx.fill();
    }
  }



  /* ===================== PARALLAX LAYERS ===================== */
  const slowStars = Array.from({ length: STAR_COUNT }, () => new Star(0.05));
  const fastStars = Array.from({ length: STAR_COUNT / 3 }, () => new Star(0.15));
  const giantStars = Array.from({ length: GIANT_COUNT }, () => new GiantStar());
  const variableStars = [...slowStars, ...fastStars].filter(s => s.isVariable);

  /* 6. fire a random variable-star flare every 12–18 s */
  function scheduleFlare() {
    setTimeout(() => {
      if (variableStars.length) {
        variableStars[Math.floor(Math.random() * variableStars.length)].triggerFlare();
      }
      scheduleFlare();
    }, 12000 + Math.random() * 6000);
  }
  scheduleFlare();

  /* ===================== ANIMATION LOOP ===================== */
  function animate() {
    ctx.clearRect(0, 0, width, height);
    slowStars.forEach(s => s.update());
    fastStars.forEach(s => s.update());
    giantStars.forEach(s => s.update());
    slowStars.forEach(s => s.draw());
    fastStars.forEach(s => s.draw());
    giantStars.forEach(s => s.draw());
    requestAnimationFrame(animate);
  }
  animate();

  /* ===================== SECTION SCROLL ANIMATION ===================== */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("active");
    });
  }, { threshold: 0.1 });
  document.querySelectorAll("section").forEach(sec => observer.observe(sec));
});

/* ==========================================================================
   STUDY NOTES — search & filter (runs only on studynotes.html)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('noteSearch');
  const noteCards = document.querySelectorAll('.resource-card');
  const noResults = document.getElementById('noResults');
  const filterButtons = document.querySelectorAll('.filter-btn');

  if (!searchInput) return;

  const filterNotes = () => {
    const query = searchInput.value.toLowerCase();
    const activeFilter = document.querySelector('.filter-btn.active').textContent.toLowerCase();
    let visibleCount = 0;

    noteCards.forEach(card => {
      const title = card.querySelector('h4').textContent.toLowerCase();
      const description = card.querySelector('p').textContent.toLowerCase();
      const sectionHeader = card.closest('.notes-category-section').querySelector('h3').textContent.toLowerCase();

      const matchesSearch = title.includes(query) || description.includes(query);
      const matchesCategory = activeFilter === 'all notes' || sectionHeader.includes(activeFilter);

      if (matchesSearch && matchesCategory) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (visibleCount === 0 && query !== "") {
      noResults.style.display = 'block';
    } else {
      noResults.style.display = 'none';
    }
  };

  searchInput.addEventListener('input', filterNotes);

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterNotes();
    });
  });
});

/* ==========================================================================
   HAMBURGER MENU — mobile nav
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function () {
  var toggle  = document.getElementById('nav-toggle');
  var navList = document.getElementById('nav-list');
  var overlay = document.getElementById('nav-overlay');
  if (!toggle || !navList || !overlay) return;

  function openMenu() {
    navList.classList.add('open');
    overlay.classList.add('open');
    toggle.classList.add('open');
  }

  function closeMenu() {
    navList.classList.remove('open');
    overlay.classList.remove('open');
    toggle.classList.remove('open');
  }

  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    navList.classList.contains('open') ? closeMenu() : openMenu();
  });

  overlay.addEventListener('mousedown', closeMenu);
  overlay.addEventListener('touchstart', function (e) {
    var touch = e.touches[0];
    var navRect = navList.getBoundingClientRect();
    var insideNav = (
      touch.clientX >= navRect.left &&
      touch.clientX <= navRect.right &&
      touch.clientY >= navRect.top  &&
      touch.clientY <= navRect.bottom
    );
    if (!insideNav) closeMenu();
  }, { passive: true });
});

/* ==========================================================================
   LUMIN DIARIES — carousel (runs only on index.html where #ld-box exists)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function () {
  var ldBox = document.getElementById('ld-box');
  if (!ldBox) return; // only index.html

  var TOTAL = 5;
  var cur = 0;
  var timer;

  var slides = document.querySelectorAll('.ld-slide');
  var dots   = document.querySelectorAll('.ldd');
  var pf     = document.getElementById('ld-pf');

  function ldGo(n) {
    slides[cur].classList.remove('active');
    dots[cur].classList.remove('on');
    dots[cur].style.width = '4px';

    cur = (n + TOTAL) % TOTAL;

    slides[cur].classList.add('active');
    dots[cur].classList.add('on');
    dots[cur].style.width = '22px';

    if (pf) pf.style.width = ((cur + 1) / TOTAL * 100) + '%';
  }

  // Expose globally so onclick="ldGo(n)" in HTML still works
  window.ldGo = ldGo;

  document.getElementById('ld-prev').addEventListener('click', function () {
    ldGo(cur - 1);
    resetTimer();
  });
  document.getElementById('ld-next').addEventListener('click', function () {
    ldGo(cur + 1);
    resetTimer();
  });

  function autoPlay() { ldGo(cur + 1); }
  function resetTimer() { clearInterval(timer); timer = setInterval(autoPlay, 5000); }

  if (pf) pf.style.width = (1 / TOTAL * 100) + '%';
  timer = setInterval(autoPlay, 5000);
});