// Canvas Starfield Background
function initStarfield() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  document.body.appendChild(canvas);

  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = '-2';
  canvas.style.pointerEvents = 'none';

  let width, height;
  const stars = [];
  const numStars = Math.floor(Math.random() * 41) + 80; // 80 - 120 stars

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  function createStars() {
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.2 + 0.6, // 0.6 - 1.8px
        opacity: Math.random() * 0.45 + 0.4, // 0.4 - 0.85
        speed: Math.random() * 0.15 + 0.13 // Approx 0.28 speed
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    stars.forEach(star => {
      // Update position (drifting upwards)
      star.y -= star.speed;
      if (star.y < -10) {
        star.y = height + 10;
        star.x = Math.random() * width;
      }

      // Draw star
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size / 2, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  resize();
  createStars();
  animate();
}

// Initialize starfield immediately
initStarfield();

// Loading screen
window.addEventListener('load', () => {
  setTimeout(() => {
    const loading = document.getElementById('loading');
    if (loading) loading.classList.add('hidden');
  }, 1000);
});

// Intersection Observer for animations

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      Array.from(entry.target.children).forEach((child, index) => {
        child.style.opacity = '1';
        child.style.transform = 'translateY(0)';
        const delay = Math.min(index * 60, 300);
        child.style.transition = `all 0.8s cubic - bezier(0.16, 1, 0.3, 1) ${delay} ms`;
      });
    }
  });
}, observerOptions);

document.querySelectorAll('.section').forEach(section => {
  section.style.opacity = '1';
  section.style.transform = 'translateY(0)';
  section.style.transition = 'none';

  Array.from(section.children).forEach(child => {
    child.style.opacity = '0';
    child.style.transform = 'translateY(20px)';
  });

  observer.observe(section);
});

// Header scroll effect
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  if (header) {
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
});

// Smooth scrolling for navigation
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    if (this.getAttribute('href') === '#') return;
    e.preventDefault();
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});


// Hero scroll effect (subtle opacity and transform via requestAnimationFrame)
const heroSection = document.querySelector('.hero, .page-header');
if (heroSection) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        // Fade to max 0.9
        let opacity = 1 - (scrollY / window.innerHeight) * 0.3;
        opacity = Math.max(0.9, opacity);

        // Move upward max 8px
        let translateY = -(scrollY / window.innerHeight) * 20;
        translateY = Math.max(-8, translateY);

        heroSection.style.opacity = opacity;
        heroSection.style.transform = `translateY(${translateY}px)`;

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// 3D card tilt effect restored with precise constraints
const tiltSelector = '.card, .team-member, .value-item, .service-card, .process-step, .portfolio-item, .stat-item, .contact-form, .contact-info, .map-section';
document.querySelectorAll(tiltSelector).forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    let divX = 40, divY = 40, transZ = 3;

    const rotateX = (y - centerY) / divX;
    const rotateY = (centerX - x) / divY;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${transZ}px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
  });
});

// Form handling (contact)
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    alert("Thank you for your message! We'll get back to you soon.");
    this.reset();
  });
}

