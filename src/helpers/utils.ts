import { unlink } from 'fs/promises';
import fs from 'fs';

/**
 * @async
 * @function deleteFile
 * @description deletes a file
 * @param {string} path - path to file
 * @returns {Promise<void>}
 */
export async function deleteFile(path: string): Promise<void> {
    try {
        if (!path || path?.trim() === '') {
            console.log('No path provided');
            return;
        }
        if (fs.existsSync(path)) {
            await unlink(path);
        }
    } catch (err) {
        console.log(err);
    }
}

/**
 * @function pickObjectProperty
 * @description Pick particular property from object and returns the filtered object
 * @param {IFilterObject} object
 * @param {property} property
 * @returns {string|null} data
 */
export function pickObjectProperty<T extends object, K extends keyof T>(
    object: T,
    property: K
): NonNullable<T[K]> {
    const newKey = object[property] == 0 ? 0 : object[property] || null;
    delete object[property];
    return newKey as NonNullable<T[K]>;
}

export function generateTempPassword() {
    const length = 16;
    const specialChars = '!@#$%^&*()_-+=<>?';
    const numbers = '0123456789';
    const capitalLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const smallLetters = 'abcdefghijklmnopqrstuvwxyz';

    // Create an array with all possible characters
    const allChars = specialChars + numbers + capitalLetters + smallLetters;

    // Function to get a random character from a given string
    const getRandomChar = (source: string) => source[Math.floor(Math.random() * source.length)];

    // Ensure at least one character from each category
    const passwordArray = [
        getRandomChar(specialChars),
        getRandomChar(numbers),
        getRandomChar(capitalLetters),
        getRandomChar(smallLetters),
    ];

    // Generate the rest of the password
    for (let i = passwordArray.length; i < length; i++) {
        passwordArray.push(getRandomChar(allChars));
    }

    // Shuffle the array to randomize the order of characters
    passwordArray.sort(() => Math.random() - 0.5);

    // Convert the array to a string
    const password = passwordArray.join('');

    return password;
}
