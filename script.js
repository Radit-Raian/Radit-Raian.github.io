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
  window.addEventListener("scroll", () => scrollY = window.pageYOffset);
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

  class Star {
    constructor(speedMultiplier) {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 1.2 + 0.2;
      this.color = getStarColor();
      this.speed = speedMultiplier;
      this.opacity = Math.random();
      this.twinkleSpeed = Math.random() * 0.008 + 0.004;
    }
    update() {
      this.opacity += this.twinkleSpeed;
      if (this.opacity > 1 || this.opacity < 0.2) this.twinkleSpeed *= -1;
      this.renderY = (this.y + scrollY * this.speed) % height;
      if (this.renderY < 0) this.renderY += height;
    }
    draw() {
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.renderY, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  class Meteor {
    constructor() { this.active = false; }
    spawn() {
      this.active = true;
      this.x = Math.random() * width;
      this.y = Math.random() * height * 0.3;
      this.vx = -(Math.random() * 8 + 12);
      this.vy = Math.random() * 6 + 8;
      this.length = Math.random() * 25 + 20;
      this.opacity = 1;
    }
    update() {
      if (!this.active) return;
      this.x += this.vx; this.y += this.vy; this.opacity -= 0.015;
      if (this.opacity <= 0) this.active = false;
    }
    draw() {
      if (!this.active) return;
      ctx.globalAlpha = this.opacity;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + this.length, this.y - this.length * 0.5);
      ctx.stroke();
    }
  }

  function drawNebula() {
    const nebula = ctx.createRadialGradient(width * 0.7, height * 0.3, 0, width * 0.7, height * 0.3, width);
    nebula.addColorStop(0, "rgba(96, 165, 250, 0.1)");
    nebula.addColorStop(0.5, "rgba(30,64,175,0.1)");
    nebula.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = nebula;
    ctx.fillRect(0, 0, width, height);
  }

  /* ===================== PARALLAX LAYERS ===================== */
  const slowStars = Array.from({ length: STAR_COUNT }, () => new Star(0.05));
  const fastStars = Array.from({ length: STAR_COUNT / 3 }, () => new Star(0.15));
  const meteor = new Meteor();

  setInterval(() => { if (!meteor.active) meteor.spawn(); }, 8000);

  /* ===================== ANIMATION LOOP ===================== */
  function animate() {
    ctx.clearRect(0, 0, width, height);
    drawNebula();
    slowStars.forEach(s => { s.update(); s.draw(); });
    fastStars.forEach(s => { s.update(); s.draw(); });
    meteor.update(); meteor.draw();
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
