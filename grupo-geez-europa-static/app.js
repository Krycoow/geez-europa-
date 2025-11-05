document.addEventListener('DOMContentLoaded', () => {
  // Theme initialize
  const root = document.documentElement;
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === 'dark') root.setAttribute('data-theme', 'dark');
  const themeBtn = document.getElementById('themeToggle');
  const setThemeIcon = () => { if (themeBtn) themeBtn.textContent = root.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙'; };
  setThemeIcon();
  if (themeBtn) themeBtn.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    if (isDark) { root.removeAttribute('data-theme'); localStorage.removeItem('theme'); }
    else { root.setAttribute('data-theme', 'dark'); localStorage.setItem('theme', 'dark'); }
    setThemeIcon();
  });
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const formMsg = document.getElementById('formMsg');
  const sendBtn = document.getElementById('sendBtn');
  if (sendBtn && formMsg) {
    sendBtn.addEventListener('click', () => {
      const name = document.getElementById('fName')?.value || '';
      const phone = document.getElementById('fPhone')?.value || '';
      const email = document.getElementById('fEmail')?.value || '';
      const budget = document.getElementById('fBudget')?.value || '';
      const space = document.getElementById('fSpace')?.value || '';
      const area = document.getElementById('fArea')?.value || '';
      const message = document.getElementById('fMessage')?.value || '';

      if (!name || !phone || !email || !budget || !space || !message) {
        formMsg.textContent = 'Por favor, completa los campos obligatorios.';
        formMsg.style.color = '#ef4444';
        return;
      }

      const entry = {
        id: Date.now(),
        date: new Date().toISOString(),
        name, phone, email, budget, space, area, message,
      };
      try {
        const key = 'geez_quotes';
        const list = JSON.parse(localStorage.getItem(key) || '[]');
        list.unshift(entry);
        localStorage.setItem(key, JSON.stringify(list));
        formMsg.textContent = 'Enviado. Te contactaremos en menos de 24 horas.';
        formMsg.style.color = '#16a34a';
        // Copiar enlace compartible al portapapeles
        try {
          const shareUrl = buildShareUrl(entry);
          if (navigator.clipboard && shareUrl) {
            navigator.clipboard.writeText(shareUrl).catch(() => {});
          }
        } catch (_) {}
        // Abrir WhatsApp con mensaje pre-rellenado
        try {
          const waHref = buildWhatsAppHref(entry);
          if (waHref) window.open(waHref, '_blank');
        } catch (_) {}
        setTimeout(() => { formMsg.textContent = ''; formMsg.style.color = ''; }, 4000);
      } catch (e) {
        formMsg.textContent = 'Error guardando la solicitud. Inténtalo de nuevo.';
        formMsg.style.color = '#ef4444';
      }
    });
  }

  // Actualizar href del botón WhatsApp del formulario a medida que se rellena
  const formWhatsAppBtn = document.querySelector('.cta .btn.btn-outline[href^="https://wa.me/"]');
  const watchedInputs = ['fName','fPhone','fEmail','fBudget','fSpace','fArea','fMessage']
    .map(id => document.getElementById(id))
    .filter(Boolean);
  if (formWhatsAppBtn && watchedInputs.length) {
    const updateWa = () => {
      const data = {
        name: document.getElementById('fName')?.value || '',
        phone: document.getElementById('fPhone')?.value || '',
        email: document.getElementById('fEmail')?.value || '',
        budget: document.getElementById('fBudget')?.value || '',
        space: document.getElementById('fSpace')?.value || '',
        area: document.getElementById('fArea')?.value || '',
        message: document.getElementById('fMessage')?.value || '',
      };
      const href = buildWhatsAppHref(data);
      if (href) formWhatsAppBtn.setAttribute('href', href);
    };
    watchedInputs.forEach(el => el.addEventListener('input', updateWa));
    updateWa();
  }

  // Prefill desde URL (enlace compartible)
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.size) {
      const fill = (id, val) => { const el = document.getElementById(id); if (el && val) el.value = val; };
      fill('fName', params.get('name') || '');
      fill('fPhone', params.get('phone') || '');
      fill('fEmail', params.get('email') || '');
      fill('fBudget', params.get('budget') || '');
      fill('fSpace', params.get('space') || '');
      fill('fArea', params.get('area') || '');
      fill('fMessage', params.get('message') || '');
    }
  } catch (_) {}

  function buildShareUrl(data) {
    const url = new URL(window.location.href);
    url.search = '';
    const params = new URLSearchParams();
    if (data.name) params.set('name', data.name);
    if (data.phone) params.set('phone', data.phone);
    if (data.email) params.set('email', data.email);
    if (data.budget) params.set('budget', data.budget);
    if (data.space) params.set('space', data.space);
    if (data.area) params.set('area', String(data.area || ''));
    if (data.message) params.set('message', data.message);
    return `${url.origin}${url.pathname}?${params.toString()}`;
  }

  function buildWhatsAppHref(data) {
    // Intentar extraer el número de algún enlace wa.me existente en la página
    const waAnchor = document.querySelector('a[href^="https://wa.me/"]');
    const fallbackNumber = '000000000';
    let number = fallbackNumber;
    if (waAnchor) {
      try {
        const m = String(waAnchor.getAttribute('href') || '').match(/wa\.me\/(\d+)/);
        if (m && m[1]) number = m[1];
      } catch (_) {}
    }
    const lines = [
      'Hola, quiero solicitar un presupuesto a medida:',
      `• Nombre: ${data.name || '-'}`,
      `• Teléfono: ${data.phone || '-'}`,
      `• Email: ${data.email || '-'}`,
      `• Estancia/Tipo: ${data.space || '-'}`,
      `• Presupuesto: ${data.budget || '-'}`,
      `• Metros²: ${data.area || '-'}`,
      `• Comentarios: ${data.message || '-'}`,
    ];
    const text = encodeURIComponent(lines.join('\n'));
    return `https://wa.me/${number}?text=${text}`;
  }

  // Gallery Modal
  const modal = document.getElementById('galleryModal');
  const modalImg = document.getElementById('galleryImg');
  const galleryItems = document.querySelectorAll('.gallery-item img');
  const closeBtn = document.querySelector('.gallery-close');
  const prevBtn = document.querySelector('.gallery-prev');
  const nextBtn = document.querySelector('.gallery-next');
  let currentIndex = 0;

  galleryItems.forEach((img, index) => {
    img.addEventListener('click', () => {
      currentIndex = index;
      modalImg.src = img.src;
      modalImg.alt = img.alt;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = ''; 
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
      modalImg.src = galleryItems[currentIndex].src;
      modalImg.alt = galleryItems[currentIndex].alt;
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % galleryItems.length;
      modalImg.src = galleryItems[currentIndex].src;
      modalImg.alt = galleryItems[currentIndex].alt;
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Scroll animations
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.card, .section-head').forEach(el => {
    observer.observe(el);
  });

  // Hero counters animation
  const counters = document.querySelectorAll('.hero-stats strong');
  const targetValues = Array.from(counters).map(c => c.textContent);
  const numeric = targetValues.map(t => {
    const m = (t || '').match(/\d+/);
    return m ? parseInt(m[0], 10) : null;
  });
  const runCounters = () => {
    counters.forEach((el, i) => {
      const goal = numeric[i];
      if (goal === null) return;
      let current = 0;
      const duration = 1200;
      const start = performance.now();
      const step = (ts) => {
        const p = Math.min(1, (ts - start) / duration);
        current = Math.floor(goal * p * (1.1 - 0.1 * (1 - p))); // ease-out-ish
        el.textContent = (targetValues[i] || '').replace(/\d+/, String(current));
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = targetValues[i];
      };
      requestAnimationFrame(step);
    });
  };
  const hero = document.querySelector('.hero');
  if (hero) {
    const io = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) { runCounters(); io.disconnect(); }
    }, { threshold: 0.5 });
    io.observe(hero);
  }

  // Parallax effect on hero decor
  const decor = document.querySelector('.hero .decor');
  if (decor) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY * 0.15;
      decor.style.transform = `translateY(${y}px)`;
    }, { passive: true });
  }

  // Custom cursor and magnetic interactions
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  let cursorX = 0, cursorY = 0;
  let ringX = 0, ringY = 0;
  const moveCursor = (e) => {
    cursorX = e.clientX; cursorY = e.clientY;
    if (cursorDot) { cursorDot.style.transform = `translate(${cursorX}px, ${cursorY}px)`; }
  };
  const renderRing = () => {
    ringX += (cursorX - ringX) * 0.18;
    ringY += (cursorY - ringY) * 0.18;
    if (cursorRing) { cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`; }
    requestAnimationFrame(renderRing);
  };
  if (cursorDot && cursorRing) {
    window.addEventListener('pointermove', moveCursor);
    window.addEventListener('pointerdown', () => document.body.classList.add('is-press'));
    window.addEventListener('pointerup', () => document.body.classList.remove('is-press'));
    requestAnimationFrame(renderRing);
    // Hide cursor when leaving window
    window.addEventListener('mouseout', () => { cursorDot.classList.add('cursor-hide'); cursorRing.classList.add('cursor-hide'); });
    window.addEventListener('mouseover', () => { cursorDot.classList.remove('cursor-hide'); cursorRing.classList.remove('cursor-hide'); });
    // Hover targets
    const hoverables = Array.from(document.querySelectorAll('a, button, .card, [data-magnetic]'));
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('is-hover'));
    });
    // Magnetic effect on buttons
    document.querySelectorAll('[data-magnetic]').forEach(el => {
      el.addEventListener('pointermove', (e) => {
        const rect = el.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${relX * 0.08}px, ${relY * 0.08}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = 'translate(0px, 0px)'; });
    });
  }

  // Button hover shimmer (set mouse coords into CSS vars)
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.setAttribute('data-magnetic', '');
    btn.addEventListener('pointermove', (e) => {
      const rect = btn.getBoundingClientRect();
      btn.style.setProperty('--x', `${e.clientX - rect.left}px`);
      btn.style.setProperty('--y', `${e.clientY - rect.top}px`);
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href !== '') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Back to top button
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) backToTop.classList.add('show'); else backToTop.classList.remove('show');
    }, { passive: true });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // Before/After slider logic
  document.querySelectorAll('.before-after').forEach(wrapper => {
    const pane = wrapper.querySelector('.before-pane');
    const slider = wrapper.querySelector('.ba-slider');
    if (!pane || !slider) return;
    const update = (val) => {
      const pct = Number(val);
      pane.style.width = pct + '%';
    };
    slider.addEventListener('input', (e) => update(e.target.value));
    update(slider.value);
  });

  // Admin panel auth (client-side demo only)
  const adminLogin = document.getElementById('adminLogin');
  const adminKey = document.getElementById('adminKey');
  const adminMsg = document.getElementById('adminMsg');
  const adminAuth = document.getElementById('adminAuth');
  const adminPanel = document.getElementById('adminPanel');
  if (adminLogin && adminKey && adminAuth && adminPanel) {
    adminLogin.addEventListener('click', () => {
      const val = String(adminKey.value || '').trim().toLowerCase();
      if (val === 'geez europa') {
        adminAuth.style.display = 'none';
        adminPanel.style.display = 'block';
        if (adminMsg) { adminMsg.textContent = ''; }
        renderQuotes();
      } else {
        if (adminMsg) { adminMsg.textContent = 'Clave incorrecta'; adminMsg.style.color = '#ef4444'; }
      }
    });
  }

  function renderQuotes() {
    const key = 'geez_quotes';
    const table = document.getElementById('quotesTable');
    if (!table) return;
    const tbody = table.querySelector('tbody');
    if (!tbody) return;
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    tbody.innerHTML = '';
    list.forEach(item => {
      const tr = document.createElement('tr');
      const d = new Date(item.date);
      const dateStr = `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
      tr.innerHTML = `
        <td>${escapeHtml(dateStr)}</td>
        <td>${escapeHtml(item.name)}</td>
        <td>${escapeHtml(item.phone)}</td>
        <td>${escapeHtml(item.email)}</td>
        <td>${escapeHtml(item.space)}</td>
        <td>${escapeHtml(String(item.budget))}</td>
        <td>${escapeHtml(item.area || '')}</td>
        <td>${escapeHtml(item.message)}</td>
      `;
      tbody.appendChild(tr);
    });
    const exportBtn = document.getElementById('exportQuotes');
    const clearBtn = document.getElementById('clearQuotes');
    if (exportBtn) exportBtn.onclick = () => exportCSV(list);
    if (clearBtn) clearBtn.onclick = () => { localStorage.removeItem(key); renderQuotes(); };
  }

  function exportCSV(list) {
    if (!list || !list.length) return;
    const headers = ['Fecha','Nombre','Telefono','Email','Estancia','Presupuesto','Medidas','Mensaje'];
    const rows = list.map(it => [it.date, it.name, it.phone, it.email, it.space, it.budget, it.area || '', it.message]);
    const csv = [headers, ...rows].map(r => r.map(v => '"' + String(v).replaceAll('"','""') + '"').join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'solicitudes_geez.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"]+/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s] || s));
  }
});


