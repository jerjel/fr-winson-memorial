/* ══════════════════════════════════════════════════════════ */
/*  LOCAL DRIVE SWIPER GALLERIES                              */
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