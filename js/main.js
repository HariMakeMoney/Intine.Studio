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
// initStarfield();
// Reduced visual noise: Starfield animation disabled to prioritize clarity and premium feel.

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

// Header scroll effect and mobile menu
const header = document.getElementById('header');
if (header) {
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Add scrolled class for background styling
    if (currentScrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Hide on scroll down, show on scroll up
    if (currentScrollY > lastScrollY && currentScrollY > 200) {
      // Scrolling down
      header.classList.add('nav-hidden');
    } else {
      // Scrolling up
      header.classList.remove('nav-hidden');
    }
    
    lastScrollY = currentScrollY;
  }, { passive: true });

  // Mobile menu setup
  const menuBtn = document.createElement('div');
  menuBtn.className = 'mobile-menu-btn';
  menuBtn.innerHTML = '<span></span><span></span>';
  header.appendChild(menuBtn);

  const nav = header.querySelector('nav');
  
  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  });

  // Close menu when clicking a link
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('active');
      nav.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });
}

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
const heroSection = document.querySelector('.hero, .page-header, .legal-hero');
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

// Form handling (contact) — FormSubmit
const form = document.getElementById('contactForm');
if (form) {
  const submitBtn = document.getElementById('contactSubmitBtn');
  const statusEl = document.getElementById('formStatus');
  const defaultBtnText = submitBtn ? submitBtn.textContent.trim() : 'Send Inquiry';
  const thankYouUrl = 'https://www.intine.co.in/thank-you';
  const formsubmitAjax = 'https://formsubmit.co/ajax/askintine@gmail.com';

  const showStatus = (message, type) => {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.className = `contact-form-status is-visible is-${type}`;
    statusEl.hidden = false;
  };

  const clearStatus = () => {
    if (!statusEl) return;
    statusEl.textContent = '';
    statusEl.className = 'contact-form-status';
    statusEl.hidden = true;
  };

  const setFieldInvalid = (field, invalid) => {
    const wrapper = field.closest('.contact-form-field');
    if (wrapper) wrapper.classList.toggle('is-invalid', invalid);
    field.setAttribute('aria-invalid', invalid ? 'true' : 'false');
  };

  const validateForm = () => {
    clearStatus();
    let valid = true;
    const fields = form.querySelectorAll('#contact-name, #contact-email, #contact-message');

    fields.forEach((field) => {
      setFieldInvalid(field, false);
      const value = field.value.trim();

      if (!value) {
        setFieldInvalid(field, true);
        valid = false;
        return;
      }

      if (field.type === 'email' && !field.checkValidity()) {
        setFieldInvalid(field, true);
        valid = false;
      }
    });

    if (!valid) {
      showStatus('Please fill in all required fields with a valid email address.', 'error');
      const firstInvalid = form.querySelector('.contact-form-field.is-invalid input, .contact-form-field.is-invalid textarea');
      if (firstInvalid) firstInvalid.focus();
    }

    return valid;
  };

  const setSubmitting = (isSubmitting) => {
    form.classList.toggle('is-submitting', isSubmitting);
    if (submitBtn) {
      submitBtn.disabled = isSubmitting;
      submitBtn.setAttribute('aria-busy', isSubmitting ? 'true' : 'false');
      submitBtn.textContent = isSubmitting ? 'Sending...' : defaultBtnText;
    }
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const honey = form.querySelector('input[name="_honey"]');
    if (honey && honey.value.trim()) return;

    if (!validateForm()) return;

    setSubmitting(true);
    clearStatus();

    const formData = new FormData(form);

    try {
      const response = await fetch(formsubmitAjax, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      form.classList.add('is-success');
      showStatus("Thank you! Your message has been sent. We'll be in touch soon.", 'success');
      form.reset();

      window.setTimeout(() => {
        window.location.href = thankYouUrl;
      }, 2200);
    } catch {
      showStatus('Something went wrong. Please try again or email us at askintine@gmail.com.', 'error');
      setSubmitting(false);
    }
  });

  form.querySelectorAll('#contact-name, #contact-email, #contact-message').forEach((field) => {
    field.addEventListener('input', () => {
      if (field.value.trim()) setFieldInvalid(field, false);
    });
  });
}

// Scroll progress bar
const scrollProgress = document.getElementById('scrollProgress');
if (scrollProgress) {
  const updateScrollProgress = () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    scrollProgress.style.width = `${progress}%`;
  };
  updateScrollProgress();
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  window.addEventListener('resize', updateScrollProgress, { passive: true });
}

// Legal page fade-in animations
const legalFadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        legalFadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.legal-fade').forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index * 80, 400)}ms`;
  legalFadeObserver.observe(el);
});

// BorderGlow Interaction Logic
document.querySelectorAll('.border-glow').forEach(el => {
  el.addEventListener('mousemove', e => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--mouse-x', `${x}px`);
    el.style.setProperty('--mouse-y', `${y}px`);
  });
});
