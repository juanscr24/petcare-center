let isLogin = true;

const form = document.getElementById("auth-form");
const toggle = document.getElementById("toggle-form");
const title = document.getElementById("form-title");
const submitBtn = document.getElementById("submit-btn");
const message = document.getElementById("message");
const nameField = document.getElementById("name-field");

toggle.addEventListener("click", (e) => {
    e.preventDefault();
    isLogin = !isLogin;
    title.textContent = isLogin ? "Login" : "Registro";
    submitBtn.textContent = isLogin ? "Iniciar sesión" : "Registrarse";
    toggle.innerHTML = isLogin
        ? '¿No tienes cuenta? <a href="#">Regístrate</a>'
        : '¿Ya tienes cuenta? <a href="#">Inicia sesión</a>';

    nameField.classList.toggle("hidden");
    message.textContent = "";
});

form.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const fullname = document.getElementById("fullname")?.value.trim();

    if (!username || !password || (!isLogin && !fullname)) {
        message.style.color = "red";
        message.textContent = "Completa todos los campos";
        return;
    }

    if (isLogin) {
        login(username, password);
    } else {
        register(username, password, fullname);
    }
});

function register(username, password, fullname) {
    const users = JSON.parse(localStorage.getItem("users")) || {};

    if (users[username]) {
        message.style.color = "red";
        message.textContent = "El usuario ya existe";
        return;
    }

    users[username] = {
        password: password,
        fullname: fullname
    };

    localStorage.setItem("users", JSON.stringify(users));
    message.style.color = "green";
    message.textContent = "Usuario registrado con éxito. Ahora inicia sesión.";

    setTimeout(() => {
        toggle.click();
    }, 2000);
}

function login(username, password) {
    const users = JSON.parse(localStorage.getItem("users")) || {};

    if (!users[username]) {
        message.style.color = "red";
        message.textContent = "Usuario no encontrado";
        return;
    }

    if (users[username].password !== password) {
        message.style.color = "red";
        message.textContent = "Contraseña incorrecta";
        return;
    }

    const name = users[username].fullname;
    message.style.color = "green";
    message.textContent = `¡Bienvenido, ${name}! ✅`;
}
