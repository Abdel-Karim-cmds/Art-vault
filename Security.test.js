const { Encrypt, Decrypt } = require('./Security');
const { randomBytes } = require('crypto');

describe('Encryption and Decryption', () => {
    const text = "Hello world";
    const textEncrypted = Encrypt(text)

    test('Encrypt and Decrypt should work correctly', () => {
        const encryptedText = Encrypt(text);
        const decryptedText = Decrypt(encryptedText)
        // const encryptedText = Encrypt(testText, testKey, testIv);
        // const decryptedText = Decrypt(encryptedText, testKey, testIv);
        expect(decryptedText).toBe(text);
    });

    // test('Decrypting with wrong key should fail', () => {
    //     const encryptedText = Encrypt(testText, testKey, testIv);
    //     const wrongKey = randomBytes(32);
    //     expect(() => {
    //         Decrypt(encryptedText, wrongKey, testIv);
    //     }).toThrow();
    // });

    // test('Decrypting with wrong IV should fail', () => {
    //     const encryptedText = Encrypt(testText, testKey, testIv);
    //     const wrongIv = randomBytes(16);
    //     expect(() => {
    //         Decrypt(encryptedText, testKey, wrongIv);
    //     }).toThrow();
    // });
});