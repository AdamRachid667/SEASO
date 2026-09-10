const API_BASE = '';

const Api = {
  async fetchProducts() {
    const res = await fetch(`${API_BASE}/api/products`);
    if (!res.ok) throw new Error('Erreur lors du chargement des produits');
    return res.json();
  },

  async fetchProduct(slug) {
    const res = await fetch(`${API_BASE}/api/products/${encodeURIComponent(slug)}`);
    if (!res.ok) throw new Error('Produit introuvable');
    return res.json();
  },

  async createOrder(email, items) {
    const res = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, items }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Erreur lors de la création de la commande');
    }
    return res.json();
  },
};

window.Api = Api;
