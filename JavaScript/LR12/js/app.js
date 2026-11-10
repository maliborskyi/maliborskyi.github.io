
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://bbdaidzjarjcxlwdyiyf.supabase.co';
const SUPABASE_KEY = 'sb_publishable_IGMVX4FmiqwcNF3NtH66_A_M4tOb6C0';

// Отримання HTML-елементів
const ui = {
  count: document.querySelector('#count'),
  status: document.querySelector('#status'),
  list: document.querySelector('#products-list'),
  empty: document.querySelector('#empty-message'),
  search: document.querySelector('#search'),
  categoryFilter: document.querySelector('#filter-category'),
  sort: document.querySelector('#sort'),
  refreshButton: document.querySelector('#refresh-btn'),
  form: document.querySelector('#product-form'),
  title: document.querySelector('#product-title'),
  brand: document.querySelector('#product-brand'),
  category: document.querySelector('#product-category'),
  price: document.querySelector('#product-price'),
  submitButton: document.querySelector('#submit-btn'),
  formStatus: document.querySelector('#form-status')
};

const categories = ['Одяг', 'Взуття', 'Аксесуари'];

const money = new Intl.NumberFormat('uk-UA', {
  style: 'currency',
  currency: 'UAH',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
});

const collator = new Intl.Collator('uk-UA', {
  sensitivity: 'base'
});

let products = [];
let dataLoaded = false;
let db = null;
let loading = false;

// Повідомлення про завантаження
function setStatus(message, state = 'info') {
  ui.status.textContent = message;
  ui.status.dataset.state = state;
}

// Повідомлення для форми
function setFormStatus(message, state = 'info') {
  ui.formStatus.textContent = message;
  ui.formStatus.dataset.state = state;
}

// Пошук, фільтрація та сортування
function filteredProducts() {
  const query = ui.search.value.trim().toLocaleLowerCase('uk-UA');
  const category = ui.categoryFilter.value;

  const result = products.filter(product => {
    const text = `${product.title} ${product.brand}`.toLocaleLowerCase('uk-UA');

    return text.includes(query) &&
      (category === 'all' || product.category === category);
  });

  switch (ui.sort.value) {
    case 'title':
      result.sort((a, b) => collator.compare(a.title, b.title));
      break;

    case 'price_asc':
      result.sort((a, b) => Number(a.price) - Number(b.price));
      break;

    case 'price_desc':
      result.sort((a, b) => Number(b.price) - Number(a.price));
      break;

    default:
      result.sort((a, b) => Number(b.id) - Number(a.id));
  }

  return result;
}

// Відображення товарів на сторінці
function renderProducts() {
  if (!dataLoaded) return;

  const displayed = filteredProducts();
  const fragment = document.createDocumentFragment();

  displayed.forEach(product => {
    const li = document.createElement('li');

    const name = document.createElement('span');
    name.className = 'product-title';
    name.textContent = product.title;

    const info = document.createElement('span');
    info.className = 'product-meta';
    info.textContent = ` — ${product.brand} · ${product.category} · `;

    const price = document.createElement('span');
    price.className = 'product-price';
    price.textContent = money.format(Number(product.price));

    li.append(name, info, price);
    fragment.append(li);
  });

  ui.list.replaceChildren(fragment);

  ui.count.textContent =
    `Знайдено товарів: ${displayed.length}` +
    (displayed.length !== products.length
      ? ` (усього ${products.length})`
      : '');

  ui.empty.hidden = displayed.length > 0;

  if (displayed.length === 0) {
    ui.empty.textContent = products.length === 0
      ? 'У базі даних поки немає товарів. Додайте перший товар через форму.'
      : 'За вашим пошуком або фільтрами товари не знайдено.';
  }
}

// Отримання товарів із Supabase
async function loadProducts() {
  if (loading || !db) return false;

  loading = true;
  ui.refreshButton.disabled = true;

  setStatus('Завантаження товарів з Supabase...');

  try {
    const { data, error } = await db
      .from('products')
      .select('id, title, brand, category, price, created_at')
      .order('id', { ascending: true });

    if (error) throw error;

    products = data ?? [];
    dataLoaded = true;

    renderProducts();

    setStatus(
      'Дані успішно отримано з PostgreSQL через Supabase.',
      'success'
    );

    return true;
  } catch (error) {
    console.error('Помилка завантаження:', error);

    setStatus(
      'Помилка отримання даних. Перевірте інтернет, URL, ключ, таблицю та SELECT/RLS.',
      'error'
    );

    if (!dataLoaded) {
      ui.list.replaceChildren();
      ui.count.textContent = 'Знайдено товарів: —';
      ui.empty.hidden = true;
    }

    return false;
  } finally {
    loading = false;
    ui.refreshButton.disabled = false;
  }
}

// Перевірка полів форми
function validateForm() {
  const title = ui.title.value.trim();
  const brand = ui.brand.value.trim();
  const category = ui.category.value;
  const price = Number(ui.price.value);

  if (title.length < 2 || title.length > 120) {
    throw new Error(
      'Назва товару повинна містити від 2 до 120 символів.'
    );
  }

  if (brand.length < 2 || brand.length > 80) {
    throw new Error(
      'Бренд повинен містити від 2 до 80 символів.'
    );
  }

  if (!categories.includes(category)) {
    throw new Error('Оберіть категорію товару.');
  }

  if (
    !/^\d+(?:\.\d{1,2})?$/.test(ui.price.value.trim()) ||
    !Number.isFinite(price) ||
    price < 0.01 ||
    price > 999999.99
  ) {
    throw new Error(
      'Вкажіть коректну ціну від 0,01 до 999 999,99 грн (не більше двох цифр після коми).'
    );
  }

  return { title, brand, category, price };
}

// Додавання нового товару
ui.form.addEventListener('submit', async event => {
  event.preventDefault();

  if (!db || ui.submitButton.disabled) return;

  let item;

  try {
    item = validateForm();
  } catch (error) {
    setFormStatus(error.message, 'error');
    return;
  }

  ui.submitButton.disabled = true;
  ui.submitButton.textContent = 'Додавання...';

  setFormStatus('Збереження товару в Supabase...');

  try {
    const { error } = await db
      .from('products')
      .insert(item);

    if (error) throw error;

    // Очищення форми
    ui.form.reset();

    // Скидання пошуку та фільтрів
    ui.search.value = '';
    ui.categoryFilter.value = 'all';
    ui.sort.value = 'newest';

    setFormStatus(
      'Товар успішно додано до бази даних!',
      'success'
    );

    // Оновлення товарів без перезавантаження
    const reloaded = await loadProducts();

    if (!reloaded) {
      setFormStatus(
        'Товар додано, але список не вдалося оновити. Натисніть «Оновити».',
        'error'
      );
    }
  } catch (error) {
    console.error('Помилка додавання:', error);

    setFormStatus(
      'Помилка додавання. Перевірте інтернет, обмеження полів та INSERT/RLS. Введені дані збережено у формі.',
      'error'
    );
  } finally {
    ui.submitButton.disabled = false;
    ui.submitButton.textContent = 'Додати товар';
  }
});

// Обробники пошуку, фільтрації та сортування
ui.search.addEventListener('input', renderProducts);
ui.categoryFilter.addEventListener('change', renderProducts);
ui.sort.addEventListener('change', renderProducts);

ui.refreshButton.addEventListener('click', loadProducts);

// Перевірка налаштувань Supabase
const configured =
  SUPABASE_URL.startsWith('https://') &&
  !SUPABASE_URL.includes('YOUR_PROJECT_ID') &&
  SUPABASE_KEY.startsWith('sb_publishable_') &&
  !SUPABASE_KEY.includes('PASTE_YOUR_KEY');

if (!configured) {
  ui.submitButton.disabled = true;
  ui.refreshButton.disabled = true;

  setStatus(
    'Спочатку вкажіть Project URL та Publishable key у файлі script.js.',
    'error'
  );

  setFormStatus('Підключення ще не налаштоване.');
} else {
  db = createClient(SUPABASE_URL, SUPABASE_KEY);
  loadProducts();
}
