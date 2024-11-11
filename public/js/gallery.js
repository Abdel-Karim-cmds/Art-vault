async function getAllArts(){
    const response = await fetch('/get-all-arts')
    const data = await response.json()
    console.log(data)
    populateArts(data)
}

getAllArts();

function populateArts(data) {
    const artContainer = document.getElementById('artContainer')
    artContainer.innerHTML = ''
    data.forEach(art => {
        const rowFeaturette = document.createElement('div')

        rowFeaturette.classList.add('row', 'featurette')

        const descCol = document.createElement('div')
        descCol.classList.add('col-md-7')

        const h2 = document.createElement('h2')
        h2.classList.add('featurette-heading')
        h2.innerHTML =`${art.Title}  by ${art.Name}<br><span class="text-muted">${art.Dimensions}</span>`

        const description = document.createElement('p')
        description.classList.add('lead')
        description.innerText = art.Description

        const price = document.createElement('p')
        price.classList.add('lead')
        price.innerText = `${art.Price} KSH`

        const pMail = document.createElement('p')
        pMail.classList.add('lead')
        
        const aMail = document.createElement('a')
        aMail.href = `mailto:${art.Email}?subject=Inquiry about ${art.Title} &body=I want to buy this peacock priced at ${art.Price} KSH`
        aMail.classList.add('btn', 'btn-outline-dark', 'ms-2')
        aMail.innerHTML = '<i class="fa fa-envelope" aria-hidden="true"></i> Send an Email'
        pMail.appendChild(aMail)

        const pCall = document.createElement('p')
        pCall.classList.add('lead')

        const aCall = document.createElement('a')
        aCall.href = `tel:${art.Phone}`
        aCall.classList.add('btn', 'btn-outline-dark', 'ms-2')
        aCall.innerHTML = '<i class="fa fa-phone" aria-hidden="true"></i> Call'
        pCall.appendChild(aCall)

        const pTag = document.createElement('p')
        pTag.classList.add('lead')

        const aTag = document.createElement('a')
        aTag.href = `/gallery/${art.Type}`
        aTag.classList.add('btn', 'btn-outline-dark', 'ms-2')
        aTag.innerHTML = `<i class="fa fa-tags" aria-hidden="true"></i> ${art.Type}`
        pTag.appendChild(aTag)

        descCol.appendChild(h2)
        descCol.appendChild(description)
        descCol.appendChild(price)
        descCol.appendChild(pMail)
        descCol.appendChild(pCall)
        descCol.appendChild(pTag)
        // descCol.appendChild(pButton)

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
