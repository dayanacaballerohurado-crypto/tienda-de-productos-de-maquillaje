const WHATSAPP_NUMBER = "59169631445"; 

const products = [
    { id: 1, name: "Base de Maquillaje Matte Fluid", category: "Maquillaje", price: 140, img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400" },
    { id: 2, name: "Labial Matte Red Velvet", category: "Maquillaje", price: 85, img: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400" },
    { id: 3, name: "Paleta de Sombras Nude Glow", category: "Maquillaje", price: 180, img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400" },
    { id: 4, name: "Rímel Volumen Waterproof", category: "Maquillaje", price: 95, img: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400" },
    { id: 5, name: "Sérum Ácido Hialurónico", category: "Cuidado Facial", price: 160, img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400" },
    { id: 6, name: "Crema Hidratante Facial", category: "Cuidado Facial", price: 130, img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400" },
    { id: 7, name: "Set 8 Brochas Profesionales", category: "Accesorios", price: 120, img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400" },
    { id: 8, name: "Esponja Blender Pink", category: "Accesorios", price: 35, img: "https://images.unsplash.com/photo-1531608218688-294723145455?w=400" }
];

let cart = JSON.parse(localStorage.getItem('glow_cart')) || [];

function renderProducts(filter = 'todos') {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';
    
    const filtered = filter === 'todos' 
        ? products 
        : products.filter(p => p.category === filter);

    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${p.img}" alt="${p.name}" class="product-img">
            <div class="product-info">
                <span class="product-tag">${p.category}</span>
                <h3 class="product-title">${p.name}</h3>
                <div class="product-price">Bs. ${p.price.toFixed(2)}</div>
                <button class="btn-add" onclick="addToCart(${p.id})">Agregar al Carrito</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterCategory(cat, btn) {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProducts(cat);
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const item = cart.find(i => i.id === productId);

    if (item) {
        item.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    saveAndUpdate();
    toggleCart(true);
}

function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
    }
    saveAndUpdate();
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    saveAndUpdate();
}

function saveAndUpdate() {
    localStorage.setItem('glow_cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const container = document.getElementById('cartItems');
    const countEl = document.getElementById('cartCount');
    const totalEl = document.getElementById('cartTotal');

    container.innerHTML = '';
    let total = 0;
    let totalItems = 0;

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#888; margin-top:2rem;">Tu carrito está vacío</p>';
    } else {
        cart.forEach(item => {
            total += item.price * item.qty;
            totalItems += item.qty;

            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <img src="${item.img}" class="cart-item-img">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">Bs. ${(item.price * item.qty).toFixed(2)}</div>
                    <div class="cart-item-controls">
                        <button class="btn-qty" onclick="changeQty(${item.id}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button class="btn-qty" onclick="changeQty(${item.id}, 1)">+</button>
                        <button class="btn-remove" onclick="removeFromCart(${item.id})">Eliminar</button>
                    </div>
                </div>
            `;
            container.appendChild(div);
        });
    }

    countEl.textContent = totalItems;
    totalEl.textContent = `Bs. ${total.toFixed(2)}`;
}

function toggleCart(forceOpen = false) {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (forceOpen) {
        drawer.classList.add('open');
        overlay.classList.add('open');
    } else {
        drawer.classList.toggle('open');
        overlay.classList.toggle('open');
    }
}

function openCheckout() {
    if (cart.length === 0) {
        alert('Agrega al menos un producto al carrito antes de continuar.');
        return;
    }
    toggleCart();
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    document.getElementById('modalTotal').textContent = `Bs. ${total.toFixed(2)}`;
    document.getElementById('checkoutModal').classList.add('open');
}

function closeCheckout() {
    document.getElementById('checkoutModal').classList.remove('open');
}

function sendWhatsAppOrder(e) {
    e.preventDefault();

    const name = document.getElementById('clientName').value;
    const city = document.getElementById('clientCity').value;
    const address = document.getElementById('clientAddress').value;

    let total = 0;
    let itemList = "";

    cart.forEach(item => {
        const subtotal = item.price * item.qty;
        total += subtotal;
        itemList += `• ${item.name} (x${item.qty}) - Bs. ${subtotal.toFixed(2)}
`;
    });

    const message = `✨ *NUEVO PEDIDO - GLOW & GLAM* ✨

` +
        `👤 *Cliente:* ${name}
` +
        `📍 *Ciudad:* ${city}
` +
        `🏠 *Dirección:* ${address}

` +
        `🛍️ *Detalle del Pedido:*
${itemList}
` +
        `💰 *TOTAL MONTO FIJO PAGADO:* Bs. ${total.toFixed(2)}

` +
        `💳 *Titular QR Yape:* Aidee Nayely Flores Loza
` +
        `📌 *Comprobante de Pago:* (Adjunto foto en el chat)`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    cart = [];
    saveAndUpdate();
    closeCheckout();

    window.open(whatsappURL, '_blank');
}

renderProducts();
updateCartUI();
