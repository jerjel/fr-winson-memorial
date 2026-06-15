// ═══════════════════════════════════════════════════════════════
//  main.js  —  Firebase-powered Memorial Site
//  Uses ES Modules (type="module" on the script tag in index.html)
// ═══════════════════════════════════════════════════════════════

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore, doc, getDoc, setDoc,
  updateDoc, increment, collection,
  addDoc, onSnapshot, orderBy,
  query, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ── Firebase Configuration ───────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyDnlwcSEmMIG0dR44mJ0QdEuVkA5621TQ8",
  authDomain: "frwinson-memorial.firebaseapp.com",
  projectId: "frwinson-memorial",
  storageBucket: "frwinson-memorial.firebasestorage.app",
  messagingSenderId: "912022141411",
  appId: "1:912022141411:web:bb983d965610ef07a248d6",
  measurementId: "G-RRCNN2KTEJ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ── Firestore Document References ────────────────────────────
const statsDocRef = doc(db, "memorial", "stats");
const tributesColRef = collection(db, "tributes");

// ═══════════════════════════════════════════════════════════════
//  BOOTSTRAP — runs after DOM is ready
// ═══════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {

  // Utilities
  document.getElementById('currentYear').textContent = new Date().getFullYear();
  initNavbar();
  createParticles();

  // AOS
  AOS.init({ duration: 1000, once: true, offset: 100 });

  // Core features
  initGalleries();   // Load real photos into Swiper carousels
  initVideos();      // Load YouTube video thumbnails
  initCandles();     // Firebase-backed candle counter
  initTributes();    // Firebase real-time tribute feed
});


// ═══════════════════════════════════════════════════════════════
//  NAVBAR
// ═══════════════════════════════════════════════════════════════
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  navToggle.addEventListener('click', () => {
    const open = navLinks.style.display === 'flex';
    navLinks.style.display = open ? '' : 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '100%';
    navLinks.style.left = '0';
    navLinks.style.width = '100%';
    navLinks.style.background = 'rgba(15,17,21,0.97)';
    navLinks.style.padding = '1rem 0';
    navLinks.style.textAlign = 'center';
    if (open) navLinks.removeAttribute('style');
  });
}


// ═══════════════════════════════════════════════════════════════
//  HERO PARTICLES
// ═══════════════════════════════════════════════════════════════
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes floatParticle {
      0%   { transform: translateY(0) translateX(0); opacity: 0.2; }
      50%  { opacity: 0.8; }
      100% { transform: translateY(-120px) translateX(20px); opacity: 0; }
    }`;
  document.head.appendChild(style);

  for (let i = 0; i < 50; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 3 + 1;
    Object.assign(p.style, {
      position: 'absolute',
      width: `${size}px`,
      height: `${size}px`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      background: 'rgba(212,175,55,0.6)',
      borderRadius: '50%',
      boxShadow: '0 0 10px rgba(212,175,55,0.8)',
      animation: `floatParticle ${Math.random() * 10 + 5}s ease-in-out ${Math.random() * 5}s infinite alternate`,
    });
    container.appendChild(p);
  }
}


// ═══════════════════════════════════════════════════════════════
//  GALLERY — Loads real local photos
// ═══════════════════════════════════════════════════════════════

// ── Add your actual file names here as you upload photos ──────
const PHOTO_MAP = {
  'early-life': ['img1.jpg', 'img10.jpg', 'img11.jpg', 'img12.jpg', 'img13.jpg', 'img14.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg', 'img6.jpg', 'img7.jpg', 'img8.jpg', 'img9.jpg'],
  'ministry': ['001deepti.jpg', '01IMG_20170706_112347.jpg', '03vellippanachan_in_us.jpg', '04vellippanachan_with_his_car_at_US.jpg', '05vellippanachan_with_pastor.jpg', '07001Gemini_.png', '08Gemini_.png', '1-2.jpg', 'DSC_0318.JPG', 'IMG_0784.JPG', 'IMG_2580.jpg', 'IMG_6966_3_11zon.jpg', 'food-1.png', 'g8.jpg', 'holymass.jpg', 'lucyCamera 842.jpg', 'pare-1.png'],
  'celebrations': ['001vellippanachan_on_jubilee.jpg', '01WhatsApp1.JPG', '02with_vellippanachan.jpg', '03vellippanachan_jubilee.jpg', '04WSM_0380 copy.JPG', '04WhatsApp3.jpeg', '05.jpeg', '15AP5A6463.JPG', 'AP5A6450.JPG', 'WhatsApp2.jpeg', 'zzIMG_0100.jpg', 'zz02vellippanachan_at_US (1).jpg', 'zz03vellippanachan_at_US (2).jpg', 'zz04vellippanachan_at_US (3).jpg', 'zzDSCF0008.JPG', 'zzDSCF0019.JPG', 'zzDSC_0518.JPG', 'zzaDSCF0023.JPG'],
  'family': ['00114IMG_0142.jpg', '01IMG_20170706_120030.png', '02death_of_valliappapan.jpg', '03docu0106.jpg', '04death_of_vellianty.jpg', '05IMG_20170706_120902.jpg', '06IMG_20170706_120824.jpg', '07death_of_ammama.jpg', '09IMG_20170706_113419.jpg', '10Vellippanachan_Joel.jpg', '11Pappas_birthday_6.jpg', '12vellipanachan_bastian_christo.jpg', '13Vellippanachan_Joel_1.jpg', '16What.jpeg', '16WhatsApp.jpeg', '17Gemini.png', '18Gemini.png', 'AP5A6479.JPG', 'At _Ooty.jpg', 'DSC_0221.JPG', 'Gemini_Generated_Image_pmujq7pmujq7pmuj.png', 'IMG-20170625-WA0019.jpg', 'IMG-20170625-WA0077.jpg', 'IMG_6127.jpg'],

};

const CATEGORY_META = [
  { id: 'early-life', icon: '🌱', text: 'Early Life' },
  { id: 'priesthood', icon: '✝', text: 'Priesthood' },
  { id: 'ministry', icon: '🕊️', text: 'Ministry' },
  { id: 'family', icon: '❤️', text: 'Family' },
  { id: 'celebrations', icon: '🎉', text: 'Celebrations' },
  { id: 'legacy', icon: '🌅', text: 'Legacy' },
];

const SWIPER_OPTS = {
  effect: 'coverflow',
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: 'auto',
  coverflowEffect: { rotate: 20, stretch: 0, depth: 200, modifier: 1, slideShadows: true },
  pagination: { el: '.swiper-pagination', clickable: true },
  navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
  loop: false,
};

function initGalleries() {
  CATEGORY_META.forEach(cat => {
    const wrapper = document.getElementById(`slides-${cat.id}`);
    if (!wrapper) return;

    const files = PHOTO_MAP[cat.id] || [];

    if (files.length === 0) {
      // Show a single placeholder if no photos yet
      wrapper.innerHTML = `
        <div class="swiper-slide">
          <div class="placeholder-slide">
            <span>${cat.icon}</span>
            <p>Photos coming soon</p>
            <code style="font-size:0.7rem;opacity:0.5">images/${cat.id}/</code>
          </div>
        </div>`;
    } else {
      files.forEach(filename => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = `<img src="images/${cat.id}/${encodeURIComponent(filename)}"
                                alt="${cat.text} — ${filename}"
                                loading="lazy"
                                style="width:100%;height:100%;object-fit:cover;" />`;
        wrapper.appendChild(slide);
      });
    }

    new Swiper(`#swiper-${cat.id}`, SWIPER_OPTS);
  });
}


