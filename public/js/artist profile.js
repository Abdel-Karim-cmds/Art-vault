const url = window.location.href;
const artistId = url.split("/").pop();
document.getElementById('user-pic').src = `/profile-pic/${artistId}`;


async function getArtistData() {
    const response = await fetch(`/get-artist/${artistId}`);
    const data = await response.json();
    console.log(data);
    populateArtist(data);
}

getArtistData()

function populateArtist(data){
    const artistName = document.getElementById('artistName');
    artistName.innerText = data.Name;
    const navList = document.getElementById('navList');
    if(data.Instagram){
        const li = document.createElement('li');
        li.className = 'nav-item';
        const a = document.createElement('a');
        a.className = 'instagram';
        a.href = data.Instagram;
        a.target = '_blank';
        const span = document.createElement('span');
        span.className = 'nav-text';
        span.innerText = 'Instagram';
        const i = document.createElement('i');
        i.className = 'fa-brands fa-instagram';
        a.appendChild(span);
        a.appendChild(i);
        li.appendChild(a);
        navList.appendChild(li);
    }
    
    if(data.Youtube){
        const li = document.createElement('li');
        li.className = 'nav-item';
        const a = document.createElement('a');
        a.className = 'youtube';
        a.href = data.Instagram;
        a.target = '_blank';
        const span = document.createElement('span');
        span.className = 'nav-text';
        span.innerText = 'Youtube';
        const i = document.createElement('i');
        i.className = 'fa-brands fa-youtube';
        a.appendChild(span);
        a.appendChild(i);
        li.appendChild(a);
        navList.appendChild(li);
    }
    
    if(data.Twitter){
        const li = document.createElement('li');
        li.className = 'nav-item';
        const a = document.createElement('a');
        a.className = 'black';
        a.href = data.Instagram;
        a.target = '_blank';
        const span = document.createElement('span');
        span.className = 'nav-text';
        span.innerText = 'X (Twitter)';
        const i = document.createElement('i');
        i.className = 'fa-brands fa-x-twitter';
        a.appendChild(span);
        a.appendChild(i);
        li.appendChild(a);
        navList.appendChild(li);
    }
    
    if(data.Tiktok){
        const li = document.createElement('li');
        li.className = 'nav-item';
        const a = document.createElement('a');
        a.className = 'black';
        a.href = data.Instagram;
        a.target = '_blank';
        const span = document.createElement('span');
        span.className = 'nav-text';
        span.innerText = 'TikTok';
        const i = document.createElement('i');
        i.className = 'fa-brands fa-tiktok';
        a.appendChild(span);
        a.appendChild(i);
        li.appendChild(a);
        navList.appendChild(li);
    }
}

async function getArts(){
    const response = await fetch(`/get-art/${artistId}`);
    const data = await response.json();
    console.log(data);
    populateArt(data)
}
getArts();

// function populateArt(data){

// }

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
        
        const pMore = document.createElement('p')
        pMore.classList.add('lead')

        const aMore = document.createElement('a')
        aMore.href = `/art/${art.ID}`
        aMore.classList.add('btn', 'btn-outline-dark', 'ms-2')
        aMore.innerHTML = '<i class="fa fa-info-circle" aria-hidden="true"></i> More Info'
        pMore.appendChild(aMore)

        descCol.appendChild(h2)
        descCol.appendChild(description)
        descCol.appendChild(price)
        descCol.appendChild(pMail)
        descCol.appendChild(pCall)
        descCol.appendChild(pTag)
        descCol.appendChild(pMore)

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
