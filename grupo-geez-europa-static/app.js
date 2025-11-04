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
        setTimeout(() => { formMsg.textContent = ''; formMsg.style.color = ''; }, 4000);
      } catch (e) {
        formMsg.textContent = 'Error guardando la solicitud. Inténtalo de nuevo.';
        formMsg.style.color = '#ef4444';
      }
    });
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

  // Button hover shimmer (set mouse coords into CSS vars)
  document.querySelectorAll('.btn-primary').forEach(btn => {
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


