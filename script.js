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
  // Colors mapped to Spectral Types: O (Blue) -> M (Red)
  const SPECTRAL_CLASSES = [
    { color: "#9bb0ff", weight: 5 },  // O-type (Blue, very rare)
    { color: "#aabfff", weight: 5 },  // B-type (Blue-white)
    { color: "#cad7ff", weight: 10 },  // A-type (White)
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
      
      // Assign color based on temperature probability
      this.color = getStarColor();
      
      this.speed = speedMultiplier;
      this.opacity = Math.random();
      this.twinkleSpeed = Math.random() * 0.008 + 0.004;
    }
    update() {
      this.opacity += this.twinkleSpeed;
      if(this.opacity > 1 || this.opacity < 0.2) this.twinkleSpeed *= -1;
      this.renderY = (this.y + scrollY * this.speed) % height;
      if(this.renderY < 0) this.renderY += height;
    }
    draw() {
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.renderY, this.radius, 0, Math.PI*2);
      ctx.fill();
    }
  }
  class Meteor {
    constructor(){ this.active=false; }
    spawn(){
      this.active=true;
      this.x = Math.random()*width;
      this.y = Math.random()*height*0.3;
      this.vx = -(Math.random()*8+12);
      this.vy = Math.random()*6+8;
      this.length = Math.random()*25+20;
      this.opacity = 1;
    }
    update() {
      if(!this.active) return;
      this.x+=this.vx; this.y+=this.vy; this.opacity-=0.015;
      if(this.opacity<=0) this.active=false;
    }
    draw() {
      if(!this.active) return;
      ctx.globalAlpha = this.opacity;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(this.x,this.y);
      ctx.lineTo(this.x+this.length,this.y-this.length*0.5);
      ctx.stroke();
    }
  }
  function drawNebula() {
    const nebula = ctx.createRadialGradient(width*0.7,height*0.3,0,width*0.7,height*0.3,width);
    nebula.addColorStop(0,"rgba(96, 165, 250, 0.1)");
    nebula.addColorStop(0.5,"rgba(30,64,175,0.1)");
    nebula.addColorStop(1,"rgba(0,0,0,0)");
    ctx.fillStyle = nebula;
    ctx.fillRect(0,0,width,height);
  }

  /* ===================== PARALLAX LAYERS ===================== */
  const slowStars = Array.from({length: STAR_COUNT},()=>new Star(0.05));
  const fastStars = Array.from({length: STAR_COUNT/3},()=>new Star(0.15));
  const meteor = new Meteor();

  setInterval(()=>{ if(!meteor.active) meteor.spawn(); }, 8000);

  /* ===================== ANIMATION LOOP ===================== */
  function animate(){
    // CRITICAL FIX: Use clearRect to keep background visible
    ctx.clearRect(0, 0, width, height); 

    drawNebula();
    slowStars.forEach(s=>{s.update();s.draw();});
    fastStars.forEach(s=>{s.update();s.draw();});
    meteor.update(); meteor.draw();

    requestAnimationFrame(animate);
  }
  animate();

  /* ===================== SECTION SCROLL ANIMATION ===================== */
  const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting) entry.target.classList.add("active");
    });
  }, {threshold:0.1});
  document.querySelectorAll("section").forEach(sec=>observer.observe(sec));
});

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('noteSearch');
    const noteCards = document.querySelectorAll('.resource-card');
    const noResults = document.getElementById('noResults');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // --- Unified Filter Logic Function ---
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

        // Show/Hide "No Results" message
        if (visibleCount === 0 && query !== "") {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
        }
    };

    // --- Search Input Listener ---
    if (searchInput) {
        searchInput.addEventListener('input', filterNotes);
    }

    // --- Category Button Listener ---
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterNotes(); // Re-run filter with new active category
        });
    });
});