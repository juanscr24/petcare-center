import axios from 'axios';
import { checkSesion, endPointUsers } from './main.js';

checkSesion("./dashboard.html");

// Const declared bringing HTML elements
const $loginForm = document.querySelector('#login-form');
const $userName = document.querySelector('#login-username');
const $password = document.querySelector('#login-password');

// Function to Submit
$loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    login();
});

// Function to login 
async function login() {
    // Get username endpoint 
    try {
        const response = await axios.get(`${endPointUsers}?userName=${$userName.value}`);

        //Validating that the account exist
        if (response.data.length !== 1) {
            alert('La cuenta no existe, te invito a registrarte');
            return;
        }

        //Validating the array in the position 0 is the same to password
        if (response.data[0].password === $password.value) {
            localStorage.setItem("currentUser", JSON.stringify(response.data[0]));
            alert('Login exitoso');
            window.location.href = "./dashboard.html";
        } else {
            alert('Contraseña incorrecta');
        }
    
    // Catch any error
    } catch (error) {
        console.error(error);
        alert('Error en el login');
    }
}
