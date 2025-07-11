export const endPointUsers = "http://localhost:3000/users";
export const endPointPets = "http://localhost:3000/pets";
export const endPointStays = "http://localhost:3000/stays";

export function checkSesion(redirectRoute) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser != null) {
        window.location.href = redirectRoute;
    }
}

export function checkForDashboard() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser == null) {
        window.location.href = "/"; 
    }
}
