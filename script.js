document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const listTitle = document.getElementById('list-title');
    const allTasksBtn = document.getElementById('all-tasks');
    const pendingTasksBtn = document.getElementById('pending-tasks');
    const completedTasksBtn = document.getElementById('completed-tasks');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = '';
        let filteredTasks = tasks;

        if (currentFilter === 'pending') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (currentFilter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }

        filteredTasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <span class="task-text">${task.text}</span>
                <div class="task-actions">
                    <button class="complete-btn" title="${task.completed ? 'Mark as incomplete' : 'Mark as complete'}">
                        <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i>
                    </button>
                    <button class="edit-btn" title="Edit task">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" title="Delete task">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            const completeBtn = li.querySelector('.complete-btn');
            const editBtn = li.querySelector('.edit-btn');
            const deleteBtn = li.querySelector('.delete-btn');

            completeBtn.addEventListener('click', () => toggleComplete(index));
            editBtn.addEventListener('click', () => editTask(index, li));
            deleteBtn.addEventListener('click', () => deleteTask(index));

            taskList.appendChild(li);
        });

        updateListTitle();
    }

    function addTask(text) {
        tasks.push({ text, completed: false });
        saveTasks();
        renderTasks();
    }

    function toggleComplete(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    }

    function editTask(index, li) {
        const taskText = li.querySelector('.task-text');
        const currentText = taskText.textContent;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentText;
        input.className = 'edit-input';

        const saveBtn = document.createElement('button');
        saveBtn.innerHTML = '<i class="fas fa-save"></i>';
        saveBtn.title = 'Save changes';
        saveBtn.className = 'edit-btn';
        saveBtn.addEventListener('click', () => {
            const newText = input.value.trim();
            if (newText) {
                tasks[index].text = newText;
                saveTasks();
                renderTasks();
            }
        });

        li.innerHTML = '';
        li.appendChild(input);
        li.appendChild(saveBtn);
        input.focus();
    }

    function deleteTask(index) {
        if (confirm('Are you sure you want to delete this task?')) {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        }
    }

    function updateListTitle() {
        switch (currentFilter) {
            case 'all':
                listTitle.textContent = 'All Tasks';
                break;
            case 'pending':
                listTitle.textContent = 'Pending Tasks';
                break;
            case 'completed':
                listTitle.textContent = 'Completed Tasks';
                break;
        }
    }

    function setActiveFilter(filter) {
        currentFilter = filter;
        [allTasksBtn, pendingTasksBtn, completedTasksBtn].forEach(btn => btn.classList.remove('active'));
        document.getElementById(`${filter}-tasks`).classList.add('active');
        renderTasks();
    }

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = taskInput.value.trim();
        if (text) {
            addTask(text);
            taskInput.value = '';
        }
    });

    allTasksBtn.addEventListener('click', () => setActiveFilter('all'));
    pendingTasksBtn.addEventListener('click', () => setActiveFilter('pending'));
    completedTasksBtn.addEventListener('click', () => setActiveFilter('completed'));

    renderTasks();
});