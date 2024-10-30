async function getArtists() {
    const response = await fetch('/get-all-artists')
    const data = await response.json();
    console.log(data)
    populateArtists(data)

}

getArtists();

function populateArtists(artists) {
    const container = document.getElementById('artist-container')
    console.log(artists)
    artistsNumber = artists.length;
    noOfRows = Math.ceil(artistsNumber / 3);
    console.log(noOfRows)
    console.log(artistsNumber)
    for (let i = 0; i < noOfRows; i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        for (let j = 0; j < 3; j++) {
            const currentArtist = artists[i * 3 + j];
            if (currentArtist) {
                console.log(currentArtist)
                console.log(i, j)
                const col = document.createElement('div');
                col.classList.add('col');

                const card = document.createElement('div');
                card.classList.add('card');
                card.classList.add('card-photo')

                card.style.backgroundImage =`url("/profile-pic/${currentArtist.Username}")`;
                card.onmouseover = () =>{
                    card.style.backgroundImage =`url("/profile-pic/${currentArtist.Username}")`;
                }

                card.onclick = () => {
                    window.location.href = `/artist/${currentArtist.Username}`;
                }

                const border = document.createElement('div');
                border.classList.add('border');

                const h2 = document.createElement('h2');
                h2.innerHTML = currentArtist.Name;

                const icons = document.createElement('div');
                icons.classList.add('icons');

                if (currentArtist.Instagram) {
                    icons.innerHTML = `<a href="${currentArtist.Instagram}" target="_blank"><i class="fa-brands fa-instagram"></i></a>`
                }
                if (currentArtist.Twitter) {
                    icons.innerHTML += `<a href="${currentArtist.Twitter}" target="_blank"><i class="fa-brands fa-x-twitter"></i></a>`
                }
                if (currentArtist.Youtube) {
                    icons.innerHTML += `<a href="${currentArtist.Youtube}" target="_blank"><i class="fa-brands fa-youtube"></i></a>`
                }
                if(currentArtist.Tiktok){
                    icons.innerHTML += `<a href="${currentArtist.Tiktok}" target="_blank"><i class="fa-brands fa-tiktok"></i></a>`
                }

                border.appendChild(h2);
                border.appendChild(icons);
                card.appendChild(border);
                col.appendChild(card);
                row.appendChild(col);
            }
            container.appendChild(row);

        }
    }
}



// populateArtists(artistlist)