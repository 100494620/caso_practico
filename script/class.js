class User {
    constructor(user_name, user_surname, password, email, login_name, birthday, image, loginStatus, numOfPeople, people) {
        this.user_name = user_name;
        this.user_surname = user_surname;
        this.password = password;
        this.email = email;
        this.login_name = login_name;
        this.birthday = birthday;
        this.image = image;
        this.loginStatus = loginStatus;
        this.numOfPeople = numOfPeople;
        this.people = people;
    }
}

class Card {
    constructor(id, email, header, photo) {
        this.id = id;
        this.email = email;
        this.header = header;
        this.photo = photo;
    }
}


class Person {
    constructor(nameOfPerson, surnameOfPerson, emailOfPerson) {
        this.nameOfPerson = nameOfPerson;
        this.surnameOfPerson = surnameOfPerson;
        this.emailOfPerson = emailOfPerson;
    }
}