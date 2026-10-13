// DOM
const tabsContainer = document.querySelector('#tabs');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

const topLeft = document.querySelector('#top-left');
const topRight = document.querySelector('#top-right');
const bottomRight = document.querySelector('#bottom-right');
const bottomLeft = document.querySelector('#bottom-left');

const topLeftValue = document.querySelector('#top-left-value');
const topRightValue = document.querySelector('#top-right-value');
const bottomRightValue = document.querySelector('#bottom-right-value');
const bottomLeftValue = document.querySelector('#bottom-left-value');

const preview = document.querySelector('#preview');
const previewButton = document.querySelector('#preview-button');
const coordinates = document.querySelector('#coordinates');

const cssCode = document.querySelector('#css-code');
const copyButton = document.querySelector('#copy-button');
const copyMessage = document.querySelector('#copy-message');

const presetForm = document.querySelector('#preset-form');
const presetName = document.querySelector('#preset-name');
const presetError = document.querySelector('#preset-error');
const scrollTopButton = document.querySelector('#scroll-top');

const property2Controls = document.querySelector('#property-2-controls');
const property3Controls = document.querySelector('#property-3-controls');

property2Controls.innerHTML = `
    <div class="control">
        <label for="margin-size">Margin</label>
        <input id="margin-size" type="range" min="0" max="50" value="0">
        <span id="margin-value">0 px</span>
    </div>
`;

property3Controls.innerHTML = `
    <div class="control">
        <label for="text-align-select">Text Align</label>
        <select id="text-align-select" style="padding: 5px; width: 100%;">
            <option value="left">left</option>
            <option value="center">center</option>
            <option value="right">right</option>
        </select>
    </div>
`;

const marginSize = document.querySelector('#margin-size');
const marginValue = document.querySelector('#margin-value');
const textAlignSelect = document.querySelector('#text-align-select');


// TABS 
function hideTabs() {
    tabs.forEach(function (tab) {
        tab.classList.remove('active');
    });
    tabContents.forEach(function (content) {
        content.classList.remove('active');
    });
}

function showTab(tabName) {
    const tab = document.querySelector(`[data-tab="${tabName}"]`);
    const content = document.querySelector(`[data-content="${tabName}"]`);
    if (tab) tab.classList.add('active');
    if (content) content.classList.add('active');
}

tabsContainer.addEventListener('click', function (event) {
    if (!event.target.classList.contains('tab')) {
        return;
    }

    // Аналіз об'єкта event
    console.log('Тип:', event.type);
    console.log('Target:', event.target);
    console.log('CurrentTarget:', event.currentTarget);

    const tabName = event.target.dataset.tab;
    hideTabs();
    showTab(tabName);
});


// Генерація CSS (Border Radius, Margin, Text Align)
function generateCSS() {
    const tl = topLeft.value;
    const tr = topRight.value;
    const br = bottomRight.value;
    const bl = bottomLeft.value;

    topLeftValue.textContent = `${tl} px`;
    topRightValue.textContent = `${tr} px`;
    bottomRightValue.textContent = `${br} px`;
    bottomLeftValue.textContent = `${bl} px`;

    const radius = `${tl}px ${tr}px ${br}px ${bl}px`;
    preview.style.borderRadius = radius;

    const margin = marginSize.value;
    marginValue.textContent = `${margin} px`;
    preview.style.margin = `${margin}px`;

    const textAlign = textAlignSelect.value;
    preview.style.textAlign = textAlign;

    if (textAlign === 'left') {
        preview.style.alignItems = 'flex-start';
    } else if (textAlign === 'center') {
        preview.style.alignItems = 'center';
    } else if (textAlign === 'right') {
        preview.style.alignItems = 'flex-end';
    }

    // Генерація результуючого CSS-коду
    cssCode.value = `border-radius: ${radius};\nmargin: ${margin}px;\ntext-align: ${textAlign};`;
}

[topLeft, topRight, bottomRight, bottomLeft, marginSize].forEach(function (input) {
    input.addEventListener('input', generateCSS);
});

textAlignSelect.addEventListener('change', generateCSS);

// Початкова генерація
generateCSS();


// Функця копіювання CSS-коду в буфер обміну
function copyCSS() {
    navigator.clipboard.writeText(cssCode.value).then(function () {
        copyMessage.textContent = 'CSS-код скопійовано';
        setTimeout(function () {
            copyMessage.textContent = '';
        }, 3000);
    }).catch(function (err) {
        console.error('Помилка копіювання:', err);
    });
}

copyButton.addEventListener('click', copyCSS);


// Form та валідація
presetName.addEventListener('focus', function () {
    presetName.classList.add('focused');
});

presetName.addEventListener('blur', function () {
    presetName.classList.remove('focused');
    if (presetName.value.trim() === '') {
        presetName.classList.add('error');
        presetError.textContent = 'Введіть назву пресета';
    } else {
        presetName.classList.remove('error');
        presetError.textContent = '';
    }
});

function handlePresetSubmit(event) {
    event.preventDefault(); // Скасування стандартної дії форми

    if (presetName.value.trim() === '') {
        presetName.classList.add('error');
        presetError.textContent = 'Введіть назву пресета';
        return;
    }

    presetName.classList.remove('error');
    presetError.textContent = '';

    console.log(`Пресет: ${presetName.value.trim()}`);
    console.log(cssCode.value);
}

presetForm.addEventListener('submit', handlePresetSubmit);


// Функція для кнопки Escape
function handleKeyDown(event) {
    if (event.key === 'Escape') {
        [topLeft, topRight, bottomRight, bottomLeft, marginSize].forEach(function (input) {
            input.value = 0;
        });
        textAlignSelect.value = 'left';
        generateCSS();
        console.log('Натиснуто Escape: параметри скинуто');
    }
}

document.addEventListener('keydown', handleKeyDown);

// Події миші, координати та поширення подій
preview.addEventListener('mouseover', function () {
    preview.classList.add('hovered');
});

preview.addEventListener('mouseout', function () {
    preview.classList.remove('hovered');
});

preview.addEventListener('mousemove', function (event) {
    coordinates.textContent = `X: ${event.clientX}; Y: ${event.clientY}`;
    console.log(`clientX: ${event.clientX}, clientY: ${event.clientY} | pageX: ${event.pageX}, pageY: ${event.pageY}`);
});

preview.addEventListener('click', function () {
    console.log('Preview click');
});

previewButton.addEventListener('click', function (event) {
    event.stopPropagation(); 
    console.log('Button click');
});


// Функція Scroll миші
function handleScroll() {
    if (window.scrollY > 300) {
        scrollTopButton.classList.add('visible');
    } else {
        scrollTopButton.classList.remove('visible');
    }
}

window.addEventListener('scroll', handleScroll);

// Повернення на початок сторінки
scrollTopButton.addEventListener('click', function () {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
