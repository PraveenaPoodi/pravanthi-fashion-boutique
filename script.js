document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    const setMenuOpen = (open) => {
      navLinks.classList.toggle('show', open);
      navToggle.setAttribute('aria-expanded', String(open));
    };
    navToggle.addEventListener('click', () => setMenuOpen(!navLinks.classList.contains('show')));
    navLinks.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && navLinks.classList.contains('show')) {
        setMenuOpen(false);
        navToggle.focus();
      }
    });
  }

  document.querySelectorAll('.dropdown-toggle').forEach((button) => {
    button.addEventListener('click', () => {
      const dropdown = button.closest('.dropdown');
      const open = dropdown.classList.toggle('open');
      button.setAttribute('aria-expanded', String(open));
    });
    button.closest('.dropdown').addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        const dropdown = button.closest('.dropdown');
        dropdown.classList.remove('open');
        button.setAttribute('aria-expanded', 'false');
        button.focus();
        event.stopPropagation();
      }
    });
  });


  // Open product photographs in an accessible, keyboard-operable lightbox.
  const lightbox = document.createElement('dialog');
  lightbox.className = 'product-lightbox';
  lightbox.setAttribute('aria-label', 'Product photograph viewer');
  lightbox.innerHTML = '<form method="dialog"><button class="lightbox-close" aria-label="Close photograph">Close</button></form><img alt=""><p class="lightbox-caption"></p>';
  document.body.appendChild(lightbox);
  document.querySelectorAll('.zoomable-image').forEach((img) => {
    const show = () => { const target = lightbox.querySelector('img'); target.src = img.currentSrc || img.src; target.alt = img.alt; lightbox.querySelector('.lightbox-caption').textContent = img.alt; lightbox.showModal(); };
    img.addEventListener('click', show);
    img.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); show(); } });
  });
  // Enquiry forms prepare a message for the boutique instead of pretending to store data.
  const waNumber = (window.BOUTIQUE_CONFIG && window.BOUTIQUE_CONFIG.whatsappNumber || '').replace(/\D/g, '');
  const instagramUrl = 'https://www.instagram.com/vassu_gv_designerstudio?srtk=MWE4b3B';
  const sendPrepared = (message, status) => {
    if (waNumber) { window.open('https://wa.me/' + waNumber + '?text=' + encodeURIComponent(message), '_blank', 'noopener,noreferrer'); if (status) status.textContent = 'Your enquiry is ready in WhatsApp. Review it and press Send.'; }
    else { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(message).catch(() => {}); if (status) { status.textContent = 'Your enquiry has been prepared and copied when clipboard access is available. The boutique Instagram profile is opening; paste your message into a direct message.'; } window.open(instagramUrl, '_blank', 'noopener,noreferrer'); }
  };
  const contactForm = document.getElementById('contact-form');
  if (contactForm) contactForm.addEventListener('submit', (event) => { event.preventDefault(); const d = new FormData(contactForm); sendPrepared('Boutique enquiry\nName: '+d.get('name')+'\nEmail: '+d.get('email')+'\nMessage: '+d.get('message'), document.getElementById('contact-success')); });
  const customForm = document.getElementById('custom-form');
  if (customForm) customForm.addEventListener('submit', (event) => { event.preventDefault(); const d = new FormData(customForm); const msg = 'Custom dress enquiry\nName: '+d.get('name')+'\nOutfit: '+d.get('type')+'\nOccasion: '+d.get('occasion')+'\nColour: '+d.get('colour')+'\nSize/age: '+d.get('size')+'\nDetails: '+d.get('details'); sendPrepared(msg, document.getElementById('custom-status')); });

  // Accessible appearance controls available on every page.
  const toolbar = document.createElement('div');
  toolbar.className = 'accessibility-tools';
  toolbar.setAttribute('role', 'group');
  toolbar.setAttribute('aria-label', 'Reading and display settings');
  toolbar.innerHTML = '<span>Display:</span><button type="button" class="text-smaller" aria-label="Decrease text size">A−</button><button type="button" class="text-larger" aria-label="Increase text size">A+</button><button type="button" class="contrast-toggle" aria-pressed="false">High contrast</button>';
  const header = document.querySelector('header');
  if (header) header.insertAdjacentElement('afterend', toolbar);
  let textScale = 100;
  toolbar.querySelector('.text-smaller').addEventListener('click', () => {
    textScale = Math.max(85, textScale - 5);
    document.documentElement.style.fontSize = textScale + '%';
  });
  toolbar.querySelector('.text-larger').addEventListener('click', () => {
    textScale = Math.min(140, textScale + 5);
    document.documentElement.style.fontSize = textScale + '%';
  });
  toolbar.querySelector('.contrast-toggle').addEventListener('click', (event) => {
    const enabled = document.body.classList.toggle('high-contrast');
    event.currentTarget.setAttribute('aria-pressed', String(enabled));
  });

  document.querySelectorAll('.product-card').forEach((card) => {
    const colorData = (card.dataset.colors || '').split(',').filter(Boolean);
    let chosenColor = colorData[0] || 'Not specified';
    card.querySelectorAll('.swatch').forEach((swatch) => {
      swatch.addEventListener('click', () => {
        card.querySelectorAll('.swatch').forEach((item) => item.setAttribute('aria-pressed', 'false'));
        swatch.setAttribute('aria-pressed', 'true');
        chosenColor = swatch.dataset.color || 'Not specified';
        const status = card.querySelector('.color-status');
        if (status) status.textContent = 'Requested colour: ' + chosenColor + '. Please confirm the available colour with the boutique.';
      });
    });

    const orderButton = card.querySelector('.order');
    if (orderButton) orderButton.addEventListener('click', () => {
      const name = card.querySelector('h3')?.textContent?.trim() || 'Selected dress';
      const size = card.querySelector('.size-select')?.value || 'Please advise';
      const quantity = card.querySelector('.quantity')?.value || '1';
      const number = (window.BOUTIQUE_CONFIG && window.BOUTIQUE_CONFIG.whatsappNumber || '').replace(/\D/g, '');
      if (!number) {
        const message = `Hi! I am interested in this dress. Please share more details.\nDress: ${name}\nColour: ${chosenColor}\nSize: ${size}\nQuantity: ${quantity}`;
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(message).catch(() => {});
        window.open(instagramUrl, '_blank', 'noopener,noreferrer');
        window.alert('Your dress enquiry has been prepared. If it was copied, paste it into an Instagram message to the boutique.');
        return;
      }
      const message = `Hi! I am interested in this dress. Please share more details.\nDress: ${name}\nColour: ${chosenColor}\nSize: ${size}\nQuantity: ${quantity}`;
      window.open('https://wa.me/' + number + '?text=' + encodeURIComponent(message), '_blank', 'noopener,noreferrer');
    });

    // No false carousel controls: keep a single photograph when no other angles exist.
    const gallery = card.querySelector('.gallery-controls');
    if (gallery) {
      const slides = [...gallery.querySelectorAll('[data-gallery-src]')];
      const previous = gallery.querySelector('.gallery-prev');
      const next = gallery.querySelector('.gallery-next');
      const status = gallery.querySelector('.gallery-status');
      if (slides.length < 2) {
        if (previous) previous.hidden = true;
        if (next) next.hidden = true;
        if (status) status.textContent = 'One product image is currently available.';
      } else {
        const mainImage = card.querySelector('.product-image');
        let current = 0;
        const showSlide = (index) => {
          current = (index + slides.length) % slides.length;
          mainImage.src = slides[current].dataset.gallerySrc;
          mainImage.alt = slides[current].dataset.galleryAlt || 'Product photograph';
          slides.forEach((slide, i) => slide.setAttribute('aria-current', String(i === current)));
          if (status) status.textContent = `Image ${current + 1} of ${slides.length}: ${mainImage.alt}`;
        };
        previous?.addEventListener('click', () => showSlide(current - 1));
        next?.addEventListener('click', () => showSlide(current + 1));
        slides.forEach((slide, index) => {
          slide.addEventListener('click', () => showSlide(index));
          slide.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              showSlide(index);
            }
          });
        });
        showSlide(0);
      }
    }
  });

  const search = document.getElementById('dress-search');
  const category = document.getElementById('filter-category');
  const age = document.getElementById('filter-age');
  const color = document.getElementById('filter-color');
  const size = document.getElementById('filter-size');
  const maxPrice = document.getElementById('filter-price');
  const sort = document.getElementById('sort-products');
  const params = new URLSearchParams(window.location.search);
  if (search && params.has('q')) search.value = params.get('q');
  function filterCards() {
    const cards = [...document.querySelectorAll('.product-card')];
    const visible = [];
    cards.forEach((card) => {
      const name = (card.dataset.name || '').toLowerCase();
      const categoryName = (card.dataset.category || '').toLowerCase();
      const colorNames = (card.dataset.colors || '').toLowerCase();
      const sizeSelect = card.querySelector('.size-select');
      const matches = (!search || (name + ' ' + categoryName).includes(search.value.toLowerCase())) &&
        (!category || category.value === 'all' || card.dataset.category === category.value) &&
        (!age || age.value === 'all' || card.dataset.age === age.value) &&
        (!color || color.value === 'all' || colorNames.includes(color.value.toLowerCase())) &&
        (!maxPrice || Number(card.dataset.price) <= Number(maxPrice.value)) &&
        (!size || size.value === 'all' || (sizeSelect && [...sizeSelect.options].some(option => option.value === size.value)));
      card.classList.toggle('hidden', !matches);
      if (matches) visible.push(card);
    });
    if (sort) {
      visible.sort((a, b) => {
        if (sort.value === 'low') return Number(a.dataset.price) - Number(b.dataset.price);
        if (sort.value === 'high') return Number(b.dataset.price) - Number(a.dataset.price);
        if (sort.value === 'name') return (a.dataset.name || '').localeCompare(b.dataset.name || '');
        return 0;
      });
      const grid = document.querySelector('.product-grid');
      if (grid) visible.forEach(card => grid.appendChild(card));
    }
    const count = document.getElementById('result-count');
    if (count) count.textContent = visible.length + ' styles found.';
  }
  [search, category, age, color, size, maxPrice, sort].filter(Boolean).forEach((element) => {
    element.addEventListener('input', filterCards);
    element.addEventListener('change', filterCards);
  });
  if (search && params.has('q')) filterCards();

  const newsletter = document.getElementById('newsletter-form');
  if (newsletter) newsletter.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = document.getElementById('newsletter-success');
    if (message) message.textContent = 'Thank you for your interest. To receive collection and offer updates, follow the boutique on Instagram.';
    window.open(instagramUrl, '_blank', 'noopener,noreferrer');
    newsletter.reset();
  });
});
