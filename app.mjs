import {v4 as uuidv4} from 'uuid';

const checkContactParameters = (name, surname, email) => {
    if(typeof name !== 'string') throw new Error('name must be a string')
    if(name.length < 3) throw new Error('Name must be greater then 2')

    if(typeof surname !== 'string') throw new Error('Surname must be a string')
    if(surname.length < 3) throw new Error('Surname must be greater then 2')

    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('something went wrong with email, please check your email address')
}

const dateOfCreate = () => {
    const now = new Date();
    return `contact has been created - ${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
}

class AddressBook {
    constructor() {
        this.allContacts = [];
        this.listOfContactGrupe = [];
    }

    create(name,surname,email) {
        return new SingleContact({name,surname,email});
    }
          
    add(contact) {
        if(!(contact instanceof SingleContact)) {
            throw new Error('Given argument is not instace of SingleContact class, please enter correct argument');
        } else {
            console.log(`New phone number has been added with ID - ${contact.id}`, contact);
            return this.allContacts.push(contact);
        }
    }
    
    readContactList () {
        return console.log(this.allContacts);
    }

    updateById(id, key, dataToUpade) {
        if(key === 'id' || key === 'date') throw new Error('id and date cannot be updated')
        const contact = this.allContacts.find(item => item.name === id);
        return contact.update(key, dataToUpade);
    }

    deleteById(id) {
        const index = this.allContacts.findIndex(item => item.id === id);   
        this.allContacts.splice(index, 1);
    }

    sortByValue(valueToFind) {
        return this.allContacts.filter(item => {
            const values = Object.values(item)
            for(const value of values) {
                if(value.toLowerCase().includes(valueToFind.toLowerCase())) return item
            }
        })
    }
}

class SingleContact {
    #date = dateOfCreate();
    constructor(contactData) {
        if(!contactData.name || !contactData.surname || !contactData.email) {
            throw new Error('Data is missing one of the properties: name, surname, email');
        }

        checkContactParameters(contactData.name, contactData.surname, contactData.email);

        this.name = contactData.name;
        this.surname = contactData.surname;
        this.email = contactData.email;
        this.id = uuidv4();
        this.date = this.#date;
    }

    update(key, dataToUpade) {
        for(const element in this) {
            checkContactParameters(this.name, this.surname, this.email)
            if(key === 'id' || key === 'date') throw new Error('Id and date cannot be updated!')
            if(element.toLowerCase() === key.toLowerCase()) {
                this[element] = dataToUpade;
            }
            this.#date = dateOfCreate();
        }
    }

    read() {
        return console.log(this);
    }
}

class ContactGrupe {
    constructor() {
        this.contactsGroup = [];
    }

    create(name, surname, email) {
        return SingleContact({name, surname, email})
    }

    add(contact) {
        if(!(contact instanceof SingleContact)) {
            throw new Error('Given argument is not instace of SingleContact class, please enter correct argument');
        } else {
            console.log(`New phone number has been added with ID - ${contact.id}`, contact);
            return this.allContacts.push(contact);
        }
    }

    read () {
        console.log(this.contactsGroup);
    }

    update () {

    }

    deleteById(id) {
        const index = this.contactsGroup.findIndex(item => item.id === id);   
        this.contactsGroup.splice(index, 1);
    }
}

const contact = new SingleContact({name: 'Zbych', surname: 'Nowak', email: 'asdasd@wp.pl'});
const contact1 = new SingleContact({name: 'Zby', surname: 'Kowalskik', email: 'kowal.ski@wp.pl'});
const book = new AddressBook();

