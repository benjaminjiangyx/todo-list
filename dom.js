import {
  createTodoItem,
  toggleTodoList,
  deleteTodoItem,
  updateTodoItemTitle,
  addTodoItem,
  findTodoItemById,
  updateTodoItemDate,
  PRIORITY_NORMAL,
} from "./todo.js";

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const prioritySelect = document.getElementById("priority-select");
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

    const priorityBadge = document.createElement("span");
    priorityBadge.textContent = todo.priority;
    priorityBadge.className = `priority-badge priority-${todo.priority}`;
    priorityBadge.dataset.action = "change-priority";
    priorityBadge.title = "Click to change priority";

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-button";
    deleteButton.dataset.action = "delete";

    listItem.appendChild(checkbox);
    listItem.appendChild(title);
    listItem.appendChild(priorityBadge);
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
      dueDate: Date.now(),
      priority: prioritySelect.value || PRIORITY_NORMAL,
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
    renderList();
  } else if (action === "delete") {
    todos = deleteTodoItem(todos, todoId);
    renderList();
  } else if (action === "change-priority") {
    const currentPriority = findTodoItemById(todos, todoId).priority;

    // Create a temporary select dropdown
    const select = document.createElement("select");
    select.className = "priority-select-inline";
    select.innerHTML = `
      <option value="low" ${currentPriority === 'low' ? 'selected' : ''}>Low</option>
      <option value="normal" ${currentPriority === 'normal' ? 'selected' : ''}>Normal</option>
      <option value="high" ${currentPriority === 'high' ? 'selected' : ''}>High</option>
    `;

    event.target.replaceWith(select);
    select.focus();

    select.addEventListener("change", () => {
      const todoItem = findTodoItemById(todos, todoId);
      const updatedItem = { ...todoItem, priority: select.value };
      todos = todos.map((item) => (item.id === todoId ? updatedItem : item));
      renderList();
    });

    select.addEventListener("blur", () => {
      renderList(); // Cancel if they click away
    });
  } else if (action === "edit") {
    const titleSpan = event.target;

    // Create an input element
    const input = document.createElement("input");
    input.type = "text";
    input.value = titleSpan.textContent;
    input.className = "edit-input";

    // Replace span with input
    titleSpan.replaceWith(input);
    input.focus();
    input.select();

    const saveEdit = () => {
      const newTitle = input.value.trim();
      if (newTitle) {
        const todoItem = findTodoItemById(todos, todoId);
        const updatedItem = updateTodoItemTitle(todoItem, newTitle);
        todos = todos.map((item) => (item.id === todoId ? updatedItem : item));
      }
      renderList();
    };

    // Save on Enter, cancel on Escape, save on blur (ie. click outside)
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        saveEdit();
      } else if (e.key === "Escape") {
        renderList(); // Cancel edit
      }
    });
    input.addEventListener("blur", () => {
      input.replaceWith(titleSpan);
    });
  } else if (action === "set-date") {
  }
});
