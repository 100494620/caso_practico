const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#?!.,:;@$%^&*-]).{8,}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9.]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
const FAVOURITES = "favourites";
const SUBSCRIPTIONS = "newsletter_subs";
const SELECTED_PACK_KEY = "selected_pack";
let editPermission = false;

// submit image button functionality ONLY for html where it exists
const submit_button = document.getElementById("button-submit-image")
if (submit_button) {
    submit_button.addEventListener("click", function() {
        document.getElementById("fileR").click();
    });
}

// submit image in edited button functionality ONLY for html where it exists
const submit_button_edited = document.getElementById("button-submit-image-edited")
if (submit_button_edited) {
    submit_button_edited.addEventListener("click", function() {
        document.getElementById("fileE").click();
    });
}

// add tick when image is uploaded
const file_input_button = document.getElementById("fileR");
if (file_input_button) {
    file_input_button.addEventListener("change", () => {
        const fileName = document.getElementById("file-name");
        if (fileName) fileName.textContent = "✅";
    });
}

// add tick when editedimage is uploaded
const file_input_button_edited = document.getElementById("fileE");
if (file_input_button_edited) {
    file_input_button_edited.addEventListener("change", () => {
        const fileName = document.getElementById("file-name");
        if (fileName) fileName.textContent = "✅";
    });
}


// validate if checkmark was pressed
validateCheckmark();

// responsible for all on registration functions
function onRegistration() {
    console.log("Entered the saving data...")
    let user = readUserRegistrationData()
    let file = document.getElementById("fileR");

    // if profile picture was not selected -> alert
    if (!file.files || file.files.length === 0) {
        alert("You should select a profile picture!");
        return false;
    }

    // continue on if image was uploaded successfully
    function continueRegistration(base64File) {
        user.image = base64File;
        // check name (admitirá mínimo 3 caracteres de longitud)
        if ($("#nameR").val().length < 3) {
            alert("Name should be at least 3 characters");
            return false;
        }
        // check surname (compuesto por mínimo dos cadenas de caracteres de 3
        // caracteres de longitud cada una)
        const splits = $("#surnameR").val().trim().split(/\s+/);
        if (splits.length >= 2) {
            for (let split of splits) {
                if (split.length < 3) {
                    alert("Each surname should be at least 3 characters!");
                    return false;
                }
            }
        } else {
            alert("Surname should be composed at least out of two entries!");
            return false;
        }

        // check emails structure (admitirá valores tipo
        // nombre@dominio.extensión)
        if (!EMAIL_REGEX.test(user.email)) {
            alert("Email is not following the correct structure!");
            document.getElementById("emailR").value = '';
            return false;
        }

        // check if emails coincide
        const emailConfirm = document.getElementById("confirmEmailR").value;
        if (user.email !== emailConfirm) {
            alert("Emails don't match");
            document.getElementById("confirmEmailR").value = '';
            return false;
        }

        // check birthday with regard to an age
        const birthday = new Date($("#birthdayR").val());
        const today = new Date();
        let curr_age = (today - birthday) / (1000 * 60 * 60 * 24 * 365.25);
        if (curr_age < 16) {
            alert("You should be at least 16 years old!");
            return false;
        }

        // check login length  (representará el nombre de inicio de sesión y estará formado
        // por mínimo 5 caracteres de longitud)
        if ($("#loginR").val().length < 5) {
            alert("Login should be at least 5 characters");
            return false;
        }

        // check password's structure  (8 caracteres de longitud, con mínimo 2 números,
        // 1 carácter especial, 1 letra mayúscula y 1 letra minúscula)
        if (!PASSWORD_REGEX.test(user.password)) {
            alert("Password is not following the correct structure!");
            document.getElementById("passwordR").value = '';
            return false;
        }

        // check if consent field is checked in
        if (!$("#consent").is(":checked")) {
            alert("Please accept the policy!")
            return false;
        }

        console.log("Entered the saving data...");

        if (!registerUser(user)) {
            document.getElementById("loginR").value = '';
            document.getElementById("passwordR").value = '';
            return false;
        }

        confirmStored();
        const registeredUsers = getRegisteredUsers();
        loadUsersState(user, registeredUsers)
        isLoggedInWithParams(user);
        window.location.href = "versionB.html";
        return false;
    }

    // file transformation into the base64 in order to extract it later correctly
    if (file.files && file.files[0]) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const base64Image = event.target.result;
            continueRegistration(base64Image);
        };
        reader.readAsDataURL(file.files[0]);
    } else {
        continueRegistration(null);
    }
}

