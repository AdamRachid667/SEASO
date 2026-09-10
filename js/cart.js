const CART_KEY = 'seaso_cart';

const Cart = {
  getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      return [];
    }
  },

  _save(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  },

  addToCart(product, size, quantity) {
    const cart = this.getCart();
    const qty = Math.max(1, Math.min(10, Math.floor(quantity)));
    const pid = product.id || product.slug;
    const existing = cart.find(
      (item) => (item.product_id === pid || item.slug === product.slug) && item.size === size
    );
    if (existing) {
      existing.quantity = Math.min(existing.quantity + qty, 99);
    } else {
      cart.push({
        product_id: pid,
        slug: product.slug,
        name: product.name,
        size,
        quantity: qty,
        price_cents: Math.max(0, Math.floor(product.price_cents)),
        image_url: product.image_url,
      });
    }
    this._save(cart);
  },

  removeFromCart(index) {
    const cart = this.getCart();
    cart.splice(index, 1);
    this._save(cart);
  },

  updateQuantity(index, qty) {
    const cart = this.getCart();
    if (qty < 1) {
      cart.splice(index, 1);
    } else {
      cart[index].quantity = Math.min(qty, 99);
    }
    this._save(cart);
  },

  getCartCount() {
    return this.getCart().reduce((sum, item) => sum + item.quantity, 0);
  },

  getCartTotal() {
    return this.getCart().reduce(
      (sum, item) => sum + item.price_cents * item.quantity,
      0
    );
  },

  clearCart() {
    localStorage.removeItem(CART_KEY);
  },
};

window.Cart = Cart;
