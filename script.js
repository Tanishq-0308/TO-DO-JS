const home = document.querySelector(".todo-container");
const submit = document.querySelector("#submit");
const input = document.querySelector("#input");
const themeToggle = document.querySelector("#theme-toggle");

let todos = JSON.parse(localStorage.getItem('todos')) || [];
// Add event listener for theme toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
});

submit.addEventListener("click", (e) => {
  e.preventDefault();
  if (input.value === "") return;
  todos.push({ text: input.value, completed: false });
  input.value = "";
  saveAndRenderTodos();
});

function renderTask() {
  home.innerHTML = "";
  todos.forEach((todo, index) => {
    const list = document.createElement("li");
    list.classList.add("listing");

    const listItem = document.createElement("span");
    listItem.classList.add("item");
    listItem.textContent = todo.text;

    const buttons = document.createElement("div");

    const button = document.createElement("button");
    button.classList.add("delete");
    button.textContent = "DELETE";

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit");
    editBtn.textContent = "EDIT";

    const checker = document.createElement("input");
    checker.type = "checkbox";
    checker.className = "checker";
    checker.checked = todo.completed;

    const upward = document.createElement("span");
    upward.innerHTML = `<i class="ri-arrow-up-line"></i>`;
    upward.className = "upward";

    const downward = document.createElement("span");
    downward.innerHTML = `<i class="ri-arrow-down-line"></i>`;
    downward.className = "downward";

    if (todo.completed) {
      editBtn.setAttribute("disabled", "true");
      list.classList.add("complete");
      listItem.classList.add("cut");
    }

    checker.addEventListener("change", () => {
      todo.completed = checker.checked;
      if (checker.checked) {
        editBtn.setAttribute("disabled", "true");
        list.classList.add("complete");
        listItem.classList.add("cut");
      } else {
        editBtn.removeAttribute("disabled");
        list.classList.remove("complete");
        listItem.classList.remove("cut");
      }
      saveAndRenderTodos();
    });

    editBtn.onclick = () => editTask(list, index, editBtn);
    button.onclick = () => deleteTask(index);
    upward.onclick = () => moveUp(index);
    downward.onclick = () => moveDown(index);

    list.appendChild(checker);
    home.appendChild(list);
    list.appendChild(listItem);
    buttons.appendChild(editBtn);
    buttons.appendChild(button);
    list.appendChild(buttons);
    buttons.appendChild(upward);
    buttons.appendChild(downward);
  });
}

function deleteTask(index) {
  todos = todos.filter((_, i) => i !== index);
  saveAndRenderTodos();
}

function editTask(list, index, editBtn) {
  editBtn.style.display = "none";
  const taskText = list.querySelector(".item");
  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.value = todos[index].text;
  editInput.className = "edit-input";

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "SAVE";
  saveBtn.className = "SaveBtn";
  saveBtn.onclick = () => saveEdit(index, list, editInput.value);

  taskText.innerHTML = "";
  list.appendChild(editInput);
  list.appendChild(saveBtn);
  editInput.focus();
}

function saveEdit(index, li, newValue) {
  if (newValue.trim()) {
    todos[index].text = newValue.trim();
    saveAndRenderTodos();
  } else {
    renderTask();
  }
}

function moveUp(index) {
  if (index > 0) {
    [todos[index - 1], todos[index]] = [todos[index], todos[index - 1]];
  }
  saveAndRenderTodos();
}

function moveDown(index) {
  if (index < todos.length - 1) {
    [todos[index + 1], todos[index]] = [todos[index], todos[index + 1]];
  }
  saveAndRenderTodos();
}

function saveAndRenderTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
  renderTask();
}

renderTask();
