var loadFile = function (event) {
    var output = document.getElementById('output');
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function () {
        URL.revokeObjectURL(output.src) // free memory
    }
    output.style.display = 'block';
};


document.getElementById('passwordModal').addEventListener('submit', e => {
    e.preventDefault();

    console.log('submitting')

    const current_password = document.getElementById('current_password').value
    const newPassword = document.getElementById('new_password').value
    const confirmPassword = document.getElementById('confirm_password').value



    if (!newPassword || !confirmPassword || !current_password) {
        showToast('Please fill all the fields', 'warning')
        // alert('Please fill all the fields')
    }
    else if (newPassword !== confirmPassword) {
        showToast('Passwords do not match', 'error')
    }
    else {
        changePassword()
    }
})

async function changePassword() {
    const current_password = document.getElementById('current_password').value
    const newPassword = document.getElementById('new_password').value

    if (!verifyPassword(newPassword)) {
        showToast('Incorrect password format', 'warning')
        return
    }

    const response = await fetch('/change-password', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            current_password,
            newPassword,
        })
    })

    const data = await response.json()

    if (response.status === 200) {
        showToast(data.message, 'success')
        document.getElementById('current_password').value = ''
        document.getElementById('new_password').value = ''
        document.getElementById('confirm_password').value = ''
    }
    else {
        showToast(data.message, 'error')
    }
}


function showToast(message) {
    var toast = document.getElementById("toast");
    toast.className = "toast show";
    toast.innerText = message;
    setTimeout(function () { toast.className = toast.className.replace("show", ""); }, 3000);
}

// Example of triggering the toast
// showToast("This is a toast message!");

(async function getUserInfo() {
    const response = await fetch('/user-info', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const data = await response.json()
    console.log(data)
    populateUserInfo(data[0])
})()

function populateUserInfo(data) {
    console.log('HERE')
    console.log(data)
    document.getElementById('username').innerText = data.Username
    document.getElementById('email').innerText = data.Email
    document.getElementById('Full_Name').innerText = data.Name
    document.getElementById('phone').innerText = data.Phone
    document.getElementById('username_form').value = data.Username
    document.getElementById('email_form').value = data.Email
    document.getElementById('full_name_form').value = data.Name
    document.getElementById('phone_form').value = data.Phone
}


document.getElementById('idPhotoForm').addEventListener('submit', e => {
    e.preventDefault()
    if (document.getElementById('idPhoto').files.length === 0) {
        showToast('Please select a photo', 'warning')
        return
    }

    uploadPhoto()
})

async function uploadPhoto() {
    const photo = document.getElementById('idPhoto').files[0]
    const formData = new FormData()
    formData.append('photo', photo)

    const response = await fetch('/upload-photo', {
        method: 'POST',
        body: formData
    })

    const data = await response.json()

    if (response.status === 200) {
        showToast(data.message, 'success')
        location.reload()
    }
    else {
        showToast(data.message, 'error')
    }
}


const img = document.getElementById("id_photo")
img.addEventListener("error", function (event) {
    event.target.src = "../../images/avatar.jpg"
    event.onerror = null
})



async function changePassword() {
    const current_password = document.getElementById('current_password').value
    const newPassword = document.getElementById('new_password').value

    if (!verifyPassword(newPassword)) {
        showToast('Incorrect password format', 'warning')
        return
    }

    const response = await fetch('/change-password', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            current_password,
            newPassword,
        })
    })

    const data = await response.json()

    if (response.status === 200) {
        showToast(data.message, 'success')
        document.getElementById('current_password').value = ''
        document.getElementById('new_password').value = ''
        document.getElementById('confirm_password').value = ''
    }
    else {
        showToast(data.message, 'error')
    }
}


document.getElementById('editModal').addEventListener('submit', async e => {
    e.preventDefault();

    const username = document.getElementById('username_form').value
    const email = document.getElementById('email_form').value
    const full_name = document.getElementById('full_name_form').value
    const phone = document.getElementById('phone_form').value

    if (!username || !email || !full_name || !phone) {
        showToast('Please fill in all the fields', 'warning');
        return;
    }

    const response = await fetch('/edit-profile', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            email,
            full_name,
            phone
        })
    })

    const data = await response.json()

    if (response.status === 200) {
        showToast(data.message, 'success')
        location.reload()
    }
    else {
        showToast(data.message, 'error')
    }
    
})