// Завдання 1
let book = {
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    year: 1997,
    isRead: false,

    // Метод для виведення інформації про книгу
    bookInfo() {
        console.log(`Назва: "${this.title}", Автор: ${this.author}, Рік: ${this.year}, Прочитана: ${this.isRead ? "Так" : "Ні"}`);
    }
};

console.log("--- 1. Перевірка роботи з об'єктом Book ---");
book.bookInfo();

// Зміна значення isRead на протилежне
book.isRead = !book.isRead;
book.bookInfo();

// Додавання методу markAsRead до об'єкта книги 
book.markAsRead = function() {
    this.isRead = true;
};

book.isRead = false; 

// Перевірка роботи markAsRead:
console.log("Статус прочитання до виклику:", book.isRead); // буде false
book.markAsRead();
console.log("Статус прочитання після виклику markAsRead():", book.isRead); // стане true
book.bookInfo();


// Завдання 2
let library = [
    { title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", year: 1997, isRead: true },
    { title: "The Hobbit", author: "J.R.R. Tolkien", year: 1937, isRead: false },
    { title: "1984", author: "George Orwell", year: 1949, isRead: true }
];

// Функція для виведення всіх книг бібліотеки
function displayLibrary() {
    console.log("\n--- Поточний список книг у бібліотеці ---");
    library.forEach((item, index) => {
        console.log(`${index + 1}. Назва: "${item.title}", Автор: ${item.author}, Рік: ${item.year}, Прочитана: ${item.isRead ? "Так" : "Ні"}`);
    });
}

// Додавання нової книги в масив
library.push({ title: "The Great Gatsby", author: "F. Scott Fitzgerald", year: 1925, isRead: false });
displayLibrary();



// Завдання 3
console.log("\n--- 3. Сортування, фільтрація та пошук ---");

// Сортування за роком видання (від найстаршої до найновішої)
library.sort((a, b) => a.year - b.year);
console.log("1. Відсортований масив (за роком зростання):", library);

// Фільтрація: масив непрочитаних книг
let unreadBooks = library.filter(b => !b.isRead);
console.log("2. Список непрочитаних книг:", unreadBooks);

// Пошук книги за автором
let tolkienBook = library.find(b => b.author === "J.R.R. Tolkien");
console.log("3. Знайдена книга Толкіна:", tolkienBook);


// Обчислення середнього року видання книг у бібліотеці
function calculateAverageYear(libraryArray) {
    if (!libraryArray || libraryArray.length === 0) return 0;
    
    // Сумуємо всі роки видання за допомогою reduce
    let sumYears = libraryArray.reduce((acc, currentBook) => acc + currentBook.year, 0);
    return Math.round(sumYears / libraryArray.length);
}

let avgYear = calculateAverageYear(library);
console.log(`\nСередній рік видання книг у бібліотеці: ${avgYear}`);


// Завдання 4
function addBookToLibrary() {
    let title = prompt("Введіть назву книги:");
    let author = prompt("Введіть автора книги:");
    let year = +prompt("Введіть рік видання книги:");
    let isRead = confirm("Чи прочитана книга?");
    
    if (title && author && !isNaN(year)) {
        library.push({ title, author, year, isRead });
        displayLibrary();
    } else {
        alert("Введено некоректні дані!");
    }
}

// Для запуску інтерактивного введення через prompt/confirm розкоментуйте рядок нижче:
// addBookToLibrary();



// Індивідуальне завдання
class StampCollectionManager {
    constructor() {
        this.collection = [
            {
                country: "Україна",
                year: 1992,
                nominal: 1,
                theme: "Перша марка незалежної України",
                isExchanged: true,
                stampInfo() {
                    console.log(`[Марка] Країна: ${this.country} | Рік: ${this.year} | Номінал: ${this.nominal} | Тема: ${this.theme} | Обміняна: ${this.isExchanged ? "Так" : "Ні"}`);
                },
                markAsExchanged() {
                    this.isExchanged = true;
                }
            },
            {
                country: "США",
                year: 1969,
                nominal: 10,
                theme: "Космос / Висадка на Місяць",
                isExchanged: false,
                stampInfo() {
                    console.log(`[Марка] Країна: ${this.country} | Рік: ${this.year} | Номінал: ${this.nominal} | Тема: ${this.theme} | Обміняна: ${this.isExchanged ? "Так" : "Ні"}`);
                },
                markAsExchanged() {
                    this.isExchanged = true;
                }
            },
            {
                country: "Японія",
                year: 2010,
                nominal: 80,
                theme: "Флора і фауна",
                isExchanged: false,
                stampInfo() {
                    console.log(`[Марка] Країна: ${this.country} | Рік: ${this.year} | Номінал: ${this.nominal} | Тема: ${this.theme} | Обміняна: ${this.isExchanged ? "Так" : "Ні"}`);
                },
                markAsExchanged() {
                    this.isExchanged = true;
                }
            }
        ];
    }

    // Виведення всієї колекції
    displayAll() {
        console.log("==========================================");
        console.log("          ПОВНИЙ СПИСОК КОЛЕКЦІЇ          ");
        console.log("==========================================");
        this.collection.forEach((stamp, index) => {
            console.log(`Марка #${index + 1}:`);
            stamp.stampInfo();
        });
        console.log("==========================================");
    }

    // Додавання нової марки
    addStamp(country, year, nominal, theme, isExchanged = false) {
        let newStamp = {
            country,
            year: Number(year),
            nominal: Number(nominal),
            theme,
            isExchanged: Boolean(isExchanged),
            stampInfo() {
                console.log(`[Марка] Країна: ${this.country} | Рік: ${this.year} | Номінал: ${this.nominal} | Тема: ${this.theme} | Обміняна: ${this.isExchanged ? "Так" : "Ні"}`);
            },
            markAsExchanged() {
                this.isExchanged = true;
            }
        };
        this.collection.push(newStamp);
        console.log(`Успішно додано нову марку з країни: ${country}`);
    }

    // Інтерактивне додавання через prompt
    addStampPrompt() {
        let country = prompt("Введіть країну випуску марки:");
        if (!country) return;
        let year = prompt("Введіть рік випуску:");
        let nominal = prompt("Введіть номінал:");
        let theme = prompt("Введіть тему:");
        let isExchanged = confirm("Чи обміняна ця марка? (ОК - Так, Скасувати - Ні)");

        this.addStamp(country, year, nominal, theme, isExchanged);
        this.displayAll();
    }

    // Сортування за роком випуску
    sortByYear(ascending = true) {
        return [...this.collection].sort((a, b) => ascending ? a.year - b.year : b.year - a.year);
    }

    // Фільтрація необміняних марок
    getUnexchangedStamps() {
        return this.collection.filter(stamp => !stamp.isExchanged);
    }

    // Пошук марки за темою чи країною
    findStampByQuery(query) {
        return this.collection.find(stamp => 
            stamp.country.toLowerCase().includes(query.toLowerCase()) || 
            stamp.theme.toLowerCase().includes(query.toLowerCase())
        );
    }

    // Обчислення середнього року випуску марок
    calculateAverageYear() {
        if (this.collection.length === 0) return 0;
        let totalYears = this.collection.reduce((sum, stamp) => sum + stamp.year, 0);
        return Math.round(totalYears / this.collection.length);
    }
}

// === Демонстрація роботи індивідуального завдання ===
const myStamps = new StampCollectionManager();

// 1. Вивід початкової колекції
myStamps.displayAll();

// 2. Додавання нової марки програмно
myStamps.addStamp("Австралія", 2015, 5, "Кенгуру та австралійська природа", false);

// 3. Демонстрація методу markAsExchanged
console.log("\n--- Тестування методу markAsExchanged ---");
console.log("До зміни статусу другої марки:", myStamps.collection[1].isExchanged);
myStamps.collection[1].markAsExchanged();
console.log("Після виклику markAsExchanged:", myStamps.collection[1].isExchanged);

// 4. Демонстрація сортування за роком
console.log("\n--- Відсортовано за роком (зростання) ---");
let sorted = myStamps.sortByYear(true);
sorted.forEach(s => s.stampInfo());

// 5. Фільтрація необміняних марок
console.log("\n--- Фільтрація: Тільки необміняні марки ---");
let unexchanged = myStamps.getUnexchangedStamps();
unexchanged.forEach(s => s.stampInfo());

// 6. Пошук марки
console.log("\n--- Пошук марки за запитом 'Космос' ---");
let found = myStamps.findStampByQuery("Космос");
if (found) {
    found.stampInfo();
}

// 7. Обчислення середнього року випуску
let avg = myStamps.calculateAverageYear();
console.log(`\nСередній рік випуску марок у колекції: ${avg}`);