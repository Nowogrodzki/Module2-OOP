const { SingleContact, AddressBook, ContactGroup, checkContactParameters, initializeCreationDate } = require('./app');


// jak ma działać aplikacja ?
// użytkownik chce usunąć poszczególne kontakty z grupy / z ksiażki
// użytkownik chciałby zmodyfikować kontakt / grupę


// "use case"

// describe -> użytkownik chce dodać kilka kontaktów do ksiązki adresowej 
// tworzę kontakt X, Y, Z 
// dodaję do książki kontakt X, Y, Z
// -> sprawdzam ilość czy jest 3
// szukam Z
// -> sprawdzam czy jest Z


// describe -> użytkownik chce utworzyć z nich grupę "rodzina"
// przez addressbook dodaję grupę rodzina
// przez adresbook dodaję contact X, Y, Z do grupy rodzina
// -> sprawdzam czy ilość w grupie to 3



describe('Logika aplikacji działą poprawnie gdy', () => {
    describe('Klasa AddressBook', () => {
        const book = new AddressBook()
        const single1 = new SingleContact({name: "Jan", surname: 'Kowalski', email: 'kowalski@gmail.com'});
        const grupa = new ContactGroup('Kowalscy')
    
        test('Tworzy kontakt z poziomu AddressBook poprzez zwracanie instancji klasy SingleContact', () => {
            const contactCreatedByAddressBook = book.createNewContact('Roman', 'Kowal', 'roman.kowal@gmail.com')
            expect(typeof contactCreatedByAddressBook).toBe('object')
            expect(contactCreatedByAddressBook).toBeInstanceOf(SingleContact)
        })
    
        test('Dodaje kontakt który jest instacja klasy SingleContact do ksiażki telefonicznej poprzez metode Add', () => {
            book.addContact(single1)
            expect(book.allContacts).toHaveLength(1)
            expect(book.allContacts[0]).toBeInstanceOf(SingleContact)
            expect(book.allContacts[0]).toBe(single1)
        })
    
        test('Dodaje grupe kontaktów pochodzących z instancji ContactsGroup poprzez metode addGroup', () => {
            book.addGroup(grupa);
            expect(book.listOfContactGrupe[0]).toBe(grupa)
        })
    
        test('Dodaje kontakt do grupy kontaktów poprzez metode addContactToGroup', () => {
            book.addContactToGroup(single1, 'Kowalscy')
            expect(book.listOfContactGrupe[0].contacts[0]).toBe(single1)
        })
    
        test('Zmienia dane kontaktu z poziomu AddressBook za pomoca metody updateContactById, która przyjmuje id kontaktu który chcemy updatować, klucz w którym ma zostać zmieniona wartość i wartość do podmiany.', () => {
            book.updateContactById('ss', 'name', 'Tomasz')
            expect(single1.name).toBe('Tomasz')
        })
    
        test('Wyszykuje i sortując obiekty znajdujące się w tablicy allContacts za pomoca metody "findByPhrase" która przyjmuje jako argument fraze(string)', () => {
            expect(book.findByPhrase('tomasz')).toStrictEqual([single1])
        })
    
        test('Usuwa elementy z tablicy allContacts za pomocą metody deleteContactById, która przyjmuje id jako argument po którym jest szukany kontakt do usunięcia', () => {
            book.deleteContactById('ss')
            expect(book.allContacts).toHaveLength(0);
        })
        
    })
    
    describe('Klasa SingleContact', () => {
        const single = new SingleContact({name: "juras", surname: 'ogóras', email: 'juras@asd.com'});
    
        test('Zwraca kontakt, który posiada imie, nazwisko, email, id oraz date utworzenia kontaktu', () => {
            expect(single).toHaveProperty('name')
            expect(typeof single.name).toBe('string')
    
            expect(single).toHaveProperty('surname')
            expect(typeof single.surname).toBe('string')
    
            expect(single).toHaveProperty('email')
            expect(typeof single.email).toBe('string')
    
            expect(single).toHaveProperty('id')
            expect(typeof single.id).toBe('string')
    
            expect(single).toHaveProperty('date')
            expect(typeof single.date).toBe('string')
        })    
    })
    
    describe('Klasa ContactGroup', () => {
        const grupa = new ContactGroup('Janusze');
        const contact = new SingleContact({name: 'Tomek', surname: 'Nowak', email: 'tomek.nowak@gmail.com'})
        
        test('Dodaje kontakt który jest instacja klasy SingleContact do grupy kontaktów poprzez metode addContact', () => {
            grupa.addContact(contact)
            expect(grupa.contacts).toHaveLength(1)
            expect(grupa.contacts[0]).toBeInstanceOf(SingleContact)
            expect(grupa.contacts[0]).toBe(contact)
        })
    
        test('Zmienia nazwe grupy za pomocą metody updateGroupName', () => {
            grupa.updateGroupName('Nowaki');
            expect(grupa.name).toBe('Nowaki')
        })
    
        test('Usuwa elementy z tablicy contacts za pomocą metody deleteContactById, która przyjmuje id jako argument po którym jest szukany kontakt do usunięcia', () => {
            grupa.deleteContactById('ss')
            expect(grupa.contacts).toHaveLength(0);
        })
    
    })    
})

describe('Logika aplikacji "nie działa" poprawnie, prezentując odpowiednie komunikaty błędu', () => {

    describe('W przypadku klasy SingleContact', () => {

        test('Gdy użytkownik wprowadził argument innnego typu niż object', () => {
            const incorrectInputs = ['', '123', Date, Date.now(), 1,]
            incorrectInputs.forEach(input => {
                expect(() => {
                    new SingleContact(input)
                }).toThrow('Argument must be an object with properties - name, surname, email')
            })
        })
    
        test('Gdy użytkownik wprowadził argument typu "object" w którym brakuje któregoś z kluczy lub wprowadzono pusty object', () => {
            const incorrectInputs = [{}, , {name: 'asd', surname: 'ssss'}, []]
            incorrectInputs.forEach(input => {
                expect(() => {
                    new SingleContact(input)
                }).toThrow('Data is missing one of the properties: name, surname, email')
            })
        })
    })
    
})