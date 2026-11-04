document.addEventListener('DOMContentLoaded', () => {
    // Елементи DOM
    const cartIcon = document.getElementById('cart-icon');
    const cartBadge = document.getElementById('cart-badge');
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');

    // Модальні вікна
    const qtyModal = document.getElementById('qty-modal');
    const successModal = document.getElementById('success-modal');
    const emptyCartModal = document.getElementById('empty-cart-modal');

    // Кнопки та поля модалок
    const modalProductTitle = document.getElementById('modal-product-title');
    const productQtyInput = document.getElementById('product-qty-input');
    const confirmAddBtn = document.getElementById('confirm-add-btn');
    const cancelQtyBtn = document.getElementById('cancel-qty-btn');
    
    const gotoCartModalBtn = document.getElementById('goto-cart-modal-btn');
    const continueShoppingBtn = document.getElementById('continue-shopping-btn');
    const closeEmptyModalBtn = document.getElementById('close-empty-modal-btn');

    let selectedProduct = null;

    // Оновлення лічильника кількості товарів у кошику
    function updateCartBadge() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartBadge.textContent = cart.length; // Вказує кількість найменувань доданих товарів у кошику
    }

    updateCartBadge();

    // Клік по іконці корзини
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

    // Натискання "У КОРЗИНУ" на товарi
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            selectedProduct = {
                id: card.dataset.id,
                name: card.dataset.name,
                price: parseFloat(card.dataset.price)
            };

            modalProductTitle.textContent = selectedProduct.name;
            productQtyInput.value = 1;
            qtyModal.classList.add('active');
        });
    });

    // Скасування у модалці кількості
    cancelQtyBtn.addEventListener('click', () => {
        qtyModal.classList.remove('active');
    });

    // Підтвердження кількості товару
    confirmAddBtn.addEventListener('click', () => {
        const qty = parseInt(productQtyInput.value) || 1;
        
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Перевіряємо, чи є вже такий товар у корзині
        const existingIndex = cart.findIndex(item => item.id === selectedProduct.id);
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

    // Кнопки успішного додавання
    gotoCartModalBtn.addEventListener('click', () => {
        window.location.href = 'cart.html';
    });

    continueShoppingBtn.addEventListener('click', () => {
        successModal.classList.remove('active');
    });
});