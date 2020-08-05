const { SingleContact, AddressBook, ContactGroup } = require('./app');

describe('Użytkownik chce dodać kilka kontaktów do książki adresowej', () => {
    const x = new SingleContact({name: 'Tomasz', surname: 'Kowalski', email: 'kowalski.tomasz@wp.pl'})
    const y = new SingleContact({name: 'Jan', surname: 'Nowak', email: 'jan.nowak@onet.pl'})
    const z = new SingleContact({name: 'Jurek', surname: 'Kowal', email: 'jurek.kowal@interia.pl'})
    const book = new AddressBook();
    const group = new ContactGroup('rodzina')
    test('Tworzy kontakt X, Y, Z', () => {
        expect(x).toBeInstanceOf(SingleContact);
        expect(y).toBeInstanceOf(SingleContact);
        expect(z).toBeInstanceOf(SingleContact);
    })

    test('Dodaje do książki kontakt x, y, z', () => {
        book.addContacts(x,y,z)
        expect(book.allContacts).toHaveLength(3)
    })

    test('Szuka w tablicy kontaktu "z" ', () => {
        expect(book.findByPhrase('Tomasz')).toStrictEqual([book.allContacts[0]])
    })
    
describe('Użytkownik chce utworzyć z nich grupe kontaktów "rodzina"', () => {
    test('Przez klase AddressBook dodaję grupę rodzina', () => {
        book.addGroup(group)
        expect(book.listOfContactGroup).toHaveLength(1);
    })

    test('Przez klase AddressBook dodaje kontakty X, Y, Z do grupy "rodzina" ', () => {
        book.addContactsToGroup('rodzina', x,y,z);
        expect(book.listOfContactGroup[0].contacts).toHaveLength(3);
    })
})

describe('Użytkownik chce usunąć kontakt X', () => {
    test('Z książki telefonicznej', () => {
        book.deleteContactById('contac')
        expect(book.allContacts).toHaveLength(2)
    })

    test('Z grupy kontaktów "rodzina" ', () => {
        group.deleteContactById('contact')
        expect(group.contacts).toHaveLength(2)
    })
})

describe('Użytkownik modyfikuje kontakt Y', () => {
    test('Z poziomu klasy AddressBook poprzez wyszukanie kontaktu z listy za pomoca ID', () => {
        book.updateContactById('contac', 'name', 'Julian')
        expect(y.name).toBe('Julian')
    })
    test('Z poziomu klasy SingleContact wywołując metode update na kontakcie', () => {
        y.update('surname', 'Król')
        expect(y.surname).toBe('Król')
    })
})

describe('Użytkownik chce zmienić nazwe grupy', () => {
    test('Z nazwy "rodzina" na "królowie"', () => {
        group.updateGroupName('Królowie')
        expect(group.name).toBe('Królowie')
    })
})

})

describe('Logika aplikacji "nie działa" poprawnie, prezentując odpowiednie komunikaty błędu', () => {
    const x = new SingleContact({name: 'Tomasz', surname: 'Kowalski', email: 'kowalski.tomasz@wp.pl'})
    const book = new AddressBook();
    const group = new ContactGroup('rodzina')
    book.addGroup(group)

    describe('Gdy użytkownik niepoprawnie utworzył', () => {
        test('Kontakt nie wprowadzając żadnej wartości lub brakuje chociaż jednego klucza', () => {
            expect(() => {
                new SingleContact()
            }).toThrow('Data is missing one of the properties: name, surname, email')
        })
        test('Grupe kontaktów, wprowadzając nazwe, której długość jest mniejsza niż 2 lub jest pustym ciagiem', () => {
            expect(() => {
                new ContactGroup()
            }).toThrow('Group name must be a string with length higher then 2')
        })
    })

    describe('Gdy użytkownik próbuje dodać kilka tych samych kontaktów', () => {
        test('Do ksiązki adresowje', () => {
            expect(() => {
                book.addContacts(x, x)
            }).toThrow('You cant add two the same numbers')
            
            expect(() => {
                book.addContact(x)
                book.addContact(x)
            }).toThrow('This contact is already in list')
        })
        test('Do grupy kontaktów', () => {
            expect(() => {
                book.addContactsToGroup('rodzina', x,x)
            }).toThrow('You cant add two the same numbers')

            expect(() => {
                book.addContactToGroup('rodzina', x)
                book.addContactToGroup('rodzina', x)
            }).toThrow('This contact is already in group')
        })
    })

    describe('Gdy użytkownik chce zmienić wartość w kontakcie lecz', () => {
        test('Wprowadził nieistniejący klucz', () => {
            expect(() => {
                book.updateContactById('contac', 'asd', 'Maciej')
            }).toThrow('Invalid Key, there is no key like that')
        })
        test('Wprowadził wartość nieodpowiedniego typu', () => {
            expect(() => {
                book.updateContactById('contac', 'name', 123)
            }).toThrow('invalid value, right value is not empty string')
        })
    })
})