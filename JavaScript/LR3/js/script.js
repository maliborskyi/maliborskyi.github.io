// Завдання 1: Генератор випадкових чисел
function* randomGenerator(min, max) {
    while (true) {
        yield Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

// Запитуємо межі під час завантаження скрипта
const minVal = parseInt(prompt("Завдання 1: Введіть мінімальне значення:"), 10) || 0;
const maxVal = parseInt(prompt("Завдання 1: Введіть максимальне значення:"), 10) || 100;
const randGen = randomGenerator(minVal, maxVal);

document.getElementById("next").addEventListener("click", () => {
    const nextVal = randGen.next().value;
    document.getElementById("out").innerText = `Поточне випадкове число: ${nextVal}`;
});


// Завдання 2: Генератор паролів
function* passwordGenerator() {
    let password = "";
    while (true) {
        const char = yield;
        if (char === "done") {
            return password;
        }
        if (char) {
            password += char;
        }
    }
}

document.getElementById("start-password").addEventListener("click", () => {
    const passGen = passwordGenerator();
    passGen.next(); // Ініціалізація генератора 

    while (true) {
        const input = prompt("Введіть символ для пароля (або напишіть 'done' для завершення):");
        
        if (input === null || input.toLowerCase() === "done") {
            // Передаємо 'done', генератор завершується і повертає значення 
            const finalPassword = passGen.next("done").value;
            document.getElementById("password-out").innerText = `Зібраний пароль: ${finalPassword}`;
            break;
        } else {
            // Передаємо введені символи назад у генератор
            passGen.next(input);
        }
    }
});


// Завдання 3: Генератор діалогів
function* chatBot() {
    const name = yield "Hi! What is your name?";
    yield `Nice to meet you, ${name}! How are you?`;
    yield "Goodbye!";
}

document.getElementById("start-chat").addEventListener("click", () => {
    const bot = chatBot();
    
    // Крок 1: Отримуємо перше запитання і показуємо його
    const question1 = bot.next().value;
    const userNameAnswer = prompt(question1);
    
    if (userNameAnswer !== null) {
        // Крок 2: Передаємо ім'я назад, отримуємо друге запитання
        const question2 = bot.next(userNameAnswer).value;
        prompt(question2);
        
        // Крок 3: Переходимо до фіналу
        const question3 = bot.next().value;
        alert(question3);
        
        document.getElementById("chat-out").innerText = "Розмову завершено.";
    }
});


// Завдання 4: Втрата контексту
const userNameForContext = prompt("Завдання 4: Введіть ваше ім'я:") || "Олександр";

const user = {
    name: userNameForContext,
    say() {
        alert(`Hello, ${this.name}`);
    }
};

const helloBtn = document.getElementById("hello");

helloBtn.addEventListener("click", user.say.bind(user));