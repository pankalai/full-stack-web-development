"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNewPatientEntry = void 0;
const isString = (text) => {
    return typeof text === 'string' || text instanceof String;
};
const parseName = (param) => {
    if (!isString(param)) {
        throw new Error('Incorrect or missing name');
    }
    return param;
};
const isDate = (date) => {
    return Boolean(Date.parse(date));
};
const parseDateOfBirth = (param) => {
    if (!isString(param) || !isDate(param)) {
        throw new Error('Incorrect or missing date of birth: ' + param);
    }
    return param;
};
const parseSsn = (param) => {
    if (!isString(param)) {
        throw new Error('Incorrect or missing ssn');
    }
    return param;
};
const parseGender = (param) => {
    if (!isString(param)) {
        throw new Error('Incorrect or missing gender');
    }
    return param;
};
const parseOccupation = (param) => {
    if (!isString(param)) {
        throw new Error('Incorrect or missing occupation');
    }
    return param;
};
const toNewPatientEntry = (object) => {
    if (typeof object !== 'object' || !object) {
        throw new Error('Invalid input');
    }
    if ('name' in object && 'dateOfBirth' in object && 'ssn' in object && 'gender' in object && 'occupation' in object) {
        const newEntry = {
            name: parseName(object.name),
            dateOfBirth: parseDateOfBirth(object.dateOfBirth),
            ssn: parseSsn(object.ssn),
            gender: parseGender(object.gender),
            occupation: parseOccupation(object.occupation)
        };
        return newEntry;
    }
    throw new Error('Missing fields in input');
};
exports.toNewPatientEntry = toNewPatientEntry;
