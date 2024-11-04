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

    if (!name || !email || !password || !password2 || !username) {
        showToast('Please fill in all the fields', 'warning');
        return;
    }

    if (password !== password2) {
        showToast('Passwords do not match', 'warning')
        return;
    }
    if (!verifyPassword(password)) {
        showToast('Password is not strong enough', 'warning')
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
    if (response.status === 500) {
        showToast(data.error, 'warning')
    }
    console.log(data)
    console.log(response.status)
    if (response.status === 200) {
        showToast(data.message, 'success')
        // window.location.href = '/login'
        signupForm.reset();
        sign_in_btn.click();
    }
})


loginForm.addEventListener('submit', async e => {
    e.preventDefault()
    const email = document.getElementById('loginEmail').value
    const password = document.getElementById('loginPassword').value
    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    })

    const data = await response.json();
    console.log(data.success)
    if (data.success) {
        console.log(data)
        showToast(data.message, 'success')
        if (data.userType == 'Buyer') {

            setTimeout(() => {
                window.location.href = '/'
            }, 1000)
        }
        else if (data.userType == 'Artist') {

            setTimeout(() => {
                window.location.href = '/profile'
            }, 1000)
        }
    }
    else {
        console.log('There is something wrong')
        showToast(data.error, 'error')
    }
})