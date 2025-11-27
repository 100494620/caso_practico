const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#?!.,:;@$%^&*-]).{8,}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9.]+@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;

// submit image button functionality ONLY for html where it exists
const submit_button = document.getElementById("button-submit-image")
if (submit_button) {
    submit_button.addEventListener("click", function() {
        document.getElementById("fileR").click();
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

// set login status to false when logging out
function removeUsersState(user, registeredUsers) {
    user.loginStatus = false;
    registeredUsers.set(user.login_name, user);
    saveRegisteredUsersToStorage(registeredUsers)

    localStorage.removeItem(EMAIL_LS_DATA);
}