// checkmark validation (button is disactivated if checkmark is not clicked)
function validateCheckmark() {
    const checkbox = document.getElementById("consent");
    const button = document.getElementById("buttonR");
    if (!checkbox || !button) return;
    button.disabled = !checkbox.checked;
    checkbox.addEventListener("change", () => {
        button.disabled = !checkbox.checked;
    });
}

// read user's registration data from the fields
function readUserRegistrationData() {
    return new User(
        document.getElementById("nameR").value,
        document.getElementById("surnameR").value,
        document.getElementById("passwordR").value,
        document.getElementById("emailR").value,
        document.getElementById("loginR").value,
        document.getElementById("birthdayR").value,
        document.getElementById("fileR").value,
        false
    );
}

function confirmStored() {
    alert("Your data was stored correctly!")
}

// register user if login is unique
function registerUser(user) {
    // save user's information
    let registeredUsers = getRegisteredUsers();

    if (registeredUsers.has(user.login_name)) {
        alert("User already exists");
        return false;
    }
    registeredUsers.set(user.login_name, user);
    saveRegisteredUsersToStorage(registeredUsers);
    return true;
}

//localStorage.clear();

$("#LoginForm").submit(onLoginUser)

// on login checks and change of status in the local storage
function onLoginUser() {
    let enteredUsuario = document.getElementById("usuarioLogin").value;
    let enteredPassword = document.getElementById("passwordLogin").value;

    const registeredUsers = getRegisteredUsers();

    if (!registeredUsers.has(enteredUsuario)) {
        alert("You are not registered!");
        document.getElementById("usuarioLogin").value = "";
        document.getElementById("passwordLogin").value = "";
        return false;
    }

    let user = registeredUsers.get(enteredUsuario);
    if (user.password !== enteredPassword) {
        alert("Wrong password!");
        document.getElementById("passwordLogin").value = "";
        return false;
    }

    loadUsersState(user, registeredUsers)

    isLoggedInWithParams(user);
    // if logged in -> switch to the logged in page
    window.location.href = "versionB.html";
    return false;
}

// load login status of user (true if logged in)
function loadUsersState(user, registeredUsers) {
    user.loginStatus = true;
    registeredUsers.set(user.login_name, user);
    saveRegisteredUsersToStorage(registeredUsers);

    localStorage.setItem(EMAIL_LS_DATA, user.login_name);
}

function isLoggedInWithParams(user) {
    if (!user || !user.loginStatus) {
        return;
    }
}

// ask if user wants to log out
function onLogOut() {
    let result = confirm("Log out?");
    if (result) {
        logOut();
    }
}

// log out
function logOut() {
    const username = localStorage.getItem(EMAIL_LS_DATA);
    const registeredUsers = getRegisteredUsers();
    const user = registeredUsers.get(username);

    removeUsersState(user, registeredUsers)
    window.location.href='home.html'
}

// edit data
function editData() {
    window.location.href='edit_profile.html'
}

document.addEventListener("DOMContentLoaded", fillProfileForm);

function fillProfileForm() {
    const username = localStorage.getItem(EMAIL_LS_DATA);
    if (!username) return;

    const registeredUsers = getRegisteredUsers();
    const user = registeredUsers.get(username);
    if (!user) return;

    document.getElementById("nameE").value = user.user_name;
    document.getElementById("surnameE").value = user.user_surname;
    document.getElementById("emailE").value = user.email;
    document.getElementById("birthdayE").value = user.birthday;
    document.getElementById("loginE").value = user.login_name;
    const img = document.getElementById("profileAvatar");
    if (img && user.image) {
        img.src = user.image;
    }
}
function showPasswordFields() {
    const passwordFields = `
        <label class="forma-text" for="passwordEOld">Contraseña previa</label>
        <input type="password" id="passwordEOld" name="passwordEOld" placeholder="Contraseña anterior">

        <label class="forma-text" for="passwordENew">Contraseña nueva</label>
        <input type="password" id="passwordENew" name="passwordENew" placeholder="Contraseña nueva">
    `;

    // replace the button with the password fields
    $(buttonC).replaceWith(passwordFields);
}

