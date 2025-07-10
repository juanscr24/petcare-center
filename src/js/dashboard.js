import axios from 'axios';
import { checkForDashboard, endPointPets } from './main.js';

checkForDashboard();

const $logoutBtn = document.getElementById('logout-btn');
const $addPetBtn = document.getElementById('add-pet-btn');
const $petFormModal = document.getElementById('pet-form-modal');
const $petForm = document.getElementById('pet-form');
const $cancelPetFormBtn = document.getElementById('cancel-pet-form');
const $petsContainer = document.getElementById('pets-container');

// Mapeo de imágenes por tipo
const categoryImages = {
    "Perros": "../../public/img/perros.webp",
    "Gatos": "../../public/img/gatos.webp",
    "default": "../../public/img/default.webp"
};

// Evento para cerrar sesión
$logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = './login.html';
});

// Mostrar formulario para agregar mascota
$addPetBtn.addEventListener('click', () => {
    $petFormModal.classList.remove('hidden');
    $petForm.reset();
    $petForm.onsubmit = async (e) => {
        e.preventDefault();
        await addPet();
    };
});

// Cancelar formulario
$cancelPetFormBtn.addEventListener('click', () => {
    $petFormModal.classList.add('hidden');
    $petForm.reset();
    $petForm.onsubmit = async (e) => {
        e.preventDefault();
        await addPet();
    };
});

// Delegar eventos de Editar y Eliminar
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

// Agregar nueva mascota
async function addPet() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const petType = document.getElementById('pet-type-select').value;
    const petTypeRaze = document.getElementById('pet-type').value;

    const newPet = {
        name: document.getElementById('pet-name').value,
        raze: petTypeRaze,
        type: petType,
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

// Cargar mascotas del usuario
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
        <p><strong>Raza:</strong> ${pet.raze}</p>
        <p><strong>Mascota:</strong> ${pet.type}</p>
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

// Eliminar mascota
async function handleDeletePet(petId) {
    if (!confirm('¿Seguro que quieres eliminar esta mascota?')) return;

    try {
        const response = await axios.delete(`${endPointPets}/${petId}`);
        if (response.status === 200 || response.status === 204) {
            alert('Mascota eliminada');
            loadPets();
        } else {
            throw new Error('Error eliminando mascota');
        }
    } catch (error) {
        console.error(error);
        alert('No se pudo eliminar la mascota');
    }
}

// Editar mascota (precargar formulario)
async function handleEditPet(petId) {
    try {
        const response = await axios.get(`${endPointPets}/${petId}`);
        const pet = response.data;

        document.getElementById('pet-name').value = pet.name;
        document.getElementById('pet-age').value = pet.age;
        document.getElementById('pet-type-select').value = pet.type;

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

// Actualizar mascota
async function updatePet(petId) {
    const petType = document.getElementById('pet-type-select').value;

    const updatedPet = {
        name: document.getElementById('pet-name').value,
        type: petType,
        age: Number(document.getElementById('pet-age').value),
        image: categoryImages[petType] || categoryImages["default"]
    };

    try {
        const response = await axios.put(`${endPointPets}/${petId}`, updatedPet);
        if (response.status === 200) {
            alert('Mascota actualizada');
            $petFormModal.classList.add('hidden');
            $petForm.reset();

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

// Cargar mascotas al iniciar
loadPets();
