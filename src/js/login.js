import axios from 'axios';
import { checkSesion, endPointUsers } from './main.js';

checkSesion("./dashboard.html");

const $loginForm = document.querySelector('#login-form');
const $userName = document.querySelector('#login-username');
const $password = document.querySelector('#login-password');

$loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    login();
});

async function login() {
    try {
        const response = await axios.get(`${endPointUsers}?userName=${$userName.value}`);

        if (response.data.length !== 1) {
            alert('La cuenta no existe, te invito a registrarte');
            return;
        }

        if (response.data[0].password === $password.value) {
            localStorage.setItem("currentUser", JSON.stringify(response.data[0]));
            alert('Login exitoso');
            window.location.href = "./dashboard.html";
        } else {
            alert('Contraseña incorrecta');
        }
    } catch (error) {
        console.error(error);
        alert('Error en el login');
    }
}