function onEdit() {
    const username = localStorage.getItem(EMAIL_LS_DATA);
    if (!username) return;

    const registeredUsers = getRegisteredUsers();
    const user = registeredUsers.get(username);
    if (!user) return;

    if ($("#nameE").val().length < 3) {
        alert("Name should be at least 3 characters");
        return false;
    }
    // check surname (compuesto por mínimo dos cadenas de caracteres de 3
    // caracteres de longitud cada una)
    const splits = $("#surnameE").val().trim().split(/\s+/);
    if (splits.length >= 2) {
        for (let split of splits) {
            if (split.length < 3) {
                alert("Each surname should be at least 3 characters!");
                return false;
            }
        }
    } else {
        alert("Surname should be composed at least out of two entries!");
        return false;
    }

    // check emails structure (admitirá valores tipo
    // nombre@dominio.extensión)
    const email = $("#emailE").val();
    if (!EMAIL_REGEX.test(email)) {
        alert("Email is not following the correct structure!");
        document.getElementById("emailE").value = '';
        return false;
    }

    // check if emails coincide
    const emailConfirm = document.getElementById("confirmEmailE").value;
    if (email !== emailConfirm) {
        alert("Emails don't match");
        document.getElementById("confirmEmailE").value = '';
        return false;
    }

    // check birthday with regard to an age
    const birthday = new Date($("#birthdayE").val());
    const today = new Date();
    let curr_age = (today - birthday) / (1000 * 60 * 60 * 24 * 365.25);
    if (curr_age < 16) {
        alert("You should be at least 16 years old!");
        return false;
    }

    // check login length  (representará el nombre de inicio de sesión y estará formado
    // por mínimo 5 caracteres de longitud)
    if ($("#loginE").val().length < 5) {
        alert("Login should be at least 5 characters");
        return false;
    }

    // check password's structure  (8 caracteres de longitud, con mínimo 2 números,
    // 1 carácter especial, 1 letra mayúscula y 1 letra minúscula)

    const oldPasswordField = document.getElementById("passwordEOld");
    const newPasswordField = document.getElementById("passwordENew");

    let oldPassword = '';
    let newPassword = '';

    if (oldPasswordField && newPasswordField) {
        oldPassword = oldPasswordField.value;
        newPassword = newPasswordField.value;

        if (oldPassword || newPassword) {
            if (oldPassword !== user.password) {
                alert("Current passwords do not coincide!");
                oldPasswordField.value = '';
                newPasswordField.value = '';
                return false;
            }

            if (newPassword.length > 0 && !PASSWORD_REGEX.test(newPassword)) {
                alert("Password is not following the correct structure!");
                oldPasswordField.value = '';
                return false;
            }

            user.password = newPassword;
        }
    }

    const newFile = document.getElementById("fileE");
    function saveUserEdit(base64Image) {

        user.user_name = document.getElementById("nameE").value;
        user.user_surname = document.getElementById("surnameE").value;
        user.email = document.getElementById("emailE").value;
        user.birthday =document.getElementById("birthdayE").value
        user.login_name = document.getElementById("loginE").value

        if (base64Image) {
            user.image = base64Image;
        }

        registeredUsers.set(user.login_name, user);
        saveRegisteredUsersToStorage(registeredUsers);

        confirmStored();
        onQuitEditForm();
    }

    // file transformation into the base64 in order to extract it later correctly
    if (newFile.files && newFile.files[0]) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const base64Image = event.target.result;
            saveUserEdit(base64Image);
        };
        reader.readAsDataURL(newFile.files[0]);
    } else {
        saveUserEdit(null);
    }
}

function onQuitEdit(){
    window.location.href = "versionB.html";
}
// set login status to false when logging out
function removeUsersState(user, registeredUsers) {
    user.loginStatus = false;
    registeredUsers.set(user.login_name, user);
    saveRegisteredUsersToStorage(registeredUsers)

    localStorage.removeItem(EMAIL_LS_DATA);
}

