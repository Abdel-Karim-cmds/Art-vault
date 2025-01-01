const {verifyPassword} = require('./functions')

describe('verifyPassword', () => {
    test('should return true for a strong password', () => {
        const password = '@Password123';
        const result = verifyPassword(password);
        expect(result).toBe(true);
    });

    test('should return false for a weak password', () => {
        const password = 'password';
        const result = verifyPassword(password);
        expect(result).toBe(false);
    });
})