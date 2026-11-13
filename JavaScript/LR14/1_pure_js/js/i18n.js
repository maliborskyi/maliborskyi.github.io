// Варіант 1: чистий JavaScript
const ShopI18n = (() => {
    const KEY = 'autoShopLanguage_pure';

    let language = 'uk';
    let translations = {};

    async function setLanguage(nextLanguage) {
        if (!['uk', 'en'].includes(nextLanguage)) return;

        const response = await fetch(`./locales/${nextLanguage}.json`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const texts = await response.json();

        translations = texts;
        language = nextLanguage;

        localStorage.setItem(KEY, nextLanguage);
        document.documentElement.lang = nextLanguage;

        document.querySelector('#language-selector').value = nextLanguage;

        // Оновлення текстів сторінки
        document.querySelectorAll('[data-i18n]').forEach(element => {
            element.textContent = t(element.dataset.i18n);
        });

        window.dispatchEvent(new Event('shop-language-changed'));
    }

    function t(key) {
        return translations[key] ?? key;
    }

    async function initialize() {
        const selector = document.querySelector('#language-selector');
        const modal = document.querySelector('#language-modal');
        const errorText = document.querySelector('#language-error');

        // Перемикання мови на сторінці
        selector.addEventListener('change', async () => {
            try {
                await setLanguage(selector.value);
            } catch (error) {
                console.error('Locale error:', error);
                selector.value = language;
                alert(t('languageError'));
            }
        });

        // Перевірка збереженої мови
        const saved = localStorage.getItem(KEY);

        if (saved === 'uk' || saved === 'en') {
            try {
                await setLanguage(saved);
                return;
            } catch (error) {
                console.error('Locale error:', error);
            }
        }

        // Перше відвідування: показуємо вибір мови
        modal.classList.add('active');

        return new Promise(resolve => {
            modal.querySelectorAll('[data-language]').forEach(button => {
                button.addEventListener('click', async () => {
                    try {
                        await setLanguage(button.dataset.language);

                        modal.classList.remove('active');
                        errorText.textContent = '';
                        resolve();
                    } catch (error) {
                        console.error('Locale error:', error);

                        errorText.textContent =
                            'Не вдалося завантажити переклад. Перевірте інтернет-з’єднання та файли локалізації.';
                    }
                });
            });
        });
    }

    return {
        initialize,
        t,
        getLanguage: () => language
    };
})();