function startEdit() {
    const container = document.getElementById("forma-container-profile");

    container.innerHTML = `
        <div class="forma-header">Mi perfil</div>
        <form id="registerForm">
            <div class="forma-left">
                <label class="forma-text" for="nameE">Nombre:</label>
                <input type="text" id="nameE" name="name" placeholder="Nombre">

                <label class="forma-text" for="emailE">Correo electronico:</label>
                <input type="text" id="emailE" name="email" placeholder="Correo electronico">

                <label class="forma-text" for="birthdayE">Fecha de nacimiento</label>
                <input type="date" id="birthdayE">

                <label class="forma-text" for="loginE">Username:</label>
                <input type="text" id="loginE" name="login" placeholder="login">

                <label class="forma-text" for="fileE">Subir imagen de perfil</label>
                <input type="file" id="fileE" name="filename" style="display:none;" accept=".webp,.png,.jpg,.jpeg">

                <button type="button" id="button-submit-image-edited">Examinar ...</button>
                <span id="file-name" style="margin-left:10px; font-size:1.2em;"></span>
            </div>

            <div class="forma-right">
                <label class="forma-text" for="surnameE">Apellidos:</label>
                <input type="text" id="surnameE" name="surname" placeholder="Apellidos">

                <label class="forma-text" for="confirmEmailE">Confirma el correo</label>
                <input type="text" id="confirmEmailE" name="confirmEmail" placeholder="Confirmar correo">
                <button type="button" class="change-pass-button" id="buttonC" onclick="showPasswordFields()">Cambiar contraseña</button>
            </div>
        </form>

        <div class="button-container-register">
            <button type="button" class="submit-button-forma" onclick="onQuitEditForm()">Quitar</button>
            <button type="button" class="submit-button-forma" onclick="onEdit()">Guardar</button>
        </div>
    `;

    fillProfileForm();

    const submit_button_edited = document.getElementById("button-submit-image-edited");
    if (submit_button_edited) {
        submit_button_edited.onclick = () => document.getElementById("fileE").click();
    }

    const file_input_button_edited = document.getElementById("fileE");
    if (file_input_button_edited) {
        file_input_button_edited.addEventListener("change", () => {
            document.getElementById("file-name").textContent = "✅";
        });
    }
}

function onQuitEditForm() {
    const container = document.getElementById("forma-container-profile");

    container.innerHTML = `

        <div class="forma-header">Mi perfil</div>
        <form id="registerForm">
            <div class="forma-left">
                <label class="forma-text" for="nameE">Nombre:</label>
                <input type="text" id="nameE" name="name" placeholder="Nombre" disabled>
                <label class="forma-text" for="surnameE">Apellidos:</label>
                <input type="text" id="surnameE" name="surname" placeholder="Apellidos" disabled>
                <label class="forma-text" for="loginE">Username:</label>
                <input type="text" id="loginE" name="login" placeholder="login" disabled>
                <label class="forma-text" for="emailE">Correo electronico:</label>
                <input type="text" id="emailE" name="email" placeholder="Correo electronico" disabled>
                <label class="forma-text" for="birthdayE">Fecha de nacimiento</label>
                <input type="date" id="birthdayE" disabled>
            </div>
            <div class="forma-right">
                <img id="profileAvatar" src="images/login-icon.png" alt="Avatar del usuario" />
                <button type="button" class="submit-button-forma" id="buttonFav" onclick="misFavoritos()">Mis Favoritos</button>
                <button type="button" class="submit-button-forma" id="buttonHistorial" onclick="miHistorial()" data-i18n="editProfile.history">Mi Historial</button>
            </div>
        </form>
        <div class="button-container-register">
            <button type="button" class="submit-button-forma" id="buttonQ" onclick="onQuitEdit()">Quitar</button>
            <button type="button" class="submit-button-forma" id="buttonEd" onclick="startEdit()">Editar</button>
        </div>
    </div>
    `;

    fillProfileForm();
}

function misFavoritos() {
    const container = document.getElementById("forma-container-profile");
    // take email as a key for associating the cards
    const email = localStorage.getItem(EMAIL_LS_DATA);

    container.innerHTML = `
        <div class="forma-header">Mis favoritos</div>
        <div class="cartas-grind" id="misCartas"></div>
        <div class="button-container-register">
            <button class="submit-button-forma" onclick="onQuitEditForm()">Volver</button>
        </div>
    `;

    const $favContainer = $("#misCartas");
    // get all the favourited cards
    let allFavourites = JSON.parse(localStorage.getItem(FAVOURITES)) || {};
    // take favs by user's email
    let userFavourites = allFavourites[email] || [];

    if (userFavourites.length === 0) {
        $favContainer.append(' <div class="carta-empty">You do not have any favourites :(</div>');
        return;
    }

    userFavourites.forEach(fav => {
        // add html card
        const carta = `
              <div class="carta" id="fav-${fav.id}" data-id="${fav.id}">
                   <div class="carta-header">${fav.header}</div>
                   <img class="carta-photo" src="${fav.photo}" alt="${fav.header}">
                   <button class="cartas-ver-mas-button">Ver más</button>
                   <button class="cartas-delete-button" onclick="removeCard('${fav.id}')">
                       Remove
                   </button>
              </div>
        `;
        $favContainer.append(carta);
    });

    // drag and drop
    $favContainer.sortable({
        tolerance: "pointer",
        update: function (event, ui) {
            updateOrder(email);
        }
    });
    $favContainer.disableSelection();
}

function updateOrder() {
    const newOrder = [];
    const email = localStorage.getItem(EMAIL_LS_DATA);

    let allFavourites = JSON.parse(localStorage.getItem(FAVOURITES)) || {};
    let userFavourites = allFavourites[email] || [];

    // get cards' new order
    $("#misCartas .carta").each(function () {
        const cardId = $(this).data("id");
        const card = userFavourites.find(c => c.id === cardId);
        if (card) {
            newOrder.push(card);
        }
    });

    allFavourites[email] = newOrder;
    localStorage.setItem(FAVOURITES, JSON.stringify(allFavourites));
}


// onclick on like button catcher for saving card
$(document).on("click", ".carta-like", function () {
    const card = this.parentElement;

    const id = card.id;
    const headerText = card.querySelector('.carta-header').textContent;
    const photoSrc = card.querySelector('.carta-photo').src;

    saveCard(id, headerText, photoSrc);
});

function saveCard(id, headerText, photoSrc) {
    const email = localStorage.getItem(EMAIL_LS_DATA);
    if (!email) {
        alert("Please log in to save favourites!");
        return;
    }

    try {
        // create new card for adding in favs
        const newCard = new Card(id, email, headerText, photoSrc);

        let allFavourites = JSON.parse(localStorage.getItem(FAVOURITES)) || {};
        let userFavourites = allFavourites[email] || [];

        if (userFavourites.length === 0) {
            const $favContainer = $("#misCartas");
            $favContainer.append(' <div class="carta-empty">You do not have any favourites :(</div>');
        }

        if (userFavourites.some(c => c.id === newCard.id)) {
            alert("Error! " + newCard.header + " is already saved!");
            return;
        }

        // save new favourited card to the storage
        userFavourites.push(newCard);
        allFavourites[email] = userFavourites;
        localStorage.setItem(FAVOURITES, JSON.stringify(allFavourites));

        alert(newCard.header + " was successfully saved!");

    } catch (error) {
        alert("Error in card saving!");
    }
}

function removeCard(id) {
    if (!confirm("Remove this card?")) {
        return;
    }
    const email = localStorage.getItem(EMAIL_LS_DATA);

    let allFavourites = JSON.parse(localStorage.getItem(FAVOURITES)) || {};
    let userFavourites = allFavourites[email] || [];

    let cardIndex = userFavourites.findIndex(c => c.id === id);

    if (cardIndex !== -1) {
        userFavourites.splice(cardIndex, 1);
        allFavourites[email] = userFavourites;
        localStorage.setItem(FAVOURITES, JSON.stringify(allFavourites));
        const cardHTML = document.querySelector(`.carta[data-id="${id}"]`);
        if (cardHTML) {
            cardHTML.remove();
        }
    }
    if (userFavourites.length === 0) {
        const $favContainer = $("#misCartas");
        $favContainer.append(' <div class="carta-empty">You do not have any favourites :(</div>');
    }
    //console.log(allFavourites);
}

// ============ CORRECCIÓN DEL FILTRO POR DESTINO ============
// Filtro por destino para cartas de experiencias (home y versionB)

document.addEventListener('DOMContentLoaded', function() {
     const initFilter = () => {
        const searchInput = document.getElementById('cardSearch');
        if (!searchInput) return;

        const cards = Array.from(document.querySelectorAll('.cartas-grind .carta'));

        // Mostrar solo los primeros 6 inicialmente
        function mostrarIniciales() {
            cards.forEach((card, index) => {
                if (index < 6) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        function filtrar() {
            const term = searchInput.value.trim().toLowerCase();
            
            // Si está vacío, volver a mostrar solo 6
            if (term === '') {
                mostrarIniciales();
                return;
            }

            // Si hay búsqueda, mostrar TODOS los que coincidan
            cards.forEach(card => {
                const headerEl = card.querySelector('.carta-header');
                const titulo = headerEl ? headerEl.textContent.toLowerCase() : '';
                const destino = card.getAttribute('data-destino').toLowerCase();
                
                const match = titulo.includes(term) || destino.includes(term);
                
                card.style.display = match ? '' : 'none';
            });
        }

        searchInput.addEventListener('input', filtrar);
        mostrarIniciales();
    };

    if (window.addEventListener && typeof window.languageLoaded !== 'undefined') {
        window.addEventListener('languageLoaded', initFilter);
    } else {
        setTimeout(initFilter, 1200);
    }
});

document.addEventListener("DOMContentLoaded", function() {
    subsribeToNewsletters();

});

function subsribeToNewsletters() {
    //public key from emailjs
    emailjs.init("nUFwX21uT667l74vK");

    // get subscription fields
    const nlInput = document.getElementById("nl-email");
    const nlButton = document.querySelector(".nl-btn");

    if (!nlButton || !nlInput) {
        return;
    }

    nlButton.addEventListener("click", function(e) {
        e.preventDefault();
        const email = nlInput.value.trim();

        if (!email) {
            alert("Escribe un email!");
            return;
        }

        if (!EMAIL_REGEX.test(email)) {
            alert("Email is not following the correct structure!");
            return;
        }

        let subscribers = JSON.parse(localStorage.getItem(SUBSCRIPTIONS)) || [];

        if (subscribers.includes(email)) {
            alert("You are already subscribed!");
            nlInput.value = "";
            return;
        }

        // emailjs service and template IDs
        const serviceID = "service_email_casoPract";
        const templateID = "template_qh1n9ep";

        const params = {
            user_email: email
        };

        // emailjs pipeline
        emailjs.send(serviceID, templateID, params)
            .then(() => {
                subscribers.push(email);
                localStorage.setItem(SUBSCRIPTIONS, JSON.stringify(subscribers));

                alert("Thank you for subscription!");
                nlInput.value = "";
            })
            .catch((err) => {
                alert("Error in subscribing!");
            });
    });
}

function miHistorial() {
    const container = document.getElementById("forma-container-profile");
    // take email as a key for associating the cards
    const email = localStorage.getItem(EMAIL_LS_DATA);

    container.innerHTML = `
        <div class="forma-header">Mis compras</div>
        <div class="cartas-grind" id="misCartas"></div>
        <div class="button-container-register">
            <button class="submit-button-forma" onclick="onQuitEditForm()">Volver</button>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", function() {
    fillBuyerInfo();
});

// fill in the info of the current account that is buying tickets with an email being unchangable
function fillBuyerInfo() {

    const email = localStorage.getItem(EMAIL_LS_DATA);
    const registeredUsers = getRegisteredUsers();
    const user = registeredUsers.get(email);

    if (user) {
        const nameInput = document.getElementById("FullName");
        const emailInput = document.getElementById("emailLogin");

        if (nameInput && emailInput) {
            nameInput.value = `${user.user_name} ${user.user_surname}`;
            emailInput.value = user.email;
            emailInput.readOnly = true;
        }
    }
}
// choose number of companions
$("#numPeople").on("input", function () {
    // check the input value and take it for a loop
    let num = parseInt(this.value, 10);
    $("#peopleE").empty();
    for (let i = 0; i < num; i++) {
        addPersonWithParams(new Person('', '', ''), i);
    }
});

// add companion
function addPersonWithParams(person, i) {
    const personHtml = `
        <div id="person-${i + 1}" class="person">
            <div class="forma-header">Compañero ${i + 1}</div>
            <label for="person-${i + 1}-name">Nombre</label>
            <input type="text" placeholder="Enter person's name" id="person-${i + 1}-name" name="person-${i + 1}-name" minlength="3" value="${person.nameOfPerson}">
            <label for="person-${i + 1}-surname">Apellidos</label>
            <input type="text" placeholder="Enter person's surname" id="person-${i + 1}-surname" name="person-${i + 1}-surname" minlength="3" value="${person.surnameOfPerson}">
            <label for="person-${i + 1}-email">Correo electronico</label>
            <input type="text" placeholder="Enter person's email" id="person-${i + 1}-email" name="person-${i + 1}-email" minlength="3" value="${person.emailOfPerson}">   
            <div class="people-container">
               <button class="button-remove-person" type="button" data-index="${i}">Eliminar Compañero</button>
            </div>
        </div>
    `;
    $("#peopleE").append(personHtml);
}
$(document).on("click", ".button-remove-person", function() {
    const index = $(this).data("index");
    $(`#person-${index+1}`).remove();
});

// choose a pet
$("#pet").on("change", function () {
    if (this.value === "yes") {
        $("#petInfoType").slideDown();
        $("#petType, #petSize").prop("required", true);
    } else {
        $("#petInfoType").slideUp();
        $("#petType, #petSize")
            .prop("required", false)
            .val("");
    }
});

function getSelectedPackFallback() {
    return { id: "sea-01", title: "Pack Sudeste Asiático", price: 600 };
}

function getSelectedPackFromStorage() {
    const raw = localStorage.getItem(SELECTED_PACK_KEY);
    if (!raw) return getSelectedPackFallback();

    try {
        const pack = JSON.parse(raw);
        const price = Number(pack.price);

        return {
            id: pack.id || "unknown",
            title: (pack.title || "").trim() || "Pack",
            price: Number.isFinite(price) ? price : 600
        };
    } catch (e) {
        return getSelectedPackFallback();
    }
}


// comprar functionality
$("#buy").on("submit", function (e) {
    e.preventDefault();
    const email = localStorage.getItem(EMAIL_LS_DATA);
    if (!email) {
        alert("Log in to buy!");
        return;
    }
    let registeredUsers = getRegisteredUsers();
    let user = registeredUsers.get(email);

    // get people who accompany you
    let companions = [];
    $(".person").each(function() {
        let name = $(this).find("input[name$='-name']").val();
        let surname = $(this).find("input[name$='-surname']").val();
        let email = $(this).find("input[name$='-email']").val();

        companions.push(new Person(name, surname, email));
    });

    // get pet info
    const userHasPet = $("#pet").val() === "yes";
    let petInfo = {
        hasPet: userHasPet,
        type: null,
        size: null
    };
    if (userHasPet) {
        petInfo.type = $("#petType").val();
        petInfo.size = $("#petSize").val();
    }

    // get card info
    let paymentInfo = {
        cardType: $("#cardType").val(),
        cardNumber: $("#card-number").val(),
        owner: $("#owner-name").val(),
        expiry: $("#fechaCaducidad").val()
    };


    // pack seleccionado desde el carrusel (guardado en localStorage)
    const selectedPack = getSelectedPackFromStorage();

    // purchase object
    const newPurchase = new Purchase(
        selectedPack.title,              // ombre dinámico
        selectedPack.price,              // recio dinámico
        new Date().toLocaleDateString(),
        paymentInfo,
        companions,
        petInfo,
        $("#allergies").val()
    );


    if (!user.purchases) {
        user.purchases = [];
    }

    user.purchases.push(newPurchase);

    user.people = companions;
    user.numOfPeople = companions.length;

    registeredUsers.set(email, user);
    saveRegisteredUsersToStorage(registeredUsers);

    alert("Thank you for your purchase");

    this.reset();
    $("#peopleE").empty();
    $("#petInfoType").hide();
    $("#numPeople").val(0);
});