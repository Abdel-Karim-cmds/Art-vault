var loadFile = function (event) {
    var output = document.getElementById('output');
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function () {
        URL.revokeObjectURL(output.src) // free memory
    }
    output.style.display = 'block';
};
async function getArts() {
    const response = await fetch('/get-arts', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();

    console.log(data);

    populateArt(data);
}

getArts();

document.getElementById('artUploadForm').addEventListener('submit', async e => {
    e.preventDefault();
    const title = document.getElementById('title').value
    const description = document.getElementById('description').value
    const price = document.getElementById('price').value
    const dimensions = document.getElementById('dimensions').value
    const type = document.getElementById('art-type').value
    const photo = document.getElementById('artPhoto').files[0]
    console.log(title)
    console.log(description)

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('dimensions', dimensions);
    formData.append('type', type);
    formData.append('photo', photo);
    console.log(formData)

    const response = await fetch('/upload-art', {
        method: 'POST',
        body: formData
    });

    const data = await response.json();

    if (response.status === 200) {
        showToast(data.message, 'success')
        getArts()
    } else {
        showToast(data.message, 'error')
    }
})


function populateArt(data) {
    const artContainer = document.getElementById('artContainer')
    artContainer.innerHTML = ''
    data.forEach(art => {
        const rowFeaturette = document.createElement('div')

        rowFeaturette.classList.add('row', 'featurette')

        const descCol = document.createElement('div')
        descCol.classList.add('col-md-7')

        const h2 = document.createElement('h2')
        h2.classList.add('featurette-heading')
        h2.innerHTML =`${art.Title}<br><span class="text-muted" id="dimensionsArt">${art.Dimensions}</span>`

        const description = document.createElement('p')
        description.classList.add('lead')
        description.innerText = art.Description

        const price = document.createElement('p')
        price.classList.add('lead')
        price.innerText = `${art.Price} KSH`

        const pButton = document.createElement('p')
        pButton.classList.add('lead')
        const deleteButton = document.createElement('button')
        deleteButton.classList.add('btn', 'btn-outline-dark', 'ms-2')
        deleteButton.innerHTML = 'Delete art'
        deleteButton.onclick = () => {
            deleteArt(art.ID,art.Title)
        }
        pButton.appendChild(deleteButton)

        descCol.appendChild(h2)
        descCol.appendChild(description)
        descCol.appendChild(price)
        descCol.appendChild(pButton)

        const artCol = document.createElement('div')
        artCol.classList.add('col-md-5')
        const img = document.createElement('img')
        img.src = `/art-photo/${art.ID}`
        img.classList.add('bd-placeholder-img', 'bd-placeholder-img-lg', 'featurette-image', 'img-fluid', 'mx-auto')
        artCol.appendChild(img)

        rowFeaturette.appendChild(descCol)
        rowFeaturette.appendChild(artCol)

        artContainer.appendChild(rowFeaturette)
        const featuretteDivider = document.createElement('hr')
        featuretteDivider.classList.add('featurette-divider')
        artContainer.appendChild(featuretteDivider)
    });
}

async function deleteArt(ID,name) {
    // const confirmation = confirm('Are you sure you want to delete this art?')
    const confirmation = confirm(`Are you sure you want to delete ${name}?`)
    if (confirmation) {
        const response = await fetch(`/delete-art/${ID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (response.status === 200) {
            showToast(data.message, 'success')
            getArts()
        } else {
            showToast(data.message, 'error')
        }
    }
    else{
        return;
    }
    
}