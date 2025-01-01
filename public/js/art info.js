const path = window.location.pathname
const artId = path.split('/')[2]

let ratingCheck = document.getElementById('agreeRating')

ratingCheck.onchange = () => {
    if (ratingCheck.checked) {
        // document.getElementById('submitRating').setAttribute('disabled','false')
        document.getElementById('submitRating').removeAttribute('disabled')
    }
    else {
        document.getElementById('submitRating').setAttribute('disabled', 'true')
    }
}

async function getArtInfo() {
    const response = await fetch('/get-art-info/' + artId)
    const data = await response.json()
    console.log(data)
    populateArt(data)
}

getArtInfo();


async function getArtComments() {
    const response = await fetch('/get-art-comments/' + artId)
    const data = await response.json()
    console.log(data)
    populateComments(data)
}

getArtComments();


function populateComments(comments) {
    const reviews = document.getElementById('reviews')
    comments.forEach(comment => {
        // let avgRating = 0
        const card = document.createElement('div')
        card.className = 'card review-card'

        const h2 = document.createElement('h2')
        h2.innerText = comment.Name

        const { Rating } = comment;
        const ratingDiv = document.createElement('div')
        ratingDiv.className = 'ratings'

        if(Rating == 1){
            ratingDiv.innerHTML = `
            <i class="bx bxs-star"></i>
            <i class="bx bx-star"></i>
            <i class="bx bx-star"></i>
            <i class="bx bx-star"></i>
            <i class="bx bx-star"></i>
            `
        }
        else if(Rating == 2){
            ratingDiv.innerHTML = `
            <i class="bx bxs-star"></i>
            <i class="bx bxs-star"></i>
            <i class="bx bx-star"></i>
            <i class="bx bx-star"></i>
            <i class="bx bx-star"></i>
            `
        }
        else if(Rating == 3){
            ratingDiv.innerHTML = `
            <i class="bx bxs-star"></i>
            <i class="bx bxs-star"></i>
            <i class="bx bxs-star"></i>
            <i class="bx bx-star"></i>
            <i class="bx bx-star"></i>
            `
        }
        else if(Rating == 4){
            ratingDiv.innerHTML = `
            <i class="bx bxs-star"></i>
            <i class="bx bxs-star"></i>
            <i class="bx bxs-star"></i>
            <i class="bx bxs-star"></i>
            <i class="bx bx-star"></i>
            `
        }
        else if(Rating == 5){
            ratingDiv.innerHTML = `
            <i class="bx bxs-star"></i>
            <i class="bx bxs-star"></i>
            <i class="bx bxs-star"></i>
            <i class="bx bxs-star"></i>
            <i class="bx bxs-star"></i>
            `
        }

        const p = document.createElement('p')
        p.innerText = comment.Comment

        card.appendChild(h2)
        card.appendChild(ratingDiv)
        card.appendChild(p)
        reviews.appendChild(card)

    });
}
// showToast('Jama','success')

function verifyLogin() {

    if (!getCookie('User_Session')) {
        window.location.href = '/login'
    }
    else{
        return;
    }
}


document.getElementById('submitComment').addEventListener('submit', async e =>{
    e.preventDefault()
    const radios = document.querySelectorAll('input[name="rate"]')
    const comment = document.getElementById('reviewbox').value;
    let selected;
    for(const radio of radios){
        if(radio.checked){
            selected =  radio.value;
            break;
        }
    }
    console.error(selected)

    if(!selected){
        return alert("Please select a star")
    }
    const response = await fetch('/add-comment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            comment,
            artId,
            rating: selected
        })
    })
    const data = await response.json()
    if (response.status === 200) {
        showToast(data.message, 'success')
        getArtComments()
    } else {
        showToast(data.message, 'error')
    }
})


let star1 = document.getElementById('rate-1')
let star2 = document.getElementById('rate-2')
let star3 = document.getElementById('rate-3')
let star4 = document.getElementById('rate-4')
let star5 = document.getElementById('rate-5')

let feeling = document.getElementById('feeling')

star1.onclick = () =>{
    feeling.innerText = 'I did not like it'
}

star2.onclick = () =>{
    feeling.innerText = 'I have seen better'
}

star3.onclick = () =>{
    feeling.innerText = 'It was not that bad'
}

star4.onclick = () =>{
    feeling.innerText = 'Just one thing was lacking'
}

star5.onclick = () =>{
    feeling.innerText = 'It was amazing'
}


function populateArt(artInfo){
    document.getElementById('title').innerText = artInfo.Title
    document.getElementById('description').innerText = artInfo.Description
    document.getElementById('price').innerText = `${artInfo.Price} KSH`
    document.getElementById('dimensions').innerText = artInfo.Dimensions
    // document.getElementById('tag').innerText = artInfo.Type
    document.getElementById('artist').innerText = artInfo.Name;
    document.getElementById('image').src = `/art-photo/${artInfo.ID}`
    document.getElementById('email').href = `mailto:bdak@gmail.com?subject=Inquiry about ${artInfo.Title} &amp;body=I want to buy this ${artInfo.Title} priced at ${artInfo.Price} KSH`
    document.getElementById('phone').href = `tel:${artInfo.Phone}`
    document.getElementById('tag').href = `/gallery/${artInfo.Type}`
    document.getElementById('tagName').innerText = `${artInfo.Type}`
}
