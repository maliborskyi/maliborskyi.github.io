// Завдання 1
const firstName = "Олександр";
const nameList = document.getElementById('name-list');

for (const char of firstName) {
    const li = document.createElement('li');
    li.textContent = char;
    // Показуємо alert при наведенні миші
    li.addEventListener('mouseenter', () => {
        alert(`Це літера ${char}`);
    });
    nameList.appendChild(li);
}


// Завдання 2
const startNamesBtn = document.getElementById('start-input');
const namesOutput = document.getElementById('students-list');

startNamesBtn.addEventListener('click', () => {
    // Використовуємо рекурсивну функцію з setTimeout, 
    // щоб браузер встигав відмалювати DOM після кожного введення перед наступним prompt
    function askName() {
        setTimeout(() => {
            const input = prompt('Введіть прізвище та ім\'я (або натисніть "Відміна" для виходу):');
            
            if (input !== null) { // Якщо не натиснуто "Відміна"
                if (input.trim() !== "") {
                    const p = document.createElement('p');
                    p.textContent = `Студент: ${input}`;
                    namesOutput.appendChild(p);
                }
                askName(); // Викликаємо функцію знову для наступного вводу
            }
        }, 10);
    }
    askName();
});


// Завдання 3
const lastName = "Маліборський";
const toggleBlocksBtn = document.getElementById('toggle-blocks');
const lettersContainer = document.getElementById('letters');
let isBlocksShown = false;  // Змінна-прапорець для перевірки стану

toggleBlocksBtn.addEventListener('click', () => {
    if (isBlocksShown) {
        // Якщо блоки вже показані — очищаємо контейнер
        lettersContainer.innerHTML = '';
        toggleBlocksBtn.textContent = 'Показати блоки';
        isBlocksShown = false;
    } else {
        // Якщо блоків немає — створюємо їх
        for (const char of lastName) {
            const div = document.createElement('div');
            div.textContent = char;
            div.className = 'letter-block';
            div.addEventListener('mouseenter', () => {
                alert(`Це літера [ ${char} ]`);
            });
            lettersContainer.appendChild(div);
        }
        toggleBlocksBtn.textContent = 'Очистити блоки';
        isBlocksShown = true;
    }
});