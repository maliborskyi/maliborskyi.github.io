// Завдання 1
function initTask1() {
    const fahrenheitInput = document.getElementById('fahrenheit');
    const celsiusInput = document.getElementById('celsius');

    fahrenheitInput.addEventListener('input', function() {
        if (fahrenheitInput.value === '') {
            celsiusInput.value = '';
            return;
        }
        let f = parseFloat(fahrenheitInput.value);
        let c = (5 / 9) * (f - 32);
        celsiusInput.value = Math.round(c * 100) / 100;
    });

    celsiusInput.addEventListener('input', function() {
        if (celsiusInput.value === '') {
            fahrenheitInput.value = '';
            return;
        }
        let c = parseFloat(celsiusInput.value);
        let f = (c * 9 / 5) + 32;
        fahrenheitInput.value = Math.round(f * 100) / 100;
    });
}

// Завдання 2
function initTask2() {
    let correctCount = 0;
    let totalCount = 0;
    let num1 = 0, num2 = 0, currentAns = 0;

    const scoreEl = document.getElementById('quiz1-score');
    const taskEl = document.getElementById('quiz1-task');
    const answerInput = document.getElementById('quiz1-answer');
    const checkBtn = document.getElementById('quiz1-check-btn');
    const nextBtn = document.getElementById('quiz1-next-btn');
    const resultEl = document.getElementById('quiz1-result');

    function generateTask() {
        num1 = Math.floor(Math.random() * 9) + 1;
        num2 = Math.floor(Math.random() * 9) + 1;
        currentAns = num1 * num2;
        taskEl.textContent = `${num1} × ${num2} =`;
        answerInput.value = '';
        resultEl.textContent = '';
        checkBtn.disabled = false;
    }

    function updateScore() {
        let percent = totalCount === 0 ? 0 : Math.round((correctCount / totalCount) * 100);
        scoreEl.textContent = `Загальний рахунок ${percent}% (${correctCount} правильних відповідей з ${totalCount})`;
    }

    checkBtn.addEventListener('click', function() {
        if (answerInput.value.trim() === '') return;
        let userAns = parseInt(answerInput.value, 10);
        totalCount++;

        if (userAns === currentAns) {
            correctCount++;
            resultEl.textContent = 'Правильно!';
        } else {
            resultEl.textContent = `Помилка, правильна відповідь «${currentAns}»`;
        }
        updateScore();
        checkBtn.disabled = true; // Одна спроба на поточне завдання
    });

    nextBtn.addEventListener('click', generateTask);

    generateTask();
}

// Завдання 3
function initTask3() {
    let correctCount = 0;
    let totalCount = 0;
    let num1 = 0, num2 = 0, currentAns = 0;

    const scoreEl = document.getElementById('quiz2-score');
    const taskEl = document.getElementById('quiz2-task');
    const optionsContainer = document.getElementById('quiz2-options');
    const nextBtn = document.getElementById('quiz2-next-btn');
    const resultEl = document.getElementById('quiz2-result');

    function generateTask() {
        num1 = Math.floor(Math.random() * 9) + 1;
        num2 = Math.floor(Math.random() * 9) + 1;
        currentAns = num1 * num2;
        taskEl.textContent = `${num1} × ${num2} =`;
        resultEl.textContent = '';
        optionsContainer.innerHTML = '';

        // Генеруємо 4 унікальних варіанти відповідей
        let options = new Set();
        options.add(currentAns);

        while (options.size < 4) {
            let fakeAns = (Math.floor(Math.random() * 9) + 1) * (Math.floor(Math.random() * 9) + 1);
            options.add(fakeAns);
        }

        let optionsArray = Array.from(options).sort(() => Math.random() - 0.5);

        optionsArray.forEach(val => {
            let label = document.createElement('label');
            let radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'quiz2-radio';
            radio.value = val;

            radio.addEventListener('change', function() {
                totalCount++;
                let userAns = parseInt(this.value, 10);

                if (userAns === currentAns) {
                    correctCount++;
                    resultEl.textContent = 'Правильно!';
                } else {
                    resultEl.textContent = `Помилка, правильна відповідь «${currentAns}»`;
                }

                // Блокуємо всі радіокнопки після вибору
                const allRadios = optionsContainer.querySelectorAll('input[type="radio"]');
                allRadios.forEach(r => r.disabled = true);

                updateScore();
            });

            label.appendChild(radio);
            label.appendChild(document.createTextNode(` ${val}`));
            optionsContainer.appendChild(label);
        });
    }

    function updateScore() {
        let percent = totalCount === 0 ? 0 : Math.round((correctCount / totalCount) * 100);
        scoreEl.textContent = `Загальний рахунок ${percent}% (${correctCount} правильних відповідей з ${totalCount})`;
    }

    nextBtn.addEventListener('click', generateTask);

    generateTask();
}


// Завдання 4
let fruitImages = [
    {
        path: 'https://www.seeds.org.ua/wp-content/uploads/2020/05/%D1%8F%D0%B1%D0%BB%D0%BE%D0%BA%D0%B8-750x430.jpg',
        title: 'Яблука',
        description: 'Свіжі зелені яблука з саду'
    },
    {
        path: 'https://storinka.com.ua/storage/source/15/qKEAvP1YXQZWPMVfVVJ0bWOc_O3aC2bn.jpg',
        title: 'Банани',
        description: 'Стигла соковита в\'язка бананів'
    },
    {
        path: 'https://cdn.crazybox.com.ua/image/catalog/exotika_new/ananas%20gold.jpg',
        title: 'Ананас',
        description: 'Тропічний солодкий ананас'
    }
];

function initPhotoRotator(containerId, imagesArray) {
    const root = document.getElementById(containerId);
    let currentIndex = 0;

    // Створення елементів через document.createElement
    const frame = document.createElement('div');
    frame.className = 'rotator-frame';

    const topBar = document.createElement('div');
    topBar.className = 'rotator-top';

    const mainArea = document.createElement('div');
    mainArea.className = 'rotator-main';

    const prevBtn = document.createElement('div');
    prevBtn.className = 'rotator-nav';
    prevBtn.textContent = 'Назад';

    const imgWrap = document.createElement('div');
    imgWrap.className = 'rotator-img-wrap';

    const img = document.createElement('img');

    const nextBtn = document.createElement('div');
    nextBtn.className = 'rotator-nav';
    nextBtn.textContent = 'Вперед';

    imgWrap.appendChild(img);
    mainArea.appendChild(prevBtn);
    mainArea.appendChild(imgWrap);
    mainArea.appendChild(nextBtn);

    const bottomBar = document.createElement('div');
    bottomBar.className = 'rotator-bottom';

    const titleEl = document.createElement('div');
    titleEl.className = 'rotator-title';

    const descEl = document.createElement('div');
    descEl.className = 'rotator-desc';

    bottomBar.appendChild(titleEl);
    bottomBar.appendChild(descEl);

    frame.appendChild(topBar);
    frame.appendChild(mainArea);
    frame.appendChild(bottomBar);

    root.appendChild(frame);

    function update() {
        let currentItem = imagesArray[currentIndex];
        topBar.textContent = `Фотографія ${currentIndex + 1} з ${imagesArray.length}`;
        img.src = currentItem.path;
        img.alt = currentItem.title;
        titleEl.textContent = currentItem.title;
        descEl.textContent = currentItem.description;

        // Перемикання видимості посилань "Назад" / "Вперед"
        if (currentIndex === 0) {
            prevBtn.classList.add('hidden');
        } else {
            prevBtn.classList.remove('hidden');
        }

        if (currentIndex === imagesArray.length - 1) {
            nextBtn.classList.add('hidden');
        } else {
            nextBtn.classList.remove('hidden');
        }
    }

    prevBtn.addEventListener('click', function() {
        if (currentIndex > 0) {
            currentIndex--;
            update();
        }
    });

    nextBtn.addEventListener('click', function() {
        if (currentIndex < imagesArray.length - 1) {
            currentIndex++;
            update();
        }
    });

    update();
}


// Завдання 5
function initCaptcha(digitsCount) {
    const pixelsContainer = document.getElementById('captcha-pixels');
    const inputEl = document.getElementById('captcha-input');
    const checkBtn = document.getElementById('captcha-check-btn');
    const resultEl = document.getElementById('captcha-result');

    let generatedCode = '';

    // Матриця 3х5 для вимальовування цифр 0-9
    const digitPatterns = [
        [1,1,1, 1,0,1, 1,0,1, 1,0,1, 1,1,1], // 0
        [0,1,0, 1,1,0, 0,1,0, 0,1,0, 1,1,1], // 1
        [1,1,1, 0,0,1, 1,1,1, 1,0,0, 1,1,1], // 2
        [1,1,1, 0,0,1, 1,1,1, 0,0,1, 1,1,1], // 3
        [1,0,1, 1,0,1, 1,1,1, 0,0,1, 0,0,1], // 4
        [1,1,1, 1,0,0, 1,1,1, 0,0,1, 1,1,1], // 5
        [1,1,1, 1,0,0, 1,1,1, 1,0,1, 1,1,1], // 6
        [1,1,1, 0,0,1, 0,1,0, 0,1,0, 0,1,0], // 7
        [1,1,1, 1,0,1, 1,1,1, 1,0,1, 1,1,1], // 8
        [1,1,1, 1,0,1, 1,1,1, 0,0,1, 1,1,1]  // 9
    ];

    function renderCaptcha() {
        pixelsContainer.innerHTML = '';
        generatedCode = '';
        resultEl.textContent = '';
        inputEl.value = '';

        for (let i = 0; i < digitsCount; i++) {
            let digit = Math.floor(Math.random() * 10);
            generatedCode += digit;

            let digitBox = document.createElement('div');
            digitBox.className = 'captcha-digit';

            let pattern = digitPatterns[digit];
            pattern.forEach(bit => {
                let pixel = document.createElement('span');
                pixel.className = bit ? 'pixel-dot active' : 'pixel-dot';
                digitBox.appendChild(pixel);
            });

            pixelsContainer.appendChild(digitBox);
        }
    }

    checkBtn.addEventListener('click', function() {
        if (inputEl.value.trim() === generatedCode) {
            resultEl.style.color = 'green';
            resultEl.textContent = 'Правильно!';
            setTimeout(renderCaptcha, 1500);
        } else {
            resultEl.style.color = 'red';
            resultEl.textContent = 'Помилка';
        }
    });

    renderCaptcha();
}

// Запуск усіх завдань після завантаження DOM
document.addEventListener('DOMContentLoaded', function() {
    initTask1();
    initTask2();
    initTask3();
    initPhotoRotator('rotator', fruitImages);
    initCaptcha(2); // Кількість цифр капчі
});