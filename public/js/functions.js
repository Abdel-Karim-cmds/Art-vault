
// Notifications

function showToast(message,type) {
    console.log(message,type)
    var toast = document.getElementById("toast");
    toast.className = "toast show";
    toast.classList.add(type);
    toast.querySelector('.toast-body').innerText = message;
    setTimeout(function () {
        toast.className = toast.className.replace("show", "");
    }, 3000);
}


function verifyPassword(password) {
    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    return strongRegex.test(password) ? true : false;    //returning boolean value of the password validation check
}

// module.exports = {
//     verifyPassword:verifyPassword
// }

// Example of triggering the toast
// showToast("This is a toast message!","info");