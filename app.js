const loginForm = document.getElementById("login-form");
const loginInput = loginForm.querySelector("input");
const greeting = document.getElementById("greeting");
const todoForm = document.getElementById("todo-form");
const todoInput = todoForm.querySelector("input");
const todoList = document.getElementById("todo-list");
const clock = document.getElementById("clock");
const weatherDiv = document.getElementById("weather");

const USERNAME_KEY = "username";
const TODOS_KEY = "todos";
let todos = [];

function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  clock.innerText = `${hours}:${minutes}:${seconds}`;
}

function paintGreeting(username) {
  greeting.innerText = `Hello, ${username}! `;
  loginForm.style.display = "none";
  todoForm.style.display = "block";
}

function onLoginSubmit(e) {
  e.preventDefault();
  const username = loginInput.value;
  localStorage.setItem(USERNAME_KEY, username);
  paintGreeting(username);
}

function saveTodos() {
  localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
}

function deleteTodo(e) {
  const li = e.target.parentElement;
  li.remove();
  todos = todos.filter(todo => todo.id !== parseInt(li.id));
  saveTodos();
}

function paintTodo(todoObj) {
  const li = document.createElement("li");
  li.id = todoObj.id;
  const span = document.createElement("span");
  span.innerText = todoObj.text;
  const btn = document.createElement("button");
  btn.innerText = "❌";
  btn.addEventListener("click", deleteTodo);
  li.appendChild(span);
  li.appendChild(btn);
  todoList.appendChild(li);
}

function onTodoSubmit(e) {
  e.preventDefault();
  const newTodo = todoInput.value;
  todoInput.value = "";
  const newTodoObj = {
    text: newTodo,
    id: Date.now()
  };
  todos.push(newTodoObj);
  paintTodo(newTodoObj);
  saveTodos();
}

function loadTodos() {
  const saved = localStorage.getItem(TODOS_KEY);
  if (saved) {
    todos = JSON.parse(saved);
    todos.forEach(paintTodo);
  }
}

function getWeather(lat, lon) {
  const API_KEY = "554d44845da3569e8248f7326d076ac6"; 
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
    .then(res => res.json())
    .then(data => {
      const weather = `${data.name} | ${data.weather[0].main} 🌡 ${data.main.temp}°C`;
      weatherDiv.innerText = weather;
    });
}

function onGeoOk(pos) {
  const lat = pos.coords.latitude;
  const lon = pos.coords.longitude;
  getWeather(lat, lon);
}

function onGeoError() {
  weatherDiv.innerText = "Can't find you. ";
}

function setRandomBg() {
  const images = [
    "https://source.unsplash.com/1600x900/?nature",
    "https://source.unsplash.com/1600x900/?city",
    "https://source.unsplash.com/1600x900/?space",
    "https://source.unsplash.com/1600x900/?ocean"
  ];
  const chosen = images[Math.floor(Math.random() * images.length)];
  document.body.style.backgroundImage = `url('${chosen}')`;
}

// 초기화
const savedUsername = localStorage.getItem(USERNAME_KEY);
if (savedUsername) {
  paintGreeting(savedUsername);
  loadTodos();
} else {
  loginForm.addEventListener("submit", onLoginSubmit);
}

todoForm.addEventListener("submit", onTodoSubmit);
setInterval(updateClock, 1000);
updateClock();
setRandomBg();
navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);