// ═══════════════════════════════════════════════════════════════
//  CANDLES — Global counter in Firestore
// ═══════════════════════════════════════════════════════════════
const CANDLE_HTML = `
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
  </div>`;

async function initCandles() {
  const grid = document.getElementById('candleGrid');
  const litCountEl = document.getElementById('litCount');
  const lightBtn = document.getElementById('lightAllBtn');

  // ── Ensure the stats doc exists ──────────────────────────────
  try {
    const snap = await getDoc(statsDocRef);
    if (!snap.exists()) {
      await setDoc(statsDocRef, { candleCount: 0 });
    }
  } catch (e) {
    console.warn('Firestore stats init error:', e);
  }

  // ── Listen for real-time counter updates ──────────────────────
  onSnapshot(statsDocRef, snap => {
    if (snap.exists()) {
      const count = snap.data().candleCount || 0;
      litCountEl.textContent = count;
      syncCandleGrid(grid, count);
    }
  });

  // ── Light-a-candle button ─────────────────────────────────────
  lightBtn.addEventListener('click', async () => {
    lightBtn.disabled = true;
    lightBtn.textContent = 'Lighting…';
    try {
      await updateDoc(statsDocRef, { candleCount: increment(1) });
    } catch (e) {
      console.error('Could not light candle:', e);
    }
    lightBtn.disabled = false;
    lightBtn.textContent = 'Light a Candle for Fr. Winson';
  });

  // ── Seed initial display candles ──────────────────────────────
  for (let i = 0; i < 5; i++) addCandleEl(grid, false);
}

function syncCandleGrid(grid, litCount) {
  // Ensure we always have at least litCount + 2 candles rendered
  const current = grid.querySelectorAll('.candle-item').length;
  const needed = Math.max(litCount + 2, 5);
  for (let i = current; i < needed; i++) addCandleEl(grid, false);

  // Illuminate the correct count
  const items = grid.querySelectorAll('.candle-item');
  items.forEach((item, idx) => {
    item.classList.toggle('lit', idx < litCount);
  });
}

function addCandleEl(grid, lit = false) {
  const el = document.createElement('div');
  el.className = 'candle-item' + (lit ? ' lit' : '');
  el.innerHTML = CANDLE_HTML;
  grid.appendChild(el);
}


// ═══════════════════════════════════════════════════════════════
//  TRIBUTES — Firestore real-time
// ═══════════════════════════════════════════════════════════════
function initTributes() {
  const grid = document.getElementById('tributesGrid');

  // Listen for new tributes in real time, most recent first
  const q = query(tributesColRef, orderBy('timestamp', 'desc'));

  onSnapshot(q, snapshot => {
    snapshot.docChanges().forEach(change => {
      if (change.type === 'added') {
        const data = change.doc.data();
        prependTributeCard(grid, data.name, data.relation, data.message);
      }
    });
  });
}

function prependTributeCard(grid, name, relation, message) {
  const card = document.createElement('div');
  card.className = 'tribute-card';

  const author = relation ? `— ${name} (${relation})` : `— ${name}`;

  card.innerHTML = `
    <div class="tribute-quote-mark">"</div>
    <p class="tribute-text">${escapeHtml(message)}</p>
    <div class="tribute-author">${escapeHtml(author)}</div>`;

  // Insert BEFORE the static seed cards so new ones appear at top
  grid.insertBefore(card, grid.firstChild);
}

// Exposed globally so the inline onsubmit in index.html can call it
window.submitTribute = async function (event) {
  event.preventDefault();

  const btn = event.target.querySelector('button[type="submit"]');
  const name = document.getElementById('tributeName').value.trim();
  const relation = document.getElementById('tributeRelation').value.trim();
  const message = document.getElementById('tributeMessage').value.trim();

  if (!name || !message) return;

  btn.disabled = true;
  btn.textContent = 'Saving…';

  try {
    await addDoc(tributesColRef, {
      name,
      relation,
      message,
      timestamp: serverTimestamp(),
    });
    document.getElementById('tributeForm').reset();

    // Scroll to tributes
    document.getElementById('tributes').scrollIntoView({ behavior: 'smooth' });
  } catch (err) {
    console.error('Could not save tribute:', err);
    alert('Sorry, your tribute could not be saved. Please try again.');
  }

  btn.disabled = false;
  btn.textContent = 'Submit Tribute ✦';
};

// ── XSS guard ─────────────────────────────────────────────────
function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// ═══════════════════════════════════════════════════════════════
//  VIDEOS
// ═══════════════════════════════════════════════════════════════

// Replace these with your actual YouTube video IDs and titles
const YOUTUBE_VIDEOS = [
  { id: 'QIf8MCf8QfI', title: 'Golden Jubilee celebration at Devamatha Thrissur' },
  { id: 'zWl6CixE4Bo', title: 'During Christo - Anu Engagement Function' },
  { id: 'jOjoUYhYg1o', title: 'CMI Congregation Tribute' },
  { id: 'twHvZvQ8Tb0', title: 'Meryls Tribute' },
  { id: 'KewrI7e6FJo', title: 'Funeral Service of Fr. Winson Parekkat' },
];

function initVideos() {
  const grid = document.getElementById('videoGrid');
  if (!grid) return;

  if (YOUTUBE_VIDEOS.length === 0) {
    grid.innerHTML = '<p style="text-align: center; width: 100%; color: var(--color-text-muted); grid-column: 1 / -1;">Videos coming soon...</p>';
    return;
  }

  YOUTUBE_VIDEOS.forEach(video => {
    const card = document.createElement('div');
    card.className = 'swiper-slide video-card';

    // YouTube thumbnail URL format
    const thumbUrl = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;

    card.innerHTML = `
      <div class="video-thumbnail">
        <img src="${thumbUrl}" alt="${video.title}">
        <div class="play-button"></div>
      </div>
      <div class="video-info">
        <h4 class="video-title">${video.title}</h4>
      </div>
    `;

    card.addEventListener('click', () => openVideoModal(video.id));
    grid.appendChild(card);
  });

  // Initialize Swiper for videos
  new Swiper('#swiper-videos', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    coverflowEffect: { rotate: 10, stretch: 0, depth: 100, modifier: 1, slideShadows: true },
    pagination: { el: '#swiper-videos .swiper-pagination', clickable: true },
    navigation: { nextEl: '#swiper-videos .swiper-button-next', prevEl: '#swiper-videos .swiper-button-prev' },
    loop: false,
  });

  // Modal logic
  const modal = document.getElementById('videoModal');
  const closeBtn = document.getElementById('closeVideoModal');

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', closeVideoModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeVideoModal();
    });
  }
}

function openVideoModal(videoId) {
  const modal = document.getElementById('videoModal');
  const iframe = document.getElementById('videoIframe');

  // Autoplay=1 starts the video immediately when modal opens
  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  modal.classList.add('active');
}

function closeVideoModal() {
  const modal = document.getElementById('videoModal');
  const iframe = document.getElementById('videoIframe');

  modal.classList.remove('active');
  iframe.src = ''; // Clear source to stop playback
}
