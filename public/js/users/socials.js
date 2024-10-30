console.log('YOLO')

async function getSocials() {
    const response = await fetch('/get-socials')
    const data = await response.json()
    console.log(data)
    populateSocials(data)
}

getSocials()

function populateSocials(socials) {
    document.getElementById('instagram').value = socials.Instagram
    document.getElementById('youtube').value = socials.Youtube
    document.getElementById('x').value = socials.Twitter
    document.getElementById('tiktok').value = socials.Tiktok
}

document.getElementById('socialsForm').addEventListener('submit', async e =>{
    e.preventDefault()
    const instagram = document.getElementById('instagram').value
    const youtube = document.getElementById('youtube').value
    const twitter = document.getElementById('x').value
    const tiktok = document.getElementById('tiktok').value
    const response = await fetch('/edit-socials', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            instagram,
            youtube,
            twitter,
            tiktok
        })
    })
    const data = await response.json()
    if (response.status === 200) {
        showToast(data.message, 'success')
        getSocials()
    } else {
        showToast(data.message, 'error')
    }
})