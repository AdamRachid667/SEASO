/* ─── Dark mode (always dark) ─── */

/* ─── Lenis smooth scroll ─── */
let lenis;
function initLenis() {
  if (typeof Lenis === 'undefined') return;
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}



/* ─── Auto-hide nav ─── */
function initNavHide() {
  const header = document.querySelector('.glass-header');
  if (!header) return;
  let lastScroll = 0;
  const threshold = 80;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current > threshold) {
      header.classList.add('scrolled');
      if (current > lastScroll && current > 200) {
        header.classList.add('hidden-nav');
      } else {
        header.classList.remove('hidden-nav');
      }
    } else {
      header.classList.remove('scrolled');
      header.classList.remove('hidden-nav');
    }
    lastScroll = current;
  }, { passive: true });
}

/* ─── GSAP scroll animations ─── */
function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Reveal elements (skip already-animated ones)
  document.querySelectorAll('[data-reveal]:not([data-animated])').forEach(el => {
    el.setAttribute('data-animated', '1');
    const direction = el.dataset.reveal || 'up';
    const from = { opacity: 0 };
    const to = { opacity: 1, duration: 0.6, ease: 'power2.out' };
    if (direction === 'up') { from.y = 30; to.y = 0; }
    else if (direction === 'left') { from.x = -30; to.x = 0; }
    else if (direction === 'right') { from.x = 30; to.x = 0; }
    else if (direction === 'scale') { from.scale = 0.95; from.y = 15; to.scale = 1; to.y = 0; }

    gsap.fromTo(el, from, {
      ...to,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });
  });

  // Staggered children (skip already-animated)
  document.querySelectorAll('[data-stagger]:not([data-animated])').forEach(parent => {
    parent.setAttribute('data-animated', '1');
    const children = parent.children;
    gsap.fromTo(children,
      { opacity: 0, y: 25 },
      {
        opacity: 1, y: 0,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: parent,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });

  // Parallax elements
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const speed = parseFloat(el.dataset.parallax) || -0.15;
    gsap.to(el, {
      y: () => window.innerHeight * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });

  // Text reveal (split lines)
  document.querySelectorAll('.split-text:not([data-animated])').forEach(el => {
    el.setAttribute('data-animated', '1');
    el.innerHTML = `<span class="line"><span class="line-inner">${el.textContent}</span></span>`;

    gsap.fromTo(el.querySelectorAll('.line-inner'),
      { y: '100%' },
      {
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.06,
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });

  // Animated dividers
  document.querySelectorAll('.hr-anim:not([data-animated])').forEach(el => {
    el.setAttribute('data-animated', '1');
    gsap.fromTo(el,
      { scaleX: 0, transformOrigin: 'left' },
      {
        scaleX: 1,
        duration: 0.8,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: el,
          start: 'top 95%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });

  // Image reveals (curtain wipe)
  document.querySelectorAll('.img-reveal:not([data-animated])').forEach(el => {
    el.setAttribute('data-animated', '1');
    gsap.fromTo(el,
      { clipPath: 'inset(0 100% 0 0)' },
      {
        clipPath: 'inset(0 0% 0 0)',
        duration: 0.8,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });

  // Feature cards hover tilt (lightweight)
  document.querySelectorAll('.feature-card, .commitment-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, {
        rotateY: x * 8,
        rotateX: -y * 8,
        transformPerspective: 600,
        duration: 0.4,
        ease: 'power2.out',
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power3.out' });
    });
  });
}

/* ─── Header / Footer ─── */
function renderHeader() {
  const el = document.getElementById('site-header');
  if (!el) return;
  const count = Cart.getCartCount();
  const badge = count > 0 ? `<span class="cart-badge">${count}</span>` : '';

  el.innerHTML = `
    <header class="glass-header sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          <a href="index.html" class="font-display text-2xl md:text-3xl font-bold tracking-tight" style="color:#C9A84C">SEASO</a>
          <nav class="hidden md:flex items-center gap-10 text-sm font-medium text-gray-400">
            <a href="index.html" class="nav-link py-1">Accueil</a>
            <a href="catalog.html" class="nav-link py-1">Catalogue</a>
            <a href="about.html" class="nav-link py-1">À propos</a>
            <a href="cart.html" class="relative p-1 nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" style="width:1.25rem;height:1.25rem" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
              </svg>
              ${badge}
            </a>
          </nav>
          <button id="mobile-menu-btn" class="md:hidden p-2 text-gray-400" aria-label="Menu">
            <svg xmlns="http://www.w3.org/2000/svg" style="width:1.5rem;height:1.5rem" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5"/>
            </svg>
          </button>
        </div>
      </div>
      <div id="mobile-nav" class="mobile-nav fixed inset-0 z-50 flex flex-col p-8">
        <div class="flex justify-between items-center mb-16">
          <span class="font-display text-2xl font-bold" style="color:#C9A84C">SEASO</span>
          <button id="mobile-nav-close" class="p-2 text-gray-400" aria-label="Fermer">
            <svg xmlns="http://www.w3.org/2000/svg" style="width:1.5rem;height:1.5rem" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <nav class="flex flex-col gap-8 text-2xl font-medium text-gray-300">
          <a href="index.html" class="hover:text-gold">Accueil</a>
          <a href="catalog.html" class="hover:text-gold">Catalogue</a>
          <a href="about.html" class="hover:text-gold">À propos</a>
          <a href="cart.html" class="flex items-center gap-3 hover:text-gold">
            Panier ${count > 0 ? '<span class="cart-badge-mobile">' + count + '</span>' : ''}
          </a>
        </nav>
        <div class="mt-auto pt-8 border-t border-white/[0.06] flex items-center justify-between">
          <p class="text-sm text-gray-400">100% coton bio · 100% belge</p>
        </div>
      </div>
    </header>
  `;

  document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
    document.getElementById('mobile-nav').classList.add('open');
    lenis?.stop();
  });
  document.getElementById('mobile-nav-close')?.addEventListener('click', () => {
    document.getElementById('mobile-nav').classList.remove('open');
    lenis?.start();
  });
}

function renderFooter() {
  const el = document.getElementById('site-footer');
  if (!el) return;
  el.innerHTML = `
    <footer class="border-t border-white/[0.06] mt-14">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8" data-reveal="up">
          <div class="md:col-span-2">
            <span class="font-display text-3xl font-bold" style="color:#C9A84C">SEASO</span>
            <p class="mt-5 text-sm text-gray-400 leading-relaxed max-w-sm">
              T-shirts 100&nbsp;% coton bio, 100&nbsp;% belges. Une collection de 7 pièces uniques inspirées des merveilles du monde moderne.
            </p>
            <div class="flex items-center gap-5 mt-6">
              <span class="trust-item"><span>🌿</span> Bio</span>
              <span class="trust-item"><span>🇧🇪</span> Belge</span>
              <span class="trust-item"><span>♻️</span> Éco</span>
            </div>
          </div>
          <div>
            <h4 class="font-semibold text-xs uppercase tracking-widest text-gray-400 mb-5">Boutique</h4>
            <ul class="space-y-3 text-sm text-gray-400">
              <li><a href="index.html" class="nav-link">Accueil</a></li>
              <li><a href="catalog.html" class="nav-link">Catalogue</a></li>
              <li><a href="about.html" class="nav-link">À propos</a></li>
              <li><a href="cart.html" class="nav-link">Panier</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-xs uppercase tracking-widest text-gray-400 mb-5">Informations</h4>
            <ul class="space-y-3 text-sm text-gray-400">
              <li><a href="legal.html" class="nav-link">Mentions légales</a></li>
              <li><a href="legal.html#cgv" class="nav-link">CGV</a></li>
              <li><a href="legal.html#privacy" class="nav-link">Confidentialité</a></li>
            </ul>
          </div>
        </div>
        <div class="mt-8 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-xs text-gray-400">&copy; ${new Date().getFullYear()} SEASO — Tous droits réservés</p>
          <p class="text-xs text-gray-400">Mini-entreprise belge 🇧🇪</p>
        </div>
      </div>
    </footer>
  `;
}

/* ─── Toast notification ─── */
function showToast(message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed;bottom:2rem;right:2rem;z-index:9999;display:flex;flex-direction:column;gap:0.5rem;pointer-events:none;';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = '✓ ' + message;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

/* ─── Loading screen ─── */
function dismissLoader() {
  var loader = document.getElementById('loader-screen');
  if (!loader || loader.classList.contains('done')) return;
  loader.classList.add('done');
  setTimeout(function() { if (loader.parentNode) loader.remove(); }, 700);
}

/* ─── Init ─── */
document.addEventListener('DOMContentLoaded', function() {
  // Render header & footer immediately (behind the loader)
  try { renderHeader(); } catch(e) { console.warn('Header:', e); }
  try { renderFooter(); } catch(e) { console.warn('Footer:', e); }

  // Wait 1.5s for CDN scripts to settle, then init everything and reveal
  setTimeout(function() {
    try { initLenis(); } catch(e) { console.warn('Lenis:', e); }
    try { initNavHide(); } catch(e) { console.warn('NavHide:', e); }
    try { initScrollAnimations(); } catch(e) { console.warn('GSAP:', e); }
    dismissLoader();
  }, 2125);
});
