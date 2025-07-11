# 🐾 PetCare Center - Data Management con JavaScript

**Autor:** Juan Sebastián Cardona Rengifo  
**Clan:** Ciénaga

---

## Descripción del Proyecto

## Project Description

This repository contains a series of exercises and a complete CRUD project that implements advanced data structures in JavaScript, such as objects, arrays, maps, and sets.

The project simulates a pet and boarding management system using a fake REST API provided by JSON Server, allowing persistent CRUD operations during development.

The platform is built as a pet care center, where registered users can manage their pets and schedule temporary stays for them.

---

## Technologies Used

- **HTML5**
- **CSS3**
- **JavaScript (Vanilla)**
- **Vite** (as a development server)
- **Axios** (for HTTP calls)
- **JSON Server** (to simulate a REST database)

---

## Prerequisites

Make sure you have the following installed:

- **Node.js** v14 or higher
- **npm** (Node package manager)
- **Visual Studio Code** or another modern text editor
- **Updated web browser** (Chrome, Firefox, Edge, etc.)

---

## Installing and Running the Project

### 1. Clone the repository

`bash`
git clone https://github.com/juanscr24/data_management.git
cd data_management`

### 2. Install dependencies
`npm install`

### 3. Start the development server with Vite
`npm run dev`

This will generate a local URL, usually http://localhost:5173, which you can open in your browser.

### 4. Run JSON Server to simulate the API
`npx json-server src/data/db.json --watch`

This will open a server at http://localhost:3000 where you can access the pets, stays, and users endpoints.

## Features

### Authentication
- Registration and login using `localStorage`.
- Persistent authentication to prevent unauthorized access to the dashboard.

### Pet Management
- Create new pets associated with a user.
- Edit data such as name, age, type, and breed.
- Delete pets.
- Filter by `userId` in calls to the `/pets` endpoint.

### Stay Management
- Create stays by selecting registered pets.
- Edit dates and associated pets.
- Delete stays.
- List filtered by user (`userId`) and displays the name of the associated pet.

### Data Structures Used
- Arrays to store lists of pets and stays.
- Objects to model entities (`Pet`, `Stay`, `User`).
- Sets and Maps used in exercises to optimize data organization (see exercise folder).
