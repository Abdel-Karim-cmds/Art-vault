require('dotenv').config();
const { createCipheriv, createDecipheriv } = require('crypto');
const key = Buffer.from(process.env.KEY, 'base64');
const iv = Buffer.from(process.env.IV, 'base64');


function Encrypt(text) {
    const cipher = createCipheriv('aes256', key, iv);
    const encryptedText = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
    return encryptedText

}

function Decrypt(cipher) {
    const decipher = createDecipheriv('aes256', key, iv);
    const decryptedMessage = decipher.update(cipher, 'hex', 'utf-8') + decipher.final('utf8');
    return decryptedMessage
}

module.exports = {
    Decrypt: Decrypt,
    Encrypt: Encrypt
}