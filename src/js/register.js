import axios from 'axios';
import { checkSesion, endPointUsers } from './main.js';

checkSesion("./dashboard.html");

// Const declared bringing HTML elements
const $registerForm = document.querySelector('#register-form');
const $fullName = document.querySelector('#register-name');
const $userName = document.querySelector('#register-username');
const $email = document.querySelector('#register-email');
const $phone = document.querySelector("#register-phone");
const $password = document.querySelector('#register-password');

// Function to Submit
$registerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    registerUser();
});

// Function to register 
async function registerUser() {
    const newUser = {
        fullName: $fullName.value.trim(),
        userName: $userName.value.trim(),
        email: $email.value.trim(),
        phone: $phone.value.trim(),
        password: $password.value,
        roleId: "8916" // Asignando el rol de 'customer' por defecto
    };

    try {
        // We check if the username or email already exists
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

        // If they do not exist, we proceed to create the user
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
