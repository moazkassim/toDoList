let overlay = document.querySelector(".overlay");
let addTask = document.querySelector(".add-task");
let exist = document.querySelector(".exist");
let titleInput = document.getElementById("title-input");
let dateInput = document.getElementById("date-input");
let descriptionInput = document.getElementById("description-input");
let closeButton = document.getElementById("close");
let searchButton = document.getElementById("search-button");
let searchInput = document.getElementById("search-input");
let sortButton = document.getElementById("sort-button");
let addButton = document.getElementById("add");
let secondEditButton = document.getElementById("edit");
let tasksDiv = document.querySelector(".tasks");

// loading tasks from back end request

fetch("http://localhost:3000/api/v1/todo")
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    let i = 0;
    let loadedArray = [];
    while (data.todos[i] !== undefined) {
      const todo = {
        title: data.todos[i].title,
        date: data.todos[i].onDate,
        description: data.todos[i].description,
        id: data.todos[i]._id,
      };
      loadedArray.push(todo);
      i++;
    }
    addTaskToTasksFromArray(loadedArray);
  })
  .catch((error) => console.log("error", error));

// create array of task
let arrayOfTasks = [];
let isEditing = false;

// Enter the task div
addTask.addEventListener("click", function () {
  overlay.classList.remove("hidden");
  overlay.classList.add("flex");
  secondEditButton.classList.add("hidden");
  addButton.classList.remove("hidden");
});

// Exist Add Task Window
function existAddTask() {
  overlay.classList.remove("flex");
  overlay.classList.add("hidden");
}
exist.addEventListener("click", existAddTask);
closeButton.onclick = existAddTask;

addButton.onclick = function () {
  if (
    titleInput.value !== "" ||
    dateInput.value !== "" ||
    descriptionInput.value !== ""
  ) {
    addTaskToArray(titleInput.value, dateInput.value, descriptionInput.value);
    titleInput.value = "";
    dateInput.value = "";
    descriptionInput.value = "";
    existAddTask();
  } else {
    existAddTask();
  }
};

// add task to array
function addTaskToArray(taskTitle, taskDate, taskDescription) {
  let idTask = "";
  fetch("http://localhost:3000/api/v1/todo", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: taskTitle,
      description: taskDescription,
      onDate: taskDate,
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      idTask = data.todo._id;
    })
    .then((data) => {
      const task = {
        title: taskTitle,
        date: taskDate,
        description: taskDescription,
        id: idTask,
      };
      // Push Task To Array Of Tasks
      arrayOfTasks.push(task);
      // Add Tasks To Page
      addTaskToTasksFromArray(arrayOfTasks);
    })
    .catch((error) => console.log(error));
}

/////////////////////////////////////////////
// add task to array from array
function addTaskToTasksFromArray(tasksList) {
  tasksDiv.innerHTML = "";
  titleInput.value = "";
  dateInput.value = "";
  descriptionInput.value = "";
  secondEditButton.classList.add("hidden");
  addButton.classList.remove("hidden");

  tasksList.forEach((task) => {
    //create task div

    let taskDiv = document.createElement("div");
    taskDiv.className =
      "task mb-1 task bg-green-100 rounded p-3 border-2 border-green-200 cursor-pointer";

    taskDiv.setAttribute("data-id", task.id);
    //create about task div
    let aboutTask = document.createElement("div");
    aboutTask.className = "about-task flex flex-col p-2";

    //create head paragraph and span
    let head = document.createElement("h3");
    head.appendChild(document.createTextNode(task.title));

    // create span
    let span = document.createElement("span");
    span.className = "text-[#B7B7B7]";
    span.appendChild(document.createTextNode(task.date));

    //create paragraph
    let para = document.createElement("p");
    para.appendChild(document.createTextNode(task.description));

    //create task process
    let taskProcess = document.createElement("div");
    taskProcess.className = "process-task flex justify-center my-3";

    // edit button
    let editButton = document.createElement("button");
    editButton.className = "edit-task";

    //create icon
    let editIcon = document.createElement("i");
    editIcon.className = "fa-regular fa-pen-to-square text-[20px]";
    editButton.appendChild(editIcon);
    editButton.onclick = firstEditTask;

    // delete button
    let deleteButton = document.createElement("button");
    deleteButton.id = "delete-task";
    deleteButton.className = "mx-4";
    deleteButton.onclick = function () {
      fetch(`http://localhost:3000/api/v1/todo/${task.id}`, {
        method: "DELETE",
      })
        .then((res) => res.json()) // or res.json()

        .then(() => {
          const filteredArray = arrayOfTasks.filter(
            (item) => item.id !== task.id
          );
          arrayOfTasks = filteredArray;
          addTaskToTasksFromArray(filteredArray);
        })
        .then(() => {
          fetch("http://localhost:3000/api/v1/todo")
            .then((res) => {
              return res.json();
            })
            .then((data) => {
              let loadedArray = [];
              let i = 0;
              while (data.todos[i] !== undefined) {
                const todo = {
                  title: data.todos[i].title,
                  date: data.todos[i].onDate,
                  description: data.todos[i].description,
                  id: data.todos[i]._id,
                };
                loadedArray.push(todo);
                i++;
              }
              addTaskToTasksFromArray(loadedArray);
            })
            .catch((error) => console.log("error", error));
        })
        .catch((error) => console.log(error));
    };

    //create icon
    let deleteIcon = document.createElement("i");
    deleteIcon.className = "fa-regular fa-trash-can text-[20px]";
    deleteButton.appendChild(deleteIcon);

    //create icon

    aboutTask.appendChild(head);
    aboutTask.appendChild(span);
    aboutTask.appendChild(para);

    taskDiv.appendChild(aboutTask);
    taskProcess.appendChild(editButton);
    taskProcess.appendChild(deleteButton);

    taskDiv.appendChild(taskProcess);
    tasksDiv.appendChild(taskDiv);
  });
}

function firstEditTask(e) {
  //keep data
  secondEditButton.classList.remove("hidden");
  addButton.classList.add("hidden");

  let supTitle =
    e.target.parentElement.closest(".task").childNodes[0].firstChild.innerHTML;
  let supDate =
    e.target.parentElement.closest(".task").childNodes[0].childNodes[1]
      .innerHTML;
  let supParagraph =
    e.target.parentElement.closest(".task").childNodes[0].lastChild.innerHTML;
  //remove div task
  // e.target.parentElement.closest(".task").remove();
  overlay.classList.remove("hidden");
  overlay.classList.add("flex");
  titleInput.value = supTitle;
  dateInput.value = supDate;
  descriptionInput.value = supParagraph;
  secondEditButton.onclick = function () {
    arrayOfTasks.forEach((task) => {
      if (
        task.title === supTitle &&
        task.date === supDate &&
        task.description === supParagraph
      ) {
        task.title = titleInput.value;
        task.date = dateInput.value;
        task.description = descriptionInput.value;
        e.target.parentElement.closest(
          ".task"
        ).childNodes[0].firstChild.innerHTML = titleInput.value;
        e.target.parentElement.closest(
          ".task"
        ).childNodes[0].childNodes[1].innerHTML = dateInput.value;
        e.target.parentElement.closest(
          ".task"
        ).childNodes[0].lastChild.innerHTML = descriptionInput.value;
        existAddTask();
      } else {
        isEditing = false;
      }
      fetch(`http://localhost:3000/api/v1/todo/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: titleInput.value,
          description: descriptionInput.value,
        }),
      })
        .then((response) => response.json())

        .catch((err) => console.log(err));
    });
  };
}

searchInput.onchange = function () {
  const result = arrayOfTasks.filter((task) =>
    task.title.includes(searchInput.value)
  );
  addTaskToTasksFromArray(result);
};
sortButton.onclick = function () {
  let sorted = arrayOfTasks;
  for (let i = 0; i < sorted.length - 1; i++) {
    for (let j = 0; j < sorted.length - 1; j++) {
      if (sorted[i].date > sorted[i + 1].date) {
        let temp = sorted[i];
        sorted[i] = sorted[i + 1];
        sorted[i + 1] = temp;
      }
    }
  }
  addTaskToTasksFromArray(sorted);
};
