export function createTodoItem({
  id = Date.now().toString(),
  title,
  completed = false,
}) {
  return {
    id: id,
    title: title,
    completed: completed,
  };
}

// Adds the todo item created above, to the ENTIRE todo list
export function addTodoItem(todoList, todoItem) {
  return [...todoList, todoItem]; // ... copies all existing properties
}

export function toggleTodoList(todoList, todoItemId) {
  return todoList.map((item) =>
    item.id === todoItemId ? toggleTodoItem(item) : item
  );
}

// Internal helper function to toggle a single todo item
export function toggleTodoItem(todoItem) {
  return {
    ...todoItem,
    completed: !todoItem.completed,
  };
}

export function updateTodoItemTitle(todoItem, newTitle) {
  return {
    ...todoItem,
    title: newTitle,
  };
}

export function deleteTodoItem(todoList, todoItemId) {
  return todoList.filter((item) => item.id !== todoItemId);
}

export function findTodoItemById(todoList, todoItemId) {
  return todoList.find((item) => item.id === todoItemId);
}
