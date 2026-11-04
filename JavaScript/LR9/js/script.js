const loader = document.getElementById("loader");
const resultDiv = document.getElementById("result");

function showLoader() {
  loader.style.display = "block";
  resultDiv.innerText = "";
}

function hideLoader() {
  loader.style.display = "none";
}

function displayResult(message) {
  hideLoader();
  resultDiv.innerText = message;
}

// Завдання 4: Порівняння двох чисел
function compareNumbers(num1, num2) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (num1 > num2) {
        resolve("Перше число більше");
      } else if (num1 < num2) {
        resolve("Друге число більше");
      } else {
        reject("Числа рівні");
      }
    }, 1000);
  });
}

function runTask4(num1, num2) {
  showLoader();

  compareNumbers(num1, num2)
    .then((result) => {
      displayResult(`Успіх: ${result}`);
    })
    .catch((error) => {
      displayResult(error);
    });
}

// Завдання 5: Використання Promise.all
function getRandomNumber() {
  return Math.floor(Math.random() * 10) + 1; // Випадкове число від 1 до 10
}

function runTask5() {
  showLoader();

  // Масив із трьох Promise, що виконуються через 1, 2 та 3 секунди відповідно
  const promise1 = new Promise((resolve) => {
    setTimeout(() => resolve(getRandomNumber()), 1000);
  });

  const promise2 = new Promise((resolve) => {
    setTimeout(() => resolve(getRandomNumber()), 2000);
  });

  const promise3 = new Promise((resolve) => {
    setTimeout(() => resolve(getRandomNumber()), 3000);
  });

  Promise.all([promise1, promise2, promise3])
    .then((values) => {
      const sum = values.reduce((acc, current) => acc + current, 0);
      displayResult(`Згенеровані числа: [${values.join(", ")}]. Сума: ${sum}`);
    })
    .catch((error) => {
      displayResult(`Помилка під час виконання: ${error}`);
    });
}
