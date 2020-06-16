import {v4 as uuidv4} from 'uuid';

const checkContactParameters = (contactData) => {
    if(typeof contactData.name !== 'string') throw new Error('name must be a string')
    if(contactData.name.length < 3) throw new Error('Name must be greater then 2')

    if(typeof contactData.surname !== 'string') throw new Error('Surname must be a string')
    if(contactData.surname.length < 3) throw new Error('Surname must be greater then 2')

    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactData.email)) throw new Error('something went wrong with email, please check your email address')
}

const initializeCreationDate = () => {
    const now = new Date();
    return `${now.getDate()}.${now.getMonth()+1}.${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
}

class AddressBook {

    allContacts = [];
    listOfContactGrupe = [];

    createNewContact(name, surname, email) {
        return new SingleContact({name,surname,email})
    }
          
    // addContactToGroup(contact, groupName)
    addContactToGroup(contact, groupName) {
        if(!(contact instanceof SingleContact)) {
            throw new Error('Given argument is not instace of SingleContact class, please enter correct argument');
        } else if(!(groupName instanceof ContactGroup)) {
            throw new Error('Given argument is not instace of ContactGroup class, please enter correct argument');
        } else {
            groupName.push(contact)
            return groupName;
        }
    }

    addContact(contact) {
        if(!(contact instanceof SingleContact)) {
            throw new Error('Given argument is not instace of SingleContact class, please enter correct argument');
        } else {
            // console.log(`New phone number has been added with ID - ${contact.id}`, contact);
            this.allContacts.push(contact);
            return this.allContacts;
        }
    }
    
    readContactList () {
        console.log(this.allContacts);
    }

    updateContactById(contactId, key, dataToUpdate) {
        const contact = this.allContacts.find(item => item.id === contactId);
        return contact.update(key, dataToUpdate)
    }

    deleteContactById(id) {
        const index = this.allContacts.findIndex(item => item.id === id);   
        this.allContacts.splice(index, 1);
    }

    findByValue(valueToFind) {
        if(typeof valueToFind !== 'string' || !valueToFind.length) throw new Error('introduced value is incorrect')
        const sorted = this.allContacts.filter(item => {
            const values = Object.values(item)
            for(const value of values) {
                if(value.toLowerCase().includes(valueToFind.toLowerCase())) {
                    return true
                }
            }
            return false
        }).sort((a,b) => {
            return a.surname - b.surname
        })
        return sorted
    }
}


class SingleContact {
    constructor(contactData) {
        this.validateKeys(contactData)
        checkContactParameters(contactData);

        this.name = contactData.name;
        this.surname = contactData.surname;
        this.email = contactData.email;
        this.id = uuidv4();
        this.date = initializeCreationDate();
    }


    validateKeys(contactData){
        if(!contactData.name || !contactData.surname || !contactData.email) {
            throw new Error('Data is missing one of the properties: name, surname, email');
        } else {
            return true
        }
    }

    validateValueForKey(key, value){
        if(key === 'name') {
            if(typeof value === 'string' && value.length > 3) {
                return true
            }
        }
        if(key === 'surname') {
            if(typeof value === 'string' && value.length > 3) {
                return true
            }
        }
        if(key === 'email') {
            if(typeof value === 'string' && value.length > 3) {
                return true
            }
        }
    }


    update(key, value) { 
        if(key === 'id' || key === 'date') throw new Error('Id and date cannot be updated!')
        if(Object.keys(this).includes(key.toLowerCase())){
            if(this.validateValueForKey(key.toLowerCase(), value)){
                this[key.toLowerCase()] = value
                this.date = initializeCreationDate();
            }
            else {
                throw new Error('invalid value, please enter correct value')
            }
        }else {
            throw new Error('Invalid Key, please enter correct key')
        }
    }

    read() {
        console.log(this);
    }
}

class ContactGroup {
    constructor(name) {
        this.name = name
        this.contactsGroup = []
    }

    add(contact) {
        if(!(contact instanceof SingleContact)) {
            throw new Error('Given argument is not instace of SingleContact class, please enter correct argument');
        } else {
            console.log(`New phone number has been added with ID - ${contact.id}`, contact);

            this.contactsGroup.push(contact)

            return this.contactsGroup
        }
    }

    read () {
        console.log(this.contactsGroup);
    }

    update (name) {
        this.name = name
    }

    deleteById(idToDelete) {
        const index = this.contactsGroup.findIndex(({id}) => id === idToDelete);   
        this.contactsGroup.splice(index, 1);
    }
}

const contact2 = new SingleContact({name: 'Zeszyk9', surname: 'Elton', email: 'kowal.ski@wp.pl'});
const contact = new SingleContact({name: 'Zbyszyk2', surname: 'Amadeusz', email: 'asdasd@wp.pl'});
const contact3 = new SingleContact({name: 'Zmszyk6', surname: 'Malik', email: 'kowal.ski@wp.pl'});
const contact1 = new SingleContact({name: 'Zaszyk3', surname: 'Bocian', email: 'kowal.ski@wp.pl'});
const book = new AddressBook();
