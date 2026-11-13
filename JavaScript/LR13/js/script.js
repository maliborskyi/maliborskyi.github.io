document.addEventListener('DOMContentLoaded', () => {
    // Елементи DOM
    const cartIcon = document.getElementById('cart-icon');
    const cartBadge = document.getElementById('cart-badge');
    const productContainer = document.getElementById('product-container');
    const catalogTitle = document.getElementById('catalog-title');
    const loadStatus = document.getElementById('load-status');

    // Модальні вікна
    const qtyModal = document.getElementById('qty-modal');
    const successModal = document.getElementById('success-modal');
    const emptyCartModal = document.getElementById('empty-cart-modal');

    // Кнопки та поля модальних вікон
    const modalProductTitle = document.getElementById('modal-product-title');
    const productQtyInput = document.getElementById('product-qty-input');
    const confirmAddBtn = document.getElementById('confirm-add-btn');
    const cancelQtyBtn = document.getElementById('cancel-qty-btn');
    const gotoCartModalBtn = document.getElementById('goto-cart-modal-btn');
    const continueShoppingBtn = document.getElementById('continue-shopping-btn');
    const closeEmptyModalBtn = document.getElementById('close-empty-modal-btn');

    let selectedProduct = null;

    // Створення однієї картки товару з даних JSON
    function createProductCard(product) {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.dataset.id = String(product.id);
        card.dataset.name = product.name;
        card.dataset.price = String(product.price);
        card.title = product.description || '';

        if (product.badge) {
            const badge = document.createElement('div');
            badge.className = 'badge ' + (product.badgeType === 'hit' ? 'hit' : 'new');
            badge.textContent = product.badge;
            card.append(badge);
        }

        const category = document.createElement('p');
        category.className = 'category';
        category.textContent = product.category;
        card.append(category);

        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'image-wrapper';

        const image = document.createElement('img');
        image.src = product.image;
        image.alt = product.name;
        image.loading = 'lazy';

        imageWrapper.append(image);
        card.append(imageWrapper);

        const name = document.createElement('h3');
        name.className = 'product-name';
        name.textContent = product.name;
        card.append(name);

        const priceBlock = document.createElement('div');
        priceBlock.className = 'price-block';

        if (product.oldPrice) {
            const oldPrice = document.createElement('span');
            oldPrice.className = 'old-price';
            oldPrice.textContent = product.oldPrice + ' ГРН';
            priceBlock.append(oldPrice);
        }

        const price = document.createElement('span');
        price.className = 'current-price';
        price.textContent = product.price + ' ГРН';

        priceBlock.append(price);
        card.append(priceBlock);

        const buyButton = document.createElement('button');
        buyButton.className = 'btn buy add-to-cart-btn';
        buyButton.type = 'button';
        buyButton.textContent = 'У КОРЗИНУ';
        card.append(buyButton);

        return card;
    }

    // Отримання товарів за допомогою fetch() з JSON
    async function loadProducts() {
        loadStatus.textContent = 'Завантаження товарів...';

        try {
            const response = await fetch('./products.json');

            if (!response.ok) {
                throw new Error('HTTP ' + response.status);
            }

            const data = await response.json();

            if (!Array.isArray(data.products)) {
                throw new Error('Неправильний формат JSON');
            }

            catalogTitle.textContent = data.title;

            const fragment = document.createDocumentFragment();

            data.products.forEach(product => {
                fragment.append(createProductCard(product));
            });

            productContainer.replaceChildren(fragment);

            loadStatus.textContent = data.products.length === 0
                ? 'Товарів поки немає.'
                : '';

        } catch (error) {
            console.error('Помилка отримання товарів:', error);

            productContainer.replaceChildren();

            loadStatus.textContent =
                'Не вдалося завантажити товари. Перевірте GitHub Pages, products.json і з’єднання з інтернетом.';
        }
    }

    // Кошик і модальні вікна
    function updateCartBadge() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartBadge.textContent = cart.length;
    }

    updateCartBadge();

    cartIcon.addEventListener('click', () => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        if (cart.length === 0) {
            emptyCartModal.classList.add('active');
        } else {
            window.location.href = 'cart.html';
        }
    });

    closeEmptyModalBtn.addEventListener('click', () => {
        emptyCartModal.classList.remove('active');
    });

    // Делегування події: кнопки з'являються після отримання JSON
    productContainer.addEventListener('click', (event) => {
        const button = event.target.closest('.add-to-cart-btn');

        if (!button) return;

        const card = button.closest('.product-card');

        selectedProduct = {
            id: card.dataset.id,
            name: card.dataset.name,
            price: parseFloat(card.dataset.price)
        };

        modalProductTitle.textContent = selectedProduct.name;
        productQtyInput.value = 1;
        qtyModal.classList.add('active');
    });

    cancelQtyBtn.addEventListener('click', () => {
        qtyModal.classList.remove('active');
    });

    confirmAddBtn.addEventListener('click', () => {
        if (!selectedProduct) return;

        const qty = Math.max(
            1,
            Math.min(99, parseInt(productQtyInput.value, 10) || 1)
        );

        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        const existingIndex = cart.findIndex(
            item => item.id === selectedProduct.id
        );

        if (existingIndex > -1) {
            cart[existingIndex].qty += qty;
        } else {
            cart.push({
                id: selectedProduct.id,
                name: selectedProduct.name,
                price: selectedProduct.price,
                qty: qty
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));

        updateCartBadge();

        qtyModal.classList.remove('active');
        successModal.classList.add('active');
    });

    gotoCartModalBtn.addEventListener('click', () => {
        window.location.href = 'cart.html';
    });

    continueShoppingBtn.addEventListener('click', () => {
        successModal.classList.remove('active');
    });

    loadProducts();
});
