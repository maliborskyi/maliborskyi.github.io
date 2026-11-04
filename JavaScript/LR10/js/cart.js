document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('cart-content-area');

    function renderCart() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        if (cart.length === 0) {
            container.innerHTML = `
                <p class="empty-cart-text">Ваша корзина пуста.</p>
                <div class="empty-cart-btn-wrapper">
                    <a href="index.html" class="btn buy empty-cart-link">Повернутись до покупок</a>
                </div>
            `;
            return;
        }

        let html = `
            <p class="cart-selected-title">Ви обрали:</p>
            <table class="cart-table">
                <thead>
                    <tr>
                        <th>№</th>
                        <th>Назва товару</th>
                        <th>Ціна за од.</th>
                        <th>К-сть</th>
                        <th>Сума</th>
                        <th>Дії</th>
                    </tr>
                </thead>
                <tbody>
        `;

        let totalSum = 0;

        cart.forEach((item, index) => {
            let itemSum = item.price * item.qty;
            totalSum += itemSum;

            html += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.name}</td>
                    <td>${item.price.toFixed(2)} грн</td>
                    <td>
                        <input type="number" class="qty-input" data-index="${index}" value="${item.qty}" min="1" max="99">
                        <br><small class="qty-hint">(змінити к-сть)</small>
                    </td>
                    <td>${itemSum.toFixed(2)} грн</td>
                    <td><button class="delete-btn" data-index="${index}">(видалити)</button></td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
            <div class="cart-total">
                Разом до оплати: <span id="total-amount">${totalSum.toFixed(2)}</span> грн.
            </div>
            <div class="cart-actions">
                <a href="index.html" class="btn coming-soon">Повернутись до покупок</a>
                <button class="btn buy" id="pay-btn">Оплатити</button>
            </div>
        `;

        container.innerHTML = html;

        // Обробка зміни кількості товару
        document.querySelectorAll('.qty-input').forEach(input => {
            input.addEventListener('change', (e) => {
                let idx = e.target.dataset.index;
                let newQty = parseInt(e.target.value);
                if (newQty > 0) {
                    cart[idx].qty = newQty;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    renderCart();
                }
            });
        });

        // Обробка видалення товару з корзини
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                let idx = e.target.dataset.index;
                cart.splice(idx, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            });
        });

        // Кнопка підтвердження оплати
        const payBtn = document.getElementById('pay-btn');
        if (payBtn) {
            payBtn.addEventListener('click', () => {
                alert('Дякуємо за замовлення! Оплата пройшла успішно.');
                localStorage.removeItem('cart');
                window.location.href = 'index.html';
            });
        }
    }

    renderCart();
});