const REGISTERED_USERS_LS_DATA = "registeredUsers";
// should be USERNAME_LS_DATA, but was too late to change it throughout the code
const EMAIL_LS_DATA = "username";

function getRegisteredUsers() {
    let registeredUsersString = localStorage.getItem(REGISTERED_USERS_LS_DATA);
    return !registeredUsersString ? new Map() : new Map(JSON.parse(registeredUsersString));
}

function saveRegisteredUsersToStorage(registeredUsers) {
    const usersString = JSON.stringify(Array.from(registeredUsers));
    localStorage.setItem(REGISTERED_USERS_LS_DATA, usersString);
}

function getMyInfo() {
    let email = localStorage.getItem(EMAIL_LS_DATA);
    return !email ? null : getRegisteredUsers().get(email)
}

const BOOKINGS_LS_DATA = "historial_compras"; 

/**
 * Guarda una nueva reserva en el historial general
 * @param {Object} nuevaReserva
 */
function guardarReserva(nuevaReserva) {
    // Obtenemos lo que ya hay guardado
    let historial = JSON.parse(localStorage.getItem(BOOKINGS_LS_DATA)) || [];
    
    // Añadimos la nueva reserva a la lista
    historial.push(nuevaReserva);
    
    // Guardamos la lista actualizada
    localStorage.setItem(BOOKINGS_LS_DATA, JSON.stringify(historial));
    console.log("Reserva guardada en Storage:", nuevaReserva);
}


//Obtiene las reservas solo del usuario actual
 
function getMisReservas() {
    const user = getMyInfo();
    if (!user) return [];

    let historial = JSON.parse(localStorage.getItem(BOOKINGS_LS_DATA)) || [];
    
    // Filtramos para devolver solo las compras de este email
    return historial.filter(reserva => reserva.usuario === user.email);
}