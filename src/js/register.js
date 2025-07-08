import axios from 'axios';
import { checkSesion, endPointUsers } from './main.js';

checkSesion("./dashboard.html");

const $registerForm = document.querySelector('#register-form');
const $fullName = document.querySelector('#register-name');
const $userName = document.querySelector('#register-username');
const $email = document.querySelector('#register-email');
const $phone = document.querySelector("#register-phone");
const $password = document.querySelector('#register-password');

$registerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    registerUser();
});

async function registerUser() {
    const newUser = {
        fullName: $fullName.value,
        userName: $userName.value,
        email: $email.value,
        phone: $phone.value,
        password: $password.value
    };

    try {
        const response = await axios.post(endPointUsers, newUser);
        if (response.status === 201) {
            localStorage.setItem("currentUser", JSON.stringify(response.data));
            alert("Usuario creado exitosamente");
            window.location.href = "./dashboard.html";
        } else {
            throw new Error("Error en la petición");
        }
    } catch (error) {
        console.error(error.message);
        alert("Error creando usuario");
    }
}
