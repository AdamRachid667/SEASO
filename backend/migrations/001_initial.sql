CREATE TABLE IF NOT EXISTS products (
    id          INTEGER PRIMARY KEY,
    slug        TEXT UNIQUE NOT NULL,
    name        TEXT NOT NULL,
    wonder      TEXT NOT NULL,
    description TEXT NOT NULL,
    price_cents INTEGER NOT NULL,
    image_url   TEXT NOT NULL,
    active      INTEGER NOT NULL DEFAULT 1,
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS product_sizes (
    product_id  INTEGER NOT NULL,
    size        TEXT NOT NULL,
    in_stock    INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (product_id, size),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS orders (
    id                  INTEGER PRIMARY KEY,
    email               TEXT NOT NULL,
    stripe_session_id   TEXT UNIQUE,
    status              TEXT NOT NULL DEFAULT 'pending',
    total_cents         INTEGER NOT NULL,
    shipping_name       TEXT,
    shipping_address    TEXT,
    created_at          TEXT NOT NULL DEFAULT (datetime('now')),
    paid_at             TEXT
);

CREATE TABLE IF NOT EXISTS order_items (
    id               INTEGER PRIMARY KEY,
    order_id         INTEGER NOT NULL,
    product_id       INTEGER NOT NULL,
    size             TEXT NOT NULL,
    quantity         INTEGER NOT NULL DEFAULT 1,
    unit_price_cents INTEGER NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_stripe ON orders(stripe_session_id);

INSERT INTO products (slug, name, wonder, description, price_cents, image_url) VALUES
('grande-muraille',   'La Grande Muraille',   'Grande Muraille de Chine',  'T-shirt 100% coton bio illustrant la majestueuse Grande Muraille de Chine. Coupe unisexe, impression eco-responsable.', 3500, '/images/products/grande-muraille.webp'),
('petra',             'Petra',                'Cite de Petra',             'T-shirt 100% coton bio aux couleurs de la cite rose de Petra. Coupe unisexe, impression eco-responsable.',              3500, '/images/products/petra.webp'),
('christ-redempteur', 'Le Christ Redempteur', 'Christ Redempteur de Rio',  'T-shirt 100% coton bio inspire du Christ Redempteur de Rio. Coupe unisexe, impression eco-responsable.',               3500, '/images/products/christ-redempteur.webp'),
('machu-picchu',      'Le Machu Picchu',      'Machu Picchu',              'T-shirt 100% coton bio evoquant les ruines mystiques du Machu Picchu. Coupe unisexe, impression eco-responsable.',      3500, '/images/products/machu-picchu.webp'),
('chichen-itza',      'Chichen Itza',         'Pyramide de Kukulcan',      'T-shirt 100% coton bio orne de la pyramide de Kukulcan. Coupe unisexe, impression eco-responsable.',                   3500, '/images/products/chichen-itza.webp'),
('colisee',           'Le Colisee',           'Colisee de Rome',           'T-shirt 100% coton bio celebrant le Colisee de Rome. Coupe unisexe, impression eco-responsable.',                      3500, '/images/products/colisee.webp'),
('taj-mahal',         'Le Taj Mahal',         'Taj Mahal',                 'T-shirt 100% coton bio inspire de la splendeur du Taj Mahal. Coupe unisexe, impression eco-responsable.',              3500, '/images/products/taj-mahal.webp');

INSERT INTO product_sizes (product_id, size) VALUES
(1, 'S'), (1, 'M'), (1, 'L'), (1, 'XL'),
(2, 'S'), (2, 'M'), (2, 'L'), (2, 'XL'),
(3, 'S'), (3, 'M'), (3, 'L'), (3, 'XL'),
(4, 'S'), (4, 'M'), (4, 'L'), (4, 'XL'),
(5, 'S'), (5, 'M'), (5, 'L'), (5, 'XL'),
(6, 'S'), (6, 'M'), (6, 'L'), (6, 'XL'),
(7, 'S'), (7, 'M'), (7, 'L'), (7, 'XL');
