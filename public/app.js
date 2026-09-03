const list = document.getElementById('todo-list');
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');

async function load() {
  const res = await fetch('/api/todos');
  const todos = await res.json();
  list.innerHTML = '';
  todos.forEach(todo => {
    const li = document.createElement('li');
    if (todo.done) li.classList.add('done');
    const span = document.createElement('span');
    span.textContent = todo.text;
    span.onclick = () => toggle(todo);
    const del = document.createElement('button');
    del.textContent = 'Delete';
    del.onclick = () => remove(todo.id);
    li.append(span, del);
    list.appendChild(li);
  });
}

async function toggle(todo) {
  await fetch(`/api/todos/${todo.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ done: !todo.done }),
  });
  load();
}

async function remove(id) {
  await fetch(`/api/todos/${id}`, { method: 'DELETE' });
  load();
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  input.value = '';
  load();
});

load();
