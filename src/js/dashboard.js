import axios from 'axios';
import { checkForDashboard, endPointPets, endPointStays } from './main.js';

checkForDashboard();

// Const declared bringing HTML elements

const $logoutBtn = document.getElementById('logout-btn');
const $addPetBtn = document.getElementById('add-pet-btn');
const $petFormModal = document.getElementById('pet-form-modal');
const $petForm = document.getElementById('pet-form');
const $cancelPetFormBtn = document.getElementById('cancel-pet-form');
const $petsContainer = document.getElementById('pets-container');

const $addStayBtn = document.getElementById('add-stay-btn');
const $stayFormModal = document.getElementById('stay-form-modal');
const $stayForm = document.getElementById('stay-form');
const $cancelStayFormBtn = document.getElementById('cancel-stay-form');
const $staysContainer = document.getElementById('stays-container');

// Mapping images by type
const categoryImages = {
    "Perro": "../../public/img/perros.webp",
    "Gato": "../../public/img/gatos.webp",
    "default": "../../public/img/default.webp"
};

// LOGOUT 
$logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = './login.html';
});

// PETS

// Show form to add pet
$addPetBtn.addEventListener('click', () => {
    $petFormModal.classList.remove('hidden');
    $petForm.reset();
    $petForm.onsubmit = async (e) => {
        e.preventDefault();
        await addPet();
    };
});

// Cancel pet form
$cancelPetFormBtn.addEventListener('click', () => {
    $petFormModal.classList.add('hidden');
    $petForm.reset();
    $petForm.onsubmit = async (e) => {
        e.preventDefault();
        await addPet();
    };
});

// Delegate Edit and Delete Pet Events
$petsContainer.addEventListener('click', async (e) => {
    if (e.target.classList.contains('edit-btn')) {
        const petId = e.target.dataset.id;
        handleEditPet(petId);
    }
    if (e.target.classList.contains('delete-btn')) {
        const petId = e.target.dataset.id;
        await handleDeletePet(petId);
    }
});

// Add new pets
async function addPet() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const petType = document.getElementById('pet-type-select').value;
    const petTypeRaze = document.getElementById('pet-type').value;

    const newPet = {
        name: document.getElementById('pet-name').value,
        type: petType,
        raze: petTypeRaze,
        age: Number(document.getElementById('pet-age').value),
        image: categoryImages[petType] || categoryImages["default"],
        userId: currentUser.id
    };

    try {
        const response = await axios.post(endPointPets, newPet);
        if (response.status === 201) {
            alert('Mascota agregada');
            $petFormModal.classList.add('hidden');
            $petForm.reset();
            loadPets();
        } else {
            throw new Error("Error creando mascota");
        }
    } catch (error) {
        console.error(error);
        alert('Error al agregar mascota');
    }
}

// Upload user pets
async function loadPets() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    try {
        const response = await axios.get(`${endPointPets}?userId=${currentUser.id}`);
        $petsContainer.innerHTML = '';

        response.data.forEach(pet => {
            const petCard = document.createElement('div');
            petCard.classList.add('pet-card');
            petCard.innerHTML = `
                <img src="${pet.image || 'https://via.placeholder.com/150'}" alt="Foto de la mascota" />
                <h3>${pet.name}</h3>
                <p><strong>Mascota:</strong> ${pet.type}</p>
                <p><strong>Raza:</strong> ${pet.raze}</p>
                <p><strong>Edad:</strong> ${pet.age} años</p>
                <div class="card-buttons">
                    <button class="edit-btn" data-id="${pet.id}">Editar</button>
                    <button class="delete-btn" data-id="${pet.id}">Eliminar</button>
                </div>
            `;
            $petsContainer.appendChild(petCard);
        });
    } catch (error) {
        console.error(error);
    }
}

//  Delete Pets
async function handleDeletePet(petId) {
    if (!confirm('¿Seguro que quieres eliminar esta mascota?')) return;

    try {
        const response = await axios.delete(`${endPointPets}/${petId}`);
        if (response.status === 200 || response.status === 204) {
            alert('Mascota eliminada');
            loadPets();
            loadStays(); // Recharge stays in case you delete pets with stays
        } else {
            throw new Error('Error eliminando mascota');
        }
    } catch (error) {
        console.error(error);
        alert('No se pudo eliminar la mascota');
    }
}

// Edit pet (preload form)
async function handleEditPet(petId) {
    try {
        const response = await axios.get(`${endPointPets}/${petId}`);
        const pet = response.data;

        document.getElementById('pet-name').value = pet.name;
        document.getElementById('pet-age').value = pet.age;
        document.getElementById('pet-type-select').value = pet.type;
        document.getElementById('pet-type').value = pet.raze;

        $petFormModal.classList.remove('hidden');

        $petForm.onsubmit = async (e) => {
            e.preventDefault();
            await updatePet(petId);
        };

    } catch (error) {
        console.error(error);
        alert('Error cargando datos de la mascota');
    }
}

// Update pets
async function updatePet(petId) {
    const petType = document.getElementById('pet-type-select').value;

    const updatedPet = {
        name: document.getElementById('pet-name').value,
        type: petType,
        raze: document.getElementById('pet-type').value,
        age: Number(document.getElementById('pet-age').value),
        image: categoryImages[petType] || categoryImages["default"]
    };

    try {
        const response = await axios.put(`${endPointPets}/${petId}`, updatedPet);
        if (response.status === 200) {
            alert('Mascota actualizada');
            $petFormModal.classList.add('hidden');
            $petForm.reset();

            // Return to add pet mode
            $petForm.onsubmit = async (e) => {
                e.preventDefault();
                await addPet();
            };

            loadPets();
        } else {
            throw new Error('Error actualizando mascota');
        }
    } catch (error) {
        console.error(error);
        alert('No se pudo actualizar la mascota');
    }
}

