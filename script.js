const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const emptyMessage = document.getElementById("emptyMessage");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");

const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";


function displayTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(function(task) {

        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });


    filteredTasks.forEach(function(task) {

        const realIndex = tasks.indexOf(task);

        const li = document.createElement("li");

        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <span class="task-text">${task.text}</span>

            <div class="task-actions">

                <button 
                    class="complete-btn"
                    onclick="completeTask(${realIndex})">
                    ✓
                </button>

                <button 
                    class="delete-btn"
                    onclick="deleteTask(${realIndex})">
                    🗑
                </button>

            </div>
        `;

        taskList.appendChild(li);
    });


    updateTaskCount();


    if (filteredTasks.length === 0) {

        emptyMessage.style.display = "block";

        if (currentFilter === "completed") {
            emptyMessage.textContent = "No completed tasks yet.";
        } 
        else if (currentFilter === "active") {
            emptyMessage.textContent = "No active tasks.";
        } 
        else {
            emptyMessage.textContent = "No tasks yet. Add your first task! 🚀";
        }

    } else {

        emptyMessage.style.display = "none";
    }
}


function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {

        alert("Please enter a task!");

        return;
    }


    const newTask = {

        text: text,

        completed: false
    };


    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";

    displayTasks();
}


function completeTask(index) {

    tasks[index].completed = !tasks[index].completed;

    saveTasks();

    displayTasks();
}


function deleteTask(index) {

    tasks.splice(index, 1);

    saveTasks();

    displayTasks();
}


function updateTaskCount() {

    const remainingTasks = tasks.filter(function(task) {

        return !task.completed;

    }).length;


    if (remainingTasks === 1) {

        taskCount.textContent = "1 task remaining";

    } else {

        taskCount.textContent = remainingTasks + " tasks remaining";
    }
}


function clearCompleted() {

    tasks = tasks.filter(function(task) {

        return !task.completed;
    });


    saveTasks();

    displayTasks();
}


function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));
}


addTaskBtn.addEventListener("click", addTask);


taskInput.addEventListener("keypress", function(event) {

    if (event.key === "Enter") {

        addTask();
    }
});


filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        filterButtons.forEach(function(btn) {

            btn.classList.remove("active");
        });


        button.classList.add("active");

        currentFilter = button.dataset.filter;

        displayTasks();
    });
});


clearCompletedBtn.addEventListener("click", clearCompleted);


displayTasks();