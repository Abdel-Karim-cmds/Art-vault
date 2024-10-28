const sign_in_btn = document.getElementById('sign-in-btn')
const sign_up_btn = document.getElementById('sign-up-btn')
const container = document.querySelector('.container')

sign_up_btn.addEventListener('click', () => {
    container.classList.add("sign-up-mode")
})

sign_in_btn.addEventListener('click', () => {
    container.classList.remove("sign-up-mode")
})
const loginForm = document.getElementById('loginForm')
const signupForm = document.getElementById('signupForm')

signupForm.addEventListener('submit', async e => {
    e.preventDefault()
    const name = document.getElementById('signupName').value
    const email = document.getElementById('signupEmail').value
    const username = document.getElementById('signupUsername').value
    const password = document.getElementById('signupPassword').value
    const password2 = document.getElementById('signupPassword2').value
    const type = document.getElementById('type').ariaPressed == 'true' ? 'Buyer' : 'Artist'

    console.log(type)

    if(!name || !email || !password || !password2 || !username){
        createNotification('Please fill in all the fields','warning');
        return;
    }

    if (password !== password2) {
        createNotification('Passwords do not match', 'warning')
        return;
    }
    if (!verifyPassword(password)) {
        createNotification('Password is not strong enough', 'warning')
        return;
    }
    const response = await fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            email,
            password,
            type,
            username
        })
    })
    const data = await response.json();
    if (response.status === 500){
        createNotification(data.error, 'warning')
    }
    console.log(data)
    console.log(response.status)
    if (response.status === 200) {
        createNotification(data.message, 'success')
        // window.location.href = '/login'
        signupForm.reset();
        sign_in_btn.click();
    }
})



// Notifications

const toasts = document.querySelector('#toasts');

const createNotification = (message, type) => {
    // console.log(message, type);
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.innerText = message;
    toast.classList.add(type);
    toasts.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
};


function verifyPassword(password) {
    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    return strongRegex.test(password) ? true : false;    //returning boolean value of the password validation check
}
