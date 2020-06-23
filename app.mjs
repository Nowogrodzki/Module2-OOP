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

    addGroup(group) {

        if(!(group instanceof ContactGroup)) {
            throw new Error('Given argument is not instance of ContactGroup class, please enter correct argument');
        }

        this.listOfContactGrupe.push(group);

    }
          
    addContactToGroup(contact, groupName) {
        
        if(!(contact instanceof SingleContact)) {
            throw new Error('Given argument is not instace of SingleContact class, please enter correct argument');
        } 
        
        if(typeof groupName !== 'string') {
            throw new Error('Invalid type of argument, please enter correct argument');
        }
        
        const index = this.listOfContactGrupe.findIndex(item => item.name.toLowerCase() === groupName.toLowerCase());

        this.listOfContactGrupe[index].contactsGroup.push(contact);
        
    }

    addContact(contact) {

        if(!(contact instanceof SingleContact)) {
            
            throw new Error('Given argument is not instace of SingleContact class, please enter correct argument');

        } else {

            this.allContacts.push(contact);

            return this.allContacts;
        }
    }
    
    readContactList () {
        // console.log(this.allContacts);
        console.log(this.listOfContactGrupe);
    }

    updateContactById(contactId, key, dataToUpdate) {

        const contact = this.allContacts.find(item => item.id === contactId);

        return contact.update(key, dataToUpdate)
    }

    deleteContactById(id) {

        const index = this.allContacts.findIndex(item => item.id === id);

        this.allContacts.splice(index, 1);
    }

    findByPhrase(phrase) {
        if(typeof phrase !== 'string' || !phrase.length) throw new Error('introduced value is incorrect')

        const sorted = this.allContacts.filter(item => {

            const values = Object.values(item)

            function isPhaseInValue(value){
                return value.toLowerCase().includes(phrase.toLowerCase())
            }

            const itemContainsPhase = values.map(isPhaseInValue).some(el => el)
            
            return itemContainsPhase
        })
        .sort((a,b) => {
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

        let isValid = false

        switch(true){
            case Object.keys(this).includes(key) && typeof value === 'string' && value.length > 3:
                isValid = true
                break
            
            case key === 'email' && typeof value === 'string' && value.length > 3 && /(.+)@(.+){2,}\.(.+){2,}/.test(value):
                isValid = true
                break

            default:
                break;
        }
        return isValid
    }


    update(key, value) { 
        const _key = key.toLowerCase()
        if(_key === 'id' || _key === 'date') throw new Error('Id and date cannot be updated!')

        const isKeyInContact = Object.keys(this).includes(_key)

        if(!isKeyInContact){
            throw new Error('Invalid Key, please enter correct key')
        }

        if(!this.validateValueForKey(_key, value)){
            throw new Error('invalid value, please enter correct value')
        }

        this[_key] = value
        this.date = initializeCreationDate();

        return this
    }

    read() {
        console.log(this);
    }
}

class ContactGroup {
    constructor(name) {

        if(typeof name !== 'string' || name.length < 3) {
            throw new Error('Group name must be string with length higher then 2');
        }

        this.name = name
        this.contacts = []
    }


    addContact(contact) {
        if(!(contact instanceof SingleContact)) {
            throw new Error('Given argument is not instace of SingleContact class, please enter correct argument');

        } else {
            console.log(`New phone number has been added with ID - ${contact.id}`, contact);

            this.contacts.push(contact)

            return this.contacts
        }
    }

    readContacts () {
        console.log(this.contacts);
    }

    updateGroupName (name) {
        this.name = name
    }

    deleteContactById(idToDelete) {
        const index = this.contacts.findIndex(({id}) => id === idToDelete);   
        this.contacts.splice(index, 1);
    }
}

const contact1 = new SingleContact({name: 'Tomasz', surname: 'Kowalski', email: 'kowalski.tomasz@wp.pl'});
const contact2 = new SingleContact({name: 'Jan', surname: 'Nowak', email: 'jan.nowak@onet.pl'});
const book = new AddressBook();
const group = new ContactGroup('Lisy');
