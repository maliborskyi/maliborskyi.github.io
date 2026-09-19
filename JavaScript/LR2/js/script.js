// Завдання 1
function calculate() {
    let result = 100; // Оголошення змінної result у функціональній області
    console.log("До блоку if, result =", result);

    if (true) {
        let result = 50; // Оголошення змінної з тим самим ім'ям у блочній області
        console.log("Всередині блоку if, result =", result); // Виведе 50, змінна всередині if не впливає на зовнішню
    }

    console.log("Після блоку if, result =", result); 
}

calculate();

// Завдання 2
const secretNumber = 8 % 10; 

let userNumber = prompt("Введіть число від 0 до 9:");

// Перевіряємо, чи введене число дорівнює secretNumber
if (Number(userNumber) === secretNumber) {
    alert("Correct!"); 
} else {
    alert("Wrong!");
}

// Завдання 3
let userName = prompt("Введіть ваше ім'я:");
let num1 = prompt("Введіть перше число:");
let num2 = prompt("Введіть друге число:");

// Перетворюємо введені рядки у числа для математичного додавання
let sum = Number(num1) + Number(num2);

// Виведення у консоль за допомогою конкатенації через +
console.log("Hello, " + userName + "! The sum of " + num1 + " and " + num2 + " is " + sum);