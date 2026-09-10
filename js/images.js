/* Shared wonder images & emojis */
const WONDER_IMAGES = {
  'grande-muraille':   'images/products/grande-muraille.svg',
  'petra':             'images/products/petra.svg',
  'christ-redempteur': 'images/products/christ-redempteur.svg',
  'machu-picchu':      'images/products/machu-picchu.svg',
  'chichen-itza':      'images/products/chichen-itza.svg',
  'colisee':           'images/products/colisee.svg',
  'taj-mahal':         'images/products/taj-mahal.svg',
};

const WONDER_EMOJIS = {
  'grande-muraille':   '🏯',
  'petra':             '🏛️',
  'christ-redempteur': '✝️',
  'machu-picchu':      '🏔️',
  'chichen-itza':      '🏛️',
  'colisee':           '🏟️',
  'taj-mahal':         '🕌',
};

const FALLBACK_PRODUCTS = [
  { id: 'grande-muraille', slug: 'grande-muraille', name: 'Grande Muraille', wonder: 'Chine', price_cents: 2990 },
  { id: 'petra', slug: 'petra', name: 'Pétra', wonder: 'Jordanie', price_cents: 2990 },
  { id: 'christ-redempteur', slug: 'christ-redempteur', name: 'Christ Rédempteur', wonder: 'Brésil', price_cents: 2990 },
  { id: 'machu-picchu', slug: 'machu-picchu', name: 'Machu Picchu', wonder: 'Pérou', price_cents: 2990 },
  { id: 'chichen-itza', slug: 'chichen-itza', name: 'Chichén Itzá', wonder: 'Mexique', price_cents: 2990 },
  { id: 'colisee', slug: 'colisee', name: 'Colisée', wonder: 'Italie', price_cents: 2990 },
  { id: 'taj-mahal', slug: 'taj-mahal', name: 'Taj Mahal', wonder: 'Inde', price_cents: 2990 },
];

function escapeHTML(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function productCardHTML(p, opts = {}) {
  const tag = opts.headingTag || 'h3';
  const img = WONDER_IMAGES[p.slug] || p.image_url || '';
  const safeName = escapeHTML(p.name);
  const safeWonder = escapeHTML(p.wonder);
  const safeSlug = encodeURIComponent(p.slug);
  return `
    <a href="product.html?slug=${safeSlug}" class="product-card block" data-reveal="up">
      <div class="overflow-hidden">
        ${img
          ? `<img src="${escapeHTML(img)}" alt="${safeName}" class="w-full object-cover" style="aspect-ratio:4/5" loading="lazy">`
          : `<div class="product-placeholder" style="aspect-ratio:4/5" data-wonder="${safeSlug}">
              <span class="text-5xl">${WONDER_EMOJIS[p.slug] || safeName.charAt(0)}</span>
            </div>`
        }
      </div>
      <div class="card-body">
        <${tag} class="font-semibold text-lg">${safeName}</${tag}>
        <p class="text-sm text-gray-400 mt-1">${safeWonder}</p>
        <div class="flex items-center justify-between mt-4">
          <span class="font-bold text-gold text-lg">${(p.price_cents / 100).toFixed(2)}&nbsp;€</span>
          <span class="text-sm font-semibold text-gold">Voir →</span>
        </div>
      </div>
    </a>
  `;
}
