document.addEventListener('DOMContentLoaded', async () => {
    const cartIcon = document.getElementById('cart-icon');
    const cartBadge = document.getElementById('cart-badge');
    const productContainer = document.getElementById('product-container');
    const catalogTitle = document.getElementById('catalog-title');
    const loadStatus = document.getElementById('load-status');

    const qtyModal = document.getElementById('qty-modal');
    const successModal = document.getElementById('success-modal');
    const emptyCartModal = document.getElementById('empty-cart-modal');

    const modalProductTitle = document.getElementById('modal-product-title');
    const productQtyInput = document.getElementById('product-qty-input');
    const confirmAddBtn = document.getElementById('confirm-add-btn');
    const cancelQtyBtn = document.getElementById('cancel-qty-btn');
    const gotoCartModalBtn = document.getElementById('goto-cart-modal-btn');
    const continueShoppingBtn = document.getElementById('continue-shopping-btn');
    const closeEmptyModalBtn = document.getElementById('close-empty-modal-btn');

    let catalogData = null;
    let selectedProduct = null;

    const t = key => ShopI18n.t(key);

    const isEnglish = () => ShopI18n.getLanguage() === 'en';

    const localized = (object, field) =>
        (isEnglish() ? object[field + 'En'] : null) || object[field];

    // Створення картки товару
    function createProductCard(product) {
        const card = document.createElement('article');
        card.className = 'product-card';

        card.dataset.id = String(product.id);
        card.dataset.name = product.name;
        card.dataset.nameEn = product.nameEn || product.name;
        card.dataset.price = String(product.price);
        card.title = localized(product, 'description') || '';

        // Бейдж
        if (product.badge) {
            const badge = document.createElement('div');

            badge.className =
                'badge ' + (product.badgeType === 'hit' ? 'hit' : 'new');

            
            const badgeText = t(
                product.badgeType === 'hit' ? 'hitBadge' : 'newBadge'
            );

            if (product.badgeType === 'hit') {
                badgeText.split(' ').forEach(word => {
                    const line = document.createElement('span');
                    line.textContent = word;
                    badge.append(line);
                });
            } else {
                badge.textContent = badgeText;
            }

            card.append(badge);
        }

        // Категорія
        const category = document.createElement('p');
        category.className = 'category';
        category.textContent = localized(product, 'category');
        card.append(category);

        // Зображення
        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'image-wrapper';

        const image = document.createElement('img');
        image.src = product.image;
        image.alt = localized(product, 'name');
        image.loading = 'lazy';

        imageWrapper.append(image);
        card.append(imageWrapper);

        // Назва
        const name = document.createElement('h3');
        name.className = 'product-name';
        name.textContent = localized(product, 'name');
        card.append(name);

        // Ціна
        const priceBlock = document.createElement('div');
        priceBlock.className = 'price-block';

        if (product.oldPrice) {
            const oldPrice = document.createElement('span');
            oldPrice.className = 'old-price';

            oldPrice.textContent =
                product.oldPrice + ' ' + t('currency');

            priceBlock.append(oldPrice);
        }

        const price = document.createElement('span');
        price.className = 'current-price';

        price.textContent =
            product.price + ' ' + t('currency');

        priceBlock.append(price);
        card.append(priceBlock);

        // Кнопка додавання
        const buyButton = document.createElement('button');

        buyButton.className = 'btn buy add-to-cart-btn';
        buyButton.type = 'button';
        buyButton.textContent = t('addToCart');

        card.append(buyButton);

        return card;
    }

    // Перемальовування карток після зміни мови
    function renderProducts() {
        if (!catalogData) return;

        catalogTitle.textContent = isEnglish()
            ? (catalogData.titleEn || catalogData.title)
            : catalogData.title;

        const fragment = document.createDocumentFragment();

        catalogData.products.forEach(product => {
            fragment.append(createProductCard(product));
        });

        productContainer.replaceChildren(fragment);

        loadStatus.textContent = catalogData.products.length
            ? ''
            : t('emptyProducts');

        if (selectedProduct) {
            modalProductTitle.textContent = isEnglish()
                ? (selectedProduct.nameEn || selectedProduct.name)
                : selectedProduct.name;
        }

        cartIcon.setAttribute('aria-label', t('cartLabel'));
    }

    // Отримання товарів із JSON
    async function loadProducts() {
        loadStatus.textContent = t('loadingProducts');

        try {
            const response = await fetch('./products.json');

            if (!response.ok) {
                throw new Error('HTTP ' + response.status);
            }

            const data = await response.json();

            if (!Array.isArray(data.products)) {
                throw new Error('Incorrect JSON');
            }

            catalogData = data;
            renderProducts();
        } catch (error) {
            console.error('Помилка отримання товарів:', error);

            productContainer.replaceChildren();
            loadStatus.textContent = t('loadError');
        }
    }

    // Отримання кошика з localStorage
    function getCart() {
        try {
            return JSON.parse(localStorage.getItem('cart')) || [];
        } catch {
            return [];
        }
    }

    // Оновлення лічильника
    function updateCartBadge() {
        cartBadge.textContent = getCart().length;
    }

    // Відкриття кошика
    function openCart() {
        if (!getCart().length) {
            emptyCartModal.classList.add('active');
        } else {
            window.location.href = 'cart.html';
        }
    }

    cartIcon.addEventListener('click', openCart);

    cartIcon.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openCart();
        }
    });

    closeEmptyModalBtn.addEventListener('click', () => {
        emptyCartModal.classList.remove('active');
    });

    // Натискання кнопки "У корзину"
    productContainer.addEventListener('click', event => {
        const button = event.target.closest('.add-to-cart-btn');

        if (!button) return;

        const card = button.closest('.product-card');

        selectedProduct = {
            id: card.dataset.id,
            name: card.dataset.name,
            nameEn: card.dataset.nameEn,
            price: Number(card.dataset.price)
        };

        modalProductTitle.textContent = isEnglish()
            ? selectedProduct.nameEn
            : selectedProduct.name;

        productQtyInput.value = 1;
        qtyModal.classList.add('active');
    });

    // Скасування додавання
    cancelQtyBtn.addEventListener('click', () => {
        qtyModal.classList.remove('active');
    });

    // Підтвердження додавання
    confirmAddBtn.addEventListener('click', () => {
        if (!selectedProduct) return;

        const qty = Math.max(
            1,
            Math.min(99, parseInt(productQtyInput.value, 10) || 1)
        );

        const cart = getCart();

        const existingIndex = cart.findIndex(
            item => String(item.id) === selectedProduct.id
        );

        if (existingIndex >= 0) {
            cart[existingIndex].qty += qty;
        } else {
            cart.push({
                ...selectedProduct,
                qty
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

    // Зміна мови
    window.addEventListener('shop-language-changed', renderProducts);

    updateCartBadge();

    await ShopI18n.initialize();
    await loadProducts();
});
