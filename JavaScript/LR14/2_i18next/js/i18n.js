// Варіант 2: бібліотека i18next
const ShopI18n = (() => {
    const KEY = 'autoShopLanguage_i18next';

    let language = 'uk';
    let ready = false;

    async function loadResources() {
        if (ready) return;

        if (typeof i18next === 'undefined') {
            throw new Error('i18next CDN не завантажився');
        }

        const [ukResponse, enResponse] = await Promise.all([
            fetch('./locales/uk.json'),
            fetch('./locales/en.json')
        ]);

        if (!ukResponse.ok || !enResponse.ok) {
            throw new Error('Cannot load locale JSON');
        }

        const [uk, en] = await Promise.all([
            ukResponse.json(),
            enResponse.json()
        ]);

        await i18next.init({
            lng: 'uk',
            fallbackLng: 'uk',
            debug: false,
            resources: {
                uk: { translation: uk },
                en: { translation: en }
            }
        });

        ready = true;
    }

    async function setLanguage(nextLanguage) {
        if (!['uk', 'en'].includes(nextLanguage)) return;

        await loadResources();
        await i18next.changeLanguage(nextLanguage);

        language = nextLanguage;
        localStorage.setItem(KEY, nextLanguage);
        document.documentElement.lang = nextLanguage;

        document.querySelector('#language-selector').value = nextLanguage;

        document.querySelectorAll('[data-i18n]').forEach(element => {
            element.textContent = t(element.dataset.i18n);
        });

        window.dispatchEvent(new Event('shop-language-changed'));
    }

    function t(key) {
        return ready ? i18next.t(key) : key;
    }

    async function initialize() {
        const selector = document.querySelector('#language-selector');
        const modal = document.querySelector('#language-modal');
        const errorText = document.querySelector('#language-error');

        selector.addEventListener('change', async () => {
            try {
                await setLanguage(selector.value);
            } catch (error) {
                console.error('i18next error:', error);
                selector.value = language;

                alert('Не вдалося змінити мову / Could not change language.');
            }
        });

        const saved = localStorage.getItem(KEY);

        if (saved === 'uk' || saved === 'en') {
            try {
                await setLanguage(saved);
                return;
            } catch (error) {
                console.error('i18next error:', error);
            }
        }

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
                        console.error('i18next error:', error);

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
