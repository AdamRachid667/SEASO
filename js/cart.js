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
    const existing = cart.find(
      (item) => item.product_id === product.id && item.size === size
    );
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        product_id: product.id,
        slug: product.slug,
        name: product.name,
        size,
        quantity,
        price_cents: product.price_cents,
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
      cart[index].quantity = qty;
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
