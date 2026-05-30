/* ══════════════════════════════════════════════════════════ */
/*  GOOGLE DRIVE SWIPER GALLERIES                             */
/* ══════════════════════════════════════════════════════════ */
function initGalleries() {
  const categories = [
    { id: 'early-life', folderName: 'early-life', icon: '🌱', text: 'Photos from Early Life' },
    { id: 'priesthood', folderName: 'priesthood', icon: '✝', text: 'Photos of Priesthood' },
    { id: 'ministry', folderName: 'ministry', icon: '🕊️', text: 'Photos of Ministry' },
    { id: 'family', folderName: 'family', icon: '❤️', text: 'Photos with Family' },
    { id: 'celebrations', folderName: 'celebrations', icon: '🎉', text: 'Photos of Celebrations' },
    { id: 'legacy', folderName: 'legacy', icon: '🌅', text: 'Photos of Legacy' }
  ];

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
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    loop: false,
  };

  // Google Apps Script URL - Replace with your deployed script URL
  const SCRIPT_URL = window.GOOGLE_APPS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbzaqTGGt16EaDKlSCcKwv8JFfz__KQmqf5ZXJ4tfpoaxHA_OLJlQ_fpDYE00f66TS6AVA/exec';
//   const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';

  categories.forEach(async (category) => {
    try {
      // Fetch images from Google Apps Script
      const response = await fetch(`${SCRIPT_URL}?folder=${category.folderName}`);
      const data = await response.json();
      
      const wrapper = document.getElementById(`slides-${category.id}`);
      
      if (data.images && data.images.length > 0) {
        data.images.forEach((imageUrl, index) => {
          const slide = document.createElement('div');
          slide.classList.add('swiper-slide');
          slide.innerHTML = `<img src="${imageUrl}" alt="Photo ${index + 1}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy">`;
        //   slide.innerHTML = `
        //         <div class="placeholder-slide">
        //         <span>${category.icon}</span>
        //         <p>${category.text}<br><small>(Image ${i})</small></p>
        //         <code style="font-size: 0.7rem; margin-top:1rem; opacity:0.5">images/${category.id}/img${i}.jpg</code>
        //         </div>
        //     `;
          wrapper.appendChild(slide);
        });
      }

      new Swiper(`#swiper-${category.id}`, swiperOptions);
    } catch (error) {
      console.error(`Error loading gallery for ${category.id}:`, error);
    }
  });
}