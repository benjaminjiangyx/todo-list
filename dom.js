import {
  createTodoItem,
  toggleTodoList,
  deleteTodoItem,
  updateTodoItemTitle,
  addTodoItem,
  findTodoItemById,
} from "./todo.js";

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
let todos = [];

function renderList() {
  todoList.innerHTML = "";
  for (const todo of todos) {
    const listItem = document.createElement("li");
    listItem.className = "todo-item";
    listItem.dataset.id = todo.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.className = "todo-checkbox";
    checkbox.dataset.action = "toggle";

    const title = document.createElement("span");
    title.textContent = todo.title;
    title.dataset.action = "edit";
    if (todo.completed) {
      title.style.textDecoration = "line-through";
    }

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-button";
    deleteButton.dataset.action = "delete";

    listItem.appendChild(checkbox);
    listItem.appendChild(title);
    listItem.appendChild(deleteButton);
    todoList.appendChild(listItem);
  }
}

// Handles adding todo items via the Submit form button
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const todoText = input.value.trim();
  if (todoText) {
    const todo = createTodoItem({
      id: Date.now().toString(),
      title: todoText,
      completed: false,
    });
    todos = addTodoItem(todos, todo);
    input.value = "";
    renderList();
  }
});

// Handles all other buttons via data-action attributes
todoList.addEventListener("click", (event) => {
  const action = event.target.dataset.action;
  if (!action) return;

  const listItem = event.target.closest(".todo-item");
  if (!listItem) return;
  const todoId = listItem.dataset.id;

  if (action === "toggle") {
    todos = toggleTodoList(todos, todoId);
  } else if (action === "delete") {
    todos = deleteTodoItem(todos, todoId);
  } else if (action === "edit") {
    const newTitle = prompt(
      "Update todo title:",
      findTodoItemById(todos, todoId).title
    );

    if (newTitle !== null && newTitle.trim() !== "") {
      const todoItem = findTodoItemById(todos, todoId);
      const updatedItem = updateTodoItemTitle(todoItem, newTitle.trim());
      todos = todos.map((item) => (item.id === todoId ? updatedItem : item));
    } else {
      return;
    }
  }

  renderList();
});
