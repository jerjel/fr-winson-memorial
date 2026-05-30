// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
  });

  // Set current year in footer
  document.getElementById('currentYear').textContent = new Date().getFullYear();

  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile navigation toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  
  // Basic toggle logic for mobile (can be expanded)
  navToggle.addEventListener('click', () => {
    if (navLinks.style.display === 'flex') {
      navLinks.style.display = 'none';
    } else {
      navLinks.style.display = 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '100%';
      navLinks.style.left = '0';
      navLinks.style.width = '100%';
      navLinks.style.background = 'rgba(15, 17, 21, 0.95)';
      navLinks.style.padding = '1rem 0';
      navLinks.style.textAlign = 'center';
    }
  });

  // Initialize Particles in Hero
  createParticles();

  // Initialize Swiper Galleries
  initGalleries();

  // Initialize Candles
  initCandles();
});

/* ══════════════════════════════════════════════════════════ */
/*  PARTICLES EFFECT                                         */
/* ══════════════════════════════════════════════════════════ */
function createParticles() {
  const particlesContainer = document.getElementById('particles');
  const particleCount = 50;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Randomize properties
    const size = Math.random() * 3 + 1;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const duration = Math.random() * 10 + 5;
    const delay = Math.random() * 5;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    particle.style.position = 'absolute';
    particle.style.background = 'rgba(212, 175, 55, 0.6)';
    particle.style.borderRadius = '50%';
    particle.style.boxShadow = '0 0 10px rgba(212, 175, 55, 0.8)';
    
    // Animation
    particle.style.animation = `floatParticle ${duration}s ease-in-out ${delay}s infinite alternate`;

    particlesContainer.appendChild(particle);
  }

  // Add keyframes dynamically
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes floatParticle {
      0% { transform: translateY(0) translateX(0); opacity: 0.2; }
      50% { opacity: 0.8; }
      100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

/* ══════════════════════════════════════════════════════════ */
/*  SWIPER GALLERIES                                         */
/* ══════════════════════════════════════════════════════════ */
function initGalleries() {
  const categories = [
    { id: 'early-life', icon: '🌱', text: 'Photos from Early Life' },
    { id: 'priesthood', icon: '✝', text: 'Photos of Priesthood' },
    { id: 'ministry', icon: '🕊️', text: 'Photos of Ministry' },
    { id: 'family', icon: '❤️', text: 'Photos with Family' },
    { id: 'celebrations', icon: '🎉', text: 'Photos of Celebrations' },
    { id: 'legacy', icon: '🌅', text: 'Photos of Legacy' }
  ];

  // Swiper options
  const swiperOptions = {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    coverflowEffect: {
      rotate: 20,
      stretch: 0,
      depth: 200,
      modifier: 1,
      slideShadows: true,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    loop: false, // Set to true if enough images exist
  };

  categories.forEach(category => {
    const wrapper = document.getElementById(`slides-${category.id}`);
    
    // For now, we populate placeholders. 
    // In a real scenario, you'd fetch images from the folder dynamically
    // or hardcode the image paths here.
    for (let i = 1; i <= 3; i++) {
      const slide = document.createElement('div');
      slide.classList.add('swiper-slide');
      
      slide.innerHTML = `
        <div class="placeholder-slide">
          <span>${category.icon}</span>
          <p>${category.text}<br><small>(Image ${i})</small></p>
          <code style="font-size: 0.7rem; margin-top:1rem; opacity:0.5">images/${category.id}/img${i}.jpg</code>
        </div>
      `;
      wrapper.appendChild(slide);
    }

    // Initialize Swiper for this category
    new Swiper(`#swiper-${category.id}`, swiperOptions);
  });
}

/* ══════════════════════════════════════════════════════════ */
/*  CANDLE INTERACTION                                       */
/* ══════════════════════════════════════════════════════════ */
function initCandles() {
  const candleGrid = document.getElementById('candleGrid');
  const litCountEl = document.getElementById('litCount');
  const lightAllBtn = document.getElementById('lightAllBtn');
  
  let litCount = 0;
  const initialCandles = 5;

  // Candle HTML Template
  const candleHTML = `
    <div class="candle">
      <div class="flame-wrap">
        <div class="flame"></div>
        <div class="flame-shadow"></div>
        <div class="glow"></div>
      </div>
      <div class="wick"></div>
      <div class="candle-body">
        <div class="drip drip1"></div>
        <div class="drip drip2"></div>
      </div>
      <div class="candle-base"></div>
    </div>
  `;

  // Create initial candles
  for (let i = 0; i < initialCandles; i++) {
    createCandleElement();
  }

  function createCandleElement(isLit = false) {
    const candleItem = document.createElement('div');
    candleItem.classList.add('candle-item');
    if (isLit) {
      candleItem.classList.add('lit');
      litCount++;
      updateCount();
    }
    
    candleItem.innerHTML = candleHTML;
    
    candleItem.addEventListener('click', function() {
      if (!this.classList.contains('lit')) {
        this.classList.add('lit');
        litCount++;
        updateCount();
        
        // Add a new unlit candle to the grid to keep it going
        setTimeout(() => {
          createCandleElement(false);
        }, 500);
      }
    });

    candleGrid.appendChild(candleItem);
  }

  function updateCount() {
    litCountEl.textContent = litCount;
  }

  // Light a candle button logic
  lightAllBtn.addEventListener('click', () => {
    // Find first unlit candle and light it
    const unlitCandles = document.querySelectorAll('.candle-item:not(.lit)');
    if (unlitCandles.length > 0) {
      unlitCandles[0].click();
    } else {
      createCandleElement(true);
    }
    
    // Smooth scroll to candles
    document.getElementById('candle').scrollIntoView({ behavior: 'smooth' });
  });
}

/* ══════════════════════════════════════════════════════════ */
/*  TRIBUTE SUBMISSION (Mock)                                */
/* ══════════════════════════════════════════════════════════ */
window.submitTribute = function(event) {
  event.preventDefault();
  
  const name = document.getElementById('tributeName').value;
  const relation = document.getElementById('tributeRelation').value;
  const message = document.getElementById('tributeMessage').value;
  
  const tributesGrid = document.getElementById('tributesGrid');
  
  const newTribute = document.createElement('div');
  newTribute.classList.add('tribute-card');
  newTribute.setAttribute('data-aos', 'fade-up');
  
  let authorText = `— ${name}`;
  if (relation) {
    authorText += ` (${relation})`;
  }

  newTribute.innerHTML = `
    <div class="tribute-quote-mark">"</div>
    <p class="tribute-text">${message}</p>
    <div class="tribute-author">${authorText}</div>
  `;
  
  tributesGrid.prepend(newTribute);
  
  // Reset form
  document.getElementById('tributeForm').reset();
  
  // Show confirmation (simple alert for now)
  alert('Thank you. Your tribute has been added in his memory.');
};