// --- STAYS ---

// Show form to add stay
$addStayBtn.addEventListener('click', async () => {
    $stayFormModal.classList.remove('hidden');
    $stayForm.reset();
    await populatePetSelect();
    $stayForm.onsubmit = async (e) => {
        e.preventDefault();
        await addStay();
    };
});

// Cancel stay form
$cancelStayFormBtn.addEventListener('click', () => {
    $stayFormModal.classList.add('hidden');
    $stayForm.reset();
    $stayForm.onsubmit = async (e) => {
        e.preventDefault();
        await addStay();
    };
});

// Delegate events to edit and delete stays
$staysContainer.addEventListener('click', async (e) => {
    const stayId = e.target.dataset.id;

    if (e.target.classList.contains('edit-stay-btn')) {
        handleEditStay(stayId);
    }

    if (e.target.classList.contains('delete-stay-btn')) {
        await handleDeleteStay(stayId);
    }
});

// Upload pets for selector during stay
async function populatePetSelect() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    try {
        const response = await axios.get(`${endPointPets}?userId=${currentUser.id}`);
        const petSelect = document.getElementById('stay-pet-select');
        petSelect.innerHTML = '<option value="">Selecciona una mascota</option>';
        response.data.forEach(pet => {
            petSelect.innerHTML += `<option value="${pet.id}">${pet.name}</option>`;
        });
    } catch (error) {
        console.error('Error cargando mascotas para estadías', error);
    }
}

// Add stay
async function addStay() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const newStay = {
        startDate: document.getElementById('stay-start-date').value,
        endDate: document.getElementById('stay-end-date').value,
        petId: document.getElementById('stay-pet-select').value,
        userId: currentUser.id
    };

    if (!newStay.petId) {
        alert('Por favor selecciona una mascota');
        return;
    }

    try {
        const response = await axios.post(endPointStays, newStay);
        if (response.status === 201) {
            alert('Estadía agregada');
            $stayFormModal.classList.add('hidden');
            $stayForm.reset();
            loadStays();
        } else {
            throw new Error('Error creando estadía');
        }
    } catch (error) {
        console.error(error);
        alert('Error al agregar estadía');
    }
}

// Load stays
async function loadStays() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    try {
        const response = await axios.get(`${endPointStays}?userId=${currentUser.id}`);
        $staysContainer.innerHTML = '';

        for (const stay of response.data) {
            // Get pet display name
            const petResponse = await axios.get(`${endPointPets}/${stay.petId}`);
            const petName = petResponse.data.name;

            const stayDiv = document.createElement('div');
            stayDiv.classList.add('stay-card');
            stayDiv.innerHTML = `
                <p><strong>${petName}</strong></p>
                <p><strong>Desde:</strong> ${stay.startDate}</p>
                <p><strong>Hasta:</strong> ${stay.endDate}</p>
                <div class="card-buttons">
                    <button class="edit-stay-btn" data-id="${stay.id}">Editar</button>
                    <button class="delete-stay-btn" data-id="${stay.id}">Eliminar</button>
                </div>
            `;
            $staysContainer.appendChild(stayDiv);
        }
    } catch (error) {
        console.error(error);
    }
}

// Edit stay (preload form)
async function handleEditStay(stayId) {
    try {
        const response = await axios.get(`${endPointStays}/${stayId}`);
        const stay = response.data;

        $stayFormModal.classList.remove('hidden');
        $stayForm.reset();

        await populatePetSelect();
        document.getElementById('stay-pet-select').value = stay.petId;
        document.getElementById('stay-start-date').value = stay.startDate;
        document.getElementById('stay-end-date').value = stay.endDate;

        $stayForm.onsubmit = async (e) => {
            e.preventDefault();
            await updateStay(stayId);
        };

    } catch (error) {
        console.error('Error cargando estadía', error);
        alert('No se pudo cargar la estadía');
    }
}

// Update Stays
async function updateStay(stayId) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const updatedStay = {
        startDate: document.getElementById('stay-start-date').value,
        endDate: document.getElementById('stay-end-date').value,
        petId: document.getElementById('stay-pet-select').value,
        userId: currentUser.id
    };

    if (!updatedStay.petId) {
        alert('Por favor selecciona una mascota');
        return;
    }

    try {
        const response = await axios.put(`${endPointStays}/${stayId}`, updatedStay);
        if (response.status === 200) {
            alert('Estadía actualizada');
            $stayFormModal.classList.add('hidden');
            $stayForm.reset();
            loadStays();

            // Return to add mode
            $stayForm.onsubmit = async (e) => {
                e.preventDefault();
                await addStay();
            };
        } else {
            throw new Error("Error actualizando estadía");
        }
    } catch (error) {
        console.error(error);
        alert("No se pudo actualizar la estadía");
    }
}

// Delete stay
async function handleDeleteStay(stayId) {
    if (!confirm('¿Seguro que quieres eliminar esta estadía?')) return;

    try {
        const response = await axios.delete(`${endPointStays}/${stayId}`);
        if (response.status === 200 || response.status === 204) {
            alert('Estadía eliminada');
            loadStays();
        } else {
            throw new Error("Error eliminando estadía");
        }
    } catch (error) {
        console.error(error);
        alert('No se pudo eliminar la estadía');
    }
}

// Initialize functions
loadPets();
loadStays();
