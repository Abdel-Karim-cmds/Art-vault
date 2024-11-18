const { Encrypt, Decrypt } = require('./Security');
const { randomBytes } = require('crypto');

describe('Encryption and Decryption', () => {
    const text = "Hello world";
    const textEncrypted = Encrypt(text)

    test('Encrypt and Decrypt should work correctly', () => {
        const encryptedText = Encrypt(text);
        const decryptedText = Decrypt(encryptedText)
        expect(decryptedText).toBe(text);
    });

});