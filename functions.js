function verifyPassword(password) {
    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    return strongRegex.test(password) ? true : false;    //returning boolean value of the password validation check
}


module.exports = {
    verifyPassword: verifyPassword
}