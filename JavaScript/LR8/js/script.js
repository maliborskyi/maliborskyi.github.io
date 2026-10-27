document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const filterSelect = document.getElementById('filterSelect');

    // Зчитати збережені дані з localStorage під час завантаження
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Функція форматування дати та часу
    function formatDate(date) {
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yy = String(date.getFullYear()).slice(-2);
        const hh = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        return `${dd}.${mm}.${yy}, ${hh}:${min}`;
    }

    // Збереження завдань у localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Головна функція рендерингу списку завдань
    function renderTasks() {
        taskList.innerHTML = '';
        const filter = filterSelect.value;

        // Фільтрація виконаних та невиконаних
        const filteredTasks = tasks.filter(task => {
            if (filter === 'completed') return task.completed;
            if (filter === 'uncompleted') return !task.completed;
            return true; // all
        });

        filteredTasks.forEach((task) => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;

            const contentDiv = document.createElement('div');
            contentDiv.className = 'task-content';

            // Чекбокс біля завдання
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'task-checkbox';
            checkbox.checked = task.completed;

            // Поведінка при кліку на чекбокс
            checkbox.addEventListener('change', () => {
                task.completed = checkbox.checked;
                saveTasks();
                renderTasks();
            });

            // Текст завдання
            const textSpan = document.createElement('span');
            textSpan.className = 'task-text';
            textSpan.textContent = task.text;

            // Відформатована дата та час
            const dateSpan = document.createElement('span');
            dateSpan.className = 'task-date';
            dateSpan.textContent = task.date;

            contentDiv.appendChild(checkbox);
            contentDiv.appendChild(textSpan);
            contentDiv.appendChild(dateSpan);

            // Редагування по подвійному кліку
            contentDiv.addEventListener('dblclick', () => {
                const editInput = document.createElement('input');
                editInput.type = 'text';
                editInput.className = 'edit-input';
                editInput.value = task.text;

                contentDiv.replaceWith(editInput);
                editInput.focus();

                const saveEdit = () => {
                    const newText = editInput.value.trim();
                    if (newText !== '') {
                        task.text = newText;
                        saveTasks();
                    }
                    renderTasks();
                };

                // Збереження по натисканні Enter або втраті фокусу
                editInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        saveEdit();
                    }
                });
                editInput.addEventListener('blur', saveEdit);
            });

            // Хрестик для видалення праворуч
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'x';
            deleteBtn.addEventListener('click', () => {
                tasks = tasks.filter(t => t.id !== task.id);
                saveTasks();
                renderTasks();
            });

            li.appendChild(contentDiv);
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        });
    }

    // Додавання нового завдання при натисканні клавіші Enter
    taskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const text = taskInput.value.trim();
            if (text !== '') {
                const newTask = {
                    id: Date.now(),
                    text: text,
                    date: formatDate(new Date()),
                    completed: false
                };
                tasks.push(newTask);
                saveTasks();
                taskInput.value = '';
                renderTasks();
            }
        }
    });

    // Зміна фільтра/сортування
    filterSelect.addEventListener('change', renderTasks);

    // Первинне завантаження списку при відкритті сторінки
    renderTasks();
});