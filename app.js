// import {v4 as uuidv4} from 'uuid';
const { Validator, checkContactParameters, initializeCreationDate, isUnique, validOrThrow } = require('./utility');

class AddressBook {

    allContacts = [];
    listOfContactGroup = [];

    createNewContact(name, surname, email) {
        return new SingleContact({name,surname,email})
    }

    addGroup(group) {
        validOrThrow(!Validator.isType(group, ContactGroup), 'Method only argument is instance of ContactGroup')

        this.listOfContactGroup.push(group);
    }
          
    addContactToGroup(groupName, contact ) {
        validOrThrow(!Validator.isType(contact, SingleContact), 'Method only argument is instance of SingleContact')
        validOrThrow(!Validator.isString(groupName), 'grupeName must be a string')

        const index = this.listOfContactGroup.findIndex(item => item.name.toLowerCase() === groupName.toLowerCase());

        validOrThrow(index === -1, 'This ContactGroup dosent exist')

        const duplicatesInGroup = this.listOfContactGroup[index].contacts.find(({id}) => id === contact.id)

        validOrThrow(duplicatesInGroup !== undefined, 'This contact is already in group')
        
        this.listOfContactGroup[index].contacts.push(contact);
    }

    addContactsToGroup(groupName, ...contacts) {
        validOrThrow(!Validator.isElementsSameType(contacts, SingleContact), 'Method only argument is instace of SingleContact')
        validOrThrow(!Validator.isString(groupName), 'grupeName must be a string')
        validOrThrow(!isUnique(contacts), 'You cant add two the same numbers')

        const index = this.listOfContactGroup.findIndex(item => item.name.toLowerCase() === groupName.toLowerCase());

        const duplicatesInGroup = this.listOfContactGroup[index].contacts.some(contact => contacts.indexOf(contact) !== -1)

        validOrThrow(duplicatesInGroup, 'This contact is already in group')

        this.listOfContactGroup[index].contacts.push(...contacts)
    }

    addContacts(...contacts) {
        validOrThrow(!Validator.isElementsSameType(contacts, SingleContact), 'Method only argument is instace of SingleContact')
        validOrThrow(!isUnique(contacts), 'You cant add two the same numbers')
        
        const duplicatesInContacts = this.allContacts.some(contact => contacts.indexOf(contact) !== -1)

        validOrThrow(duplicatesInContacts, 'This contact is already in list')

        this.allContacts.push(...contacts)

        console.log(`${contacts.length} new contacts has been added`);
    }

    addContact(contact) {
        validOrThrow(!Validator.isType(contact, SingleContact), 'Given argument is not instace of SingleContact class, please enter correct argument')

        const duplicatesInContacts = this.allContacts.find(({id}) => id === contact.id)

        validOrThrow(duplicatesInContacts !== undefined, 'This contact is already in list')

        this.allContacts.push(contact);
        console.log(`New contact has been added`);
    }
    
    readContactList () {
        console.log(this.allContacts);
    }

    updateContactById(contactId, key, dataToUpdate) {

        const contact = this.allContacts.find(({id})=> id === contactId);

        validOrThrow(contact === undefined, 'There is no contact based on passed id')

        return contact.update(key,dataToUpdate)
    }

    deleteContactById(idToDelete) {

        const index = this.allContacts.findIndex(({id}) => id === idToDelete);

        validOrThrow(index === -1, `Nothing to delete based on ID`)

        this.allContacts.splice(index, 1);
    }

    findByPhrase(phrase) {
        if(!Validator.isString(phrase) || !phrase.length) throw new Error('Phrase must be a string and cannot be empty')

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
        this.id = 'contac';
        this.date = initializeCreationDate();
    }


    validateKeys(contactData={}){
        validOrThrow(typeof contactData !== 'object' && !Array.isArray(contactData), 'Argument must be an object with properties - name, surname, email')
        validOrThrow(!contactData.name || !contactData.surname || !contactData.email, 'Data is missing one of the properties: name, surname, email')

        return true
    }

    validateValueForKey(key, value){
        let isValid = false

        switch(true){
            case Object.keys(this).includes(key) && Validator.isString(value) && Validator.isLengthGreater(value):
                isValid = true
                break
            
            case key === 'email' && Validator.isString(value) && Validator.isLengthGreater(value) && Validator.isValidEmail(value):
                isValid = true
                break

            default:
                break;
        }
        return isValid
    }


    update(key, value) { 
        const _key = key.toLowerCase()

        validOrThrow(_key === 'id' || _key === 'date', 'Id and date cannot be updated!')

        const isKeyInContact = Object.keys(this).includes(_key)

        validOrThrow(!isKeyInContact, 'Invalid Key, there is no key like that')

        if(!this.validateValueForKey(_key, value)){
            throw new Error('invalid value, right value is not empty string')
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
        validOrThrow(!Validator.isString(name) || name.length < 3, 'Group name must be a string with length higher then 2')

        this.name = name
        this.contacts = []
    }


    addContact(contact) {
        validOrThrow(!Validator.isType(contact, SingleContact), 'Method only argument is instance of SingleContact')

        this.contacts.push(contact)
        console.log(`New contact has been added`);
    }

    readContacts () {
        console.log(this.contacts);
    }

    updateGroupName (nameToChange) {
        validOrThrow(!Validator.isString(nameToChange) || nameToChange.length < 3, 'Name to change must be a string with length higher then 2')
        this.name = nameToChange
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

module.exports = {
    SingleContact,
    ContactGroup,
    AddressBook
}
