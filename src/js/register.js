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
        fullName: $fullName.value.trim(),
        userName: $userName.value.trim(),
        email: $email.value.trim(),
        phone: $phone.value.trim(),
        password: $password.value
    };

    try {
        // Primero verificamos si el username o email ya existen
        const [userNameCheck, emailCheck] = await Promise.all([
            axios.get(`${endPointUsers}?userName=${newUser.userName}`),
            axios.get(`${endPointUsers}?email=${newUser.email}`)
        ]);

        if (userNameCheck.data.length > 0) {
            alert("El nombre de usuario ya está en uso. Por favor elige otro.");
            return;
        }

        if (emailCheck.data.length > 0) {
            alert("El correo electrónico ya está registrado. Por favor usa otro.");
            return;
        }

        // Si no existen, procedemos a crear el usuario
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
