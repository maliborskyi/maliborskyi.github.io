// Зберігаємо URL-адресу JSON у змінній
const requestURL = 'https://semegenkep.github.io/json/example.json';

// Створюємо новий екземпляр XMLHttpRequest
const request = new XMLHttpRequest();

// Відкриваємо новий запит за допомогою методу open()
request.open('GET', requestURL);

// Встановлюємо responseType в 'json' та надсилаємо запит
request.responseType = 'json';
request.send();

// Очікуємо завантаження даних та обробляємо їх
request.onload = function() {
    const superHeroes = request.response;
    
    // Викликаємо функції для заповнення сторінки
    populateHeader(superHeroes);
    showHeroes(superHeroes);
};

// Функція для заповнення header частини 
function populateHeader(jsonObj) {
    const header = document.querySelector('header');
    
    const myH1 = document.createElement('h1');
    myH1.textContent = jsonObj['squadName'];
    header.appendChild(myH1);

    const myPara = document.createElement('p');
    myPara.textContent = `Hometown: ${jsonObj['homeTown']} // Formed: ${jsonObj['formed']}`;
    header.appendChild(myPara);
}

// Функція для створення інформаційних карток героїв у <section>
function showHeroes(jsonObj) {
    const section = document.querySelector('section');
    const heroes = jsonObj['members'];

    for (let i = 0; i < heroes.length; i++) {
        // Створюємо елементи HTML
        const myArticle = document.createElement('article');
        const myH2 = document.createElement('h2');
        const myPara1 = document.createElement('p');
        const myPara2 = document.createElement('p');
        const myPara3 = document.createElement('p');
        const myList = document.createElement('ul');

        // Заповнюємо їх даними з JSON
        myH2.textContent = heroes[i]['name'];
        myPara1.textContent = `Secret identity: ${heroes[i]['secretIdentity']}`;
        myPara2.textContent = `Age: ${heroes[i]['age']}`;
        myPara3.textContent = 'Superpowers:';

        const superPowers = heroes[i]['powers'];
        for (let j = 0; j < superPowers.length; j++) {
            const listItem = document.createElement('li');
            listItem.textContent = superPowers[j];
            myList.appendChild(listItem);
        }

        // Додаємо створені елементи всередину <article>, а його у <section>
        myArticle.appendChild(myH2);
        myArticle.appendChild(myPara1);
        myArticle.appendChild(myPara2);
        myArticle.appendChild(myPara3);
        myArticle.appendChild(myList);

        section.appendChild(myArticle);
    }
}