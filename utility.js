class Validator {
    static isString(value){ 
        return typeof value === 'string' || value instanceof String;
    }
    static isLengthGreater(value) {
        return value.length > 2
    }
    static isValidEmail(value){ 
        return  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    }
    static isType(value, constructor){ 
        return value instanceof constructor
    }
    static isElementsSameType(array, constructor){
        return array.every(item => Validator.isType(item, constructor))
    }
}

const validOrThrow = (condition, error) => {if(condition) throw new Error(error)};

const checkContactParameters = (contactData) => {
    validOrThrow(!Validator.isString(contactData.name), 'Name must be a string')
    validOrThrow(!Validator.isLengthGreater(contactData.name), 'Name must be greater then 2')

    validOrThrow(!Validator.isString(contactData.surname), 'Surname must be a string')
    validOrThrow(!Validator.isLengthGreater(contactData.surname), 'Surname must be greater then 2')

    validOrThrow(!Validator.isValidEmail(contactData.email), 'Something went wrong with email, please check your email address')
}

const initializeCreationDate = () => {
    const now = new Date();
    return `${now.getDate()}.${now.getMonth()+1}.${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
}

const isUnique = arr => arr.length === new Set([...arr]).size;

module.exports = {
    Validator,
    checkContactParameters,
    initializeCreationDate,
    isUnique,
    validOrThrow
}