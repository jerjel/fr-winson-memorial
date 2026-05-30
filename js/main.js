// ═══════════════════════════════════════════════════════════════
//  main.js  —  Firebase-powered Memorial Site
//  Uses ES Modules (type="module" on the script tag in index.html)
// ═══════════════════════════════════════════════════════════════

import { initializeApp }                       from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc,
         updateDoc, increment, collection,
         addDoc, onSnapshot, orderBy,
         query, serverTimestamp }              from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ── Firebase Configuration ───────────────────────────────────
const firebaseConfig = {
  apiKey:            "AIzaSyDnlwcSEmMIG0dR44mJ0QdEuVkA5621TQ8",
  authDomain:        "frwinson-memorial.firebaseapp.com",
  projectId:         "frwinson-memorial",
  storageBucket:     "frwinson-memorial.firebasestorage.app",
  messagingSenderId: "912022141411",
  appId:             "1:912022141411:web:bb983d965610ef07a248d6",
  measurementId:     "G-RRCNN2KTEJ"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// ── Firestore Document References ────────────────────────────
const statsDocRef    = doc(db, "memorial", "stats");
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
  initCandles();     // Firebase-backed candle counter
  initTributes();    // Firebase real-time tribute feed
});


// ═══════════════════════════════════════════════════════════════
//  NAVBAR
// ═══════════════════════════════════════════════════════════════
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  navToggle.addEventListener('click', () => {
    const open = navLinks.style.display === 'flex';
    navLinks.style.display          = open ? '' : 'flex';
    navLinks.style.flexDirection    = 'column';
    navLinks.style.position         = 'absolute';
    navLinks.style.top              = '100%';
    navLinks.style.left             = '0';
    navLinks.style.width            = '100%';
    navLinks.style.background       = 'rgba(15,17,21,0.97)';
    navLinks.style.padding          = '1rem 0';
    navLinks.style.textAlign        = 'center';
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
      position:     'absolute',
      width:        `${size}px`,
      height:       `${size}px`,
      left:         `${Math.random() * 100}%`,
      top:          `${Math.random() * 100}%`,
      background:   'rgba(212,175,55,0.6)',
      borderRadius: '50%',
      boxShadow:    '0 0 10px rgba(212,175,55,0.8)',
      animation:    `floatParticle ${Math.random()*10+5}s ease-in-out ${Math.random()*5}s infinite alternate`,
    });
    container.appendChild(p);
  }
}


// ═══════════════════════════════════════════════════════════════
//  GALLERY — Loads real local photos
// ═══════════════════════════════════════════════════════════════

// ── Add your actual file names here as you upload photos ──────
const PHOTO_MAP = {
  'early-life':    ['img1.jpg','img2.jpg','img3.jpg','img4.jpg','img5.jpg','img6.jpg','img7.jpg'],
  'priesthood':    ['Copy of 2.jpg','Copy of 3.jpg','DSCF0033.JPG','IMG_20170706_112644.jpg',
                    'death_of_ammama.jpg','death_of_valliappapan.jpg','death_of_vellianty.jpg',
                    'docu0086.jpg','docu0088.jpg','docu0096.jpg','docu0107.jpg'],
  'ministry':      ['IMG_20170706_112347.jpg','IMG_20170706_112441.jpg','vellippanachan_at_US.jpg',
                    'vellippanachan_in_us.jpg','vellippanachan_with_his_car_at_US.jpg',
                    'vellippanachan_with_pastor.jpg'],
  'family':        ['IMG_20170622_155652.jpg','IMG_20170706_113419.jpg','IMG_20170706_120030.jpg',
                    'IMG_20170706_120824.jpg','IMG_20170706_120902.jpg',
                    'abc_with_vellippanachan.jpg','docu0106.jpg'],
  'celebrations':  ['IMG-20170625-WA0018.jpg','IMG-20170625-WA0019.jpg','IMG-20170625-WA0020.jpg',
                    'IMG-20170625-WA0077.jpg','Pappas_birthday_4.jpg','Pappas_birthday_6.jpg',
                    'Vellippanachan_Joel.jpg','Vellippanachan_Joel_1.jpg',
                    'vellipanachan_bastian_christo.jpg','vellippanachan_jubilee.jpg',
                    'vellippanachan_on_jubilee.jpg','with_vellippanachan.jpg'],
  'legacy':        []   // Add legacy photo filenames here when ready
};

const CATEGORY_META = [
  { id: 'early-life',   icon: '🌱', text: 'Early Life'   },
  { id: 'priesthood',   icon: '✝',  text: 'Priesthood'   },
  { id: 'ministry',     icon: '🕊️', text: 'Ministry'     },
  { id: 'family',       icon: '❤️', text: 'Family'       },
  { id: 'celebrations', icon: '🎉', text: 'Celebrations' },
  { id: 'legacy',       icon: '🌅', text: 'Legacy'       },
];

const SWIPER_OPTS = {
  effect:        'coverflow',
  grabCursor:    true,
  centeredSlides: true,
  slidesPerView: 'auto',
  coverflowEffect: { rotate: 20, stretch: 0, depth: 200, modifier: 1, slideShadows: true },
  pagination:    { el: '.swiper-pagination', clickable: true },
  navigation:    { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
  loop:          false,
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
  const grid        = document.getElementById('candleGrid');
  const litCountEl  = document.getElementById('litCount');
  const lightBtn    = document.getElementById('lightAllBtn');

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
    lightBtn.disabled    = true;
    lightBtn.textContent = 'Lighting…';
    try {
      await updateDoc(statsDocRef, { candleCount: increment(1) });
    } catch (e) {
      console.error('Could not light candle:', e);
    }
    lightBtn.disabled    = false;
    lightBtn.textContent = 'Light a Candle for Fr. Winson';
  });

  // ── Seed initial display candles ──────────────────────────────
  for (let i = 0; i < 5; i++) addCandleEl(grid, false);
}

function syncCandleGrid(grid, litCount) {
  // Ensure we always have at least litCount + 2 candles rendered
  const current = grid.querySelectorAll('.candle-item').length;
  const needed  = Math.max(litCount + 2, 5);
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
window.submitTribute = async function(event) {
  event.preventDefault();

  const btn      = event.target.querySelector('button[type="submit"]');
  const name     = document.getElementById('tributeName').value.trim();
  const relation = document.getElementById('tributeRelation').value.trim();
  const message  = document.getElementById('tributeMessage').value.trim();

  if (!name || !message) return;

  btn.disabled    = true;
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

  btn.disabled    = false;
  btn.textContent = 'Submit Tribute ✦';
};

// ── XSS guard ─────────────────────────────────────────────────
function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}
