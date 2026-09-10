/* Shared wonder images & emojis */
const WONDER_IMAGES = {
  'grande-muraille':   '/images/products/grande-muraille.svg',
  'petra':             '/images/products/petra.svg',
  'christ-redempteur': '/images/products/christ-redempteur.svg',
  'machu-picchu':      '/images/products/machu-picchu.svg',
  'chichen-itza':      '/images/products/chichen-itza.svg',
  'colisee':           '/images/products/colisee.svg',
  'taj-mahal':         '/images/products/taj-mahal.svg',
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
  { slug: 'grande-muraille', name: 'Grande Muraille', wonder: 'Chine', price_cents: 2990 },
  { slug: 'petra', name: 'Pétra', wonder: 'Jordanie', price_cents: 2990 },
  { slug: 'christ-redempteur', name: 'Christ Rédempteur', wonder: 'Brésil', price_cents: 2990 },
  { slug: 'machu-picchu', name: 'Machu Picchu', wonder: 'Pérou', price_cents: 2990 },
  { slug: 'chichen-itza', name: 'Chichén Itzá', wonder: 'Mexique', price_cents: 2990 },
  { slug: 'colisee', name: 'Colisée', wonder: 'Italie', price_cents: 2990 },
  { slug: 'taj-mahal', name: 'Taj Mahal', wonder: 'Inde', price_cents: 2990 },
];

function productCardHTML(p, opts = {}) {
  const tag = opts.headingTag || 'h3';
  const img = WONDER_IMAGES[p.slug] || p.image_url || '';
  return `
    <a href="/product.html?slug=${p.slug}" class="product-card block" data-reveal="up">
      <div class="overflow-hidden">
        ${img
          ? `<img src="${img}" alt="${p.name}" class="w-full object-cover" style="aspect-ratio:4/5" loading="lazy" onload="this.classList.add('loaded')">`
          : `<div class="product-placeholder" style="aspect-ratio:4/5" data-wonder="${p.slug}">
              <span class="text-5xl">${WONDER_EMOJIS[p.slug] || p.name.charAt(0)}</span>
            </div>`
        }
      </div>
      <div class="card-body">
        <${tag} class="font-semibold text-lg">${p.name}</${tag}>
        <p class="text-sm text-gray-400 mt-1">${p.wonder}</p>
        <div class="flex items-center justify-between mt-4">
          <span class="font-bold text-gold text-lg">${(p.price_cents / 100).toFixed(2)}&nbsp;€</span>
          <span class="text-sm font-semibold text-gold">Voir →</span>
        </div>
      </div>
    </a>
  `;
}
