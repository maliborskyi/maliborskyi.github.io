document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('cart-content-area');
    let products = [];

    const t = key => ShopI18n.t(key);
    const isEnglish = () => ShopI18n.getLanguage() === 'en';

    const money = price =>
        Number(price).toFixed(2) + ' ' + t('currency');

    function getCart() {
        try {
            return JSON.parse(localStorage.getItem('cart')) || [];
        } catch {
            return [];
        }
    }

    function addCell(row, text) {
        const cell = document.createElement('td');
        cell.textContent = text;
        row.append(cell);
        return cell;
    }

    function renderCart() {
        const cart = getCart();

        container.replaceChildren();

        // Порожній кошик
        if (!cart.length) {
            const empty = document.createElement('p');
            empty.className = 'empty-cart-text';
            empty.textContent = t('emptyCartText');

            const wrapper = document.createElement('div');
            wrapper.className = 'empty-cart-btn-wrapper';

            const link = document.createElement('a');
            link.href = 'index.html';
            link.className = 'btn buy empty-cart-link';
            link.textContent = t('backToShopping');

            wrapper.append(link);
            container.append(empty, wrapper);

            return;
        }

        const heading = document.createElement('p');
        heading.className = 'cart-selected-title';
        heading.textContent = t('selectedItems');

        container.append(heading);

        // Таблиця товарів
        const table = document.createElement('table');
        table.className = 'cart-table';

        const thead = document.createElement('thead');
        const thRow = document.createElement('tr');

        [
            'number',
            'productName',
            'unitPrice',
            'quantity',
            'sum',
            'actions'
        ].forEach(key => {
            const th = document.createElement('th');
            th.textContent = t(key);
            thRow.append(th);
        });

        thead.append(thRow);
        table.append(thead);

        const tbody = document.createElement('tbody');

        let totalSum = 0;

        cart.forEach((item, index) => {
            const sum = Number(item.price) * Number(item.qty);
            totalSum += sum;

            const tr = document.createElement('tr');

            addCell(tr, String(index + 1));

            
            const product = products.find(
                p => String(p.id) === String(item.id)
            );

            if (product) {
                addCell(
                    tr,
                    isEnglish() ? product.nameEn : product.name
                );
            } else {
                addCell(
                    tr,
                    isEnglish() ? (item.nameEn || item.name) : item.name
                );
            }


            addCell(tr, money(item.price));

            // Зміна кількості
            const qtyCell = document.createElement('td');
            const input = document.createElement('input');

            input.type = 'number';
            input.className = 'qty-input';
            input.min = '1';
            input.max = '99';
            input.value = item.qty;
            input.setAttribute('aria-label', t('quantity'));

            const hint = document.createElement('small');
            hint.className = 'qty-hint';
            hint.textContent = t('changeQuantity');

            qtyCell.append(
                input,
                document.createElement('br'),
                hint
            );

            tr.append(qtyCell);

            input.addEventListener('change', () => {
                const value = parseInt(input.value, 10);

                if (!Number.isInteger(value) ||
                    value < 1 || value > 99) {
                    input.value = item.qty;
                    return;
                }

                cart[index].qty = value;
                localStorage.setItem('cart', JSON.stringify(cart));

                renderCart();
            });

            addCell(tr, money(sum));

            // Видалення товару
            const actionCell = document.createElement('td');
            const remove = document.createElement('button');

            remove.className = 'delete-btn';
            remove.textContent = t('remove');

            remove.addEventListener('click', () => {
                cart.splice(index, 1);

                localStorage.setItem(
                    'cart',
                    JSON.stringify(cart)
                );

                renderCart();
            });

            actionCell.append(remove);
            tr.append(actionCell);
            tbody.append(tr);
        });

        table.append(tbody);
        container.append(table);

        // Загальна сума
        const total = document.createElement('div');
        total.className = 'cart-total';
        total.textContent = t('total') + ' ';

        const number = document.createElement('span');
        number.id = 'total-amount';
        number.textContent = money(totalSum);

        total.append(number);
        container.append(total);

        // Кнопки кошика
        const actions = document.createElement('div');
        actions.className = 'cart-actions';

        const back = document.createElement('a');
        back.className = 'btn coming-soon';
        back.href = 'index.html';
        back.textContent = t('backToShopping');

        const pay = document.createElement('button');
        pay.className = 'btn buy';
        pay.textContent = t('pay');

        pay.addEventListener('click', () => {
            // Імітація оплати
            alert(t('paidMessage'));

            localStorage.removeItem('cart');
            window.location.href = 'index.html';
        });

        actions.append(back, pay);
        container.append(actions);
    }

    // Оновлення кошика після зміни мови
    window.addEventListener('shop-language-changed', renderCart);

    
    await ShopI18n.initialize();

    // Завантаження товарів із JSON
    try {
        const response = await fetch('./products.json');

        if (!response.ok) {
            throw new Error('HTTP ' + response.status);
        }

        const data = await response.json();
        products = data.products;

    } catch (error) {
        console.error('Помилка завантаження товарів:', error);
    }

    renderCart();
});
