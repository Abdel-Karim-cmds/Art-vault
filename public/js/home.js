let nextBtn = document.querySelector('.next')
let prevBtn = document.querySelector('.prev')

let prevPort = document.getElementById('prevPort')
let nextPort = document.getElementById('nextPort')

let slider = document.querySelector('.slider')
let sliderList = slider.querySelector('.slider .list')
let thumbnail = document.querySelector('.slider .thumbnail')
let thumbnailItems = thumbnail.querySelectorAll('.item')

thumbnail.appendChild(thumbnailItems[0])


console.log(thumbnail)


// Function for next button 
nextBtn.onclick = function () {
    moveSlider('next')
}


// Function for prev button 
prevBtn.onclick = function () {
    moveSlider('prev')
}




function moveSlider(direction) {
    let sliderItems = sliderList.querySelectorAll('.item')
    let thumbnailItems = document.querySelectorAll('.thumbnail .item')

    if (direction === 'next') {
        sliderList.appendChild(sliderItems[0])
        thumbnail.appendChild(thumbnailItems[0])
        slider.classList.add('next')
    } else {
        sliderList.prepend(sliderItems[sliderItems.length - 1])
        thumbnail.prepend(thumbnailItems[thumbnailItems.length - 1])
        slider.classList.add('prev')
    }

    slider.addEventListener('animationend', function () {
        if (direction === 'next') {
            slider.classList.remove('next')
        } else {
            slider.classList.remove('prev')
        }
    }, { once: true }) // Remove the event listener after it's triggered once
}


// // Check if the device is in portrait mode
// let isPortrait = window.matchMedia("(orientation: portrait)").matches;

// // Landscapes pictures
// const land5 = document.getElementById('land-img5')
// const thumbnail5 = document.getElementById('thumb-img5')
// const land6 = document.getElementById('land-img6')
// const thumbnail6 = document.getElementById('thumb-img6')
// const land7 = document.getElementById('land-img7')
// const thumbnail7 = document.getElementById('thumb-img7')
// const land8 = document.getElementById('land-img8')
// const thumbnail8 = document.getElementById('thumb-img8')
// const land9 = document.getElementById('land-img9')
// const thumbnail9 = document.getElementById('thumb-img9')

// // Portrait pictures
// const land10 = document.getElementById('land-img10')
// const thumbnail10 = document.getElementById('thumb-img10')
// const land11 = document.getElementById('land-img11')
// const thumbnail11 = document.getElementById('thumb-img11')
// const land12 = document.getElementById('land-img12')
// const thumbnail12 = document.getElementById('thumb-img12')


// if (!isPortrait) {
//     console.log("The device is in portrait mode.");

//     // Landscapes
//     land5.style.display = 'none'
//     thumbnail5.style.display = 'none'

//     land6.style.display = 'none'
//     thumbnail6.style.display = 'none'

//     land7.style.display = 'none'
//     thumbnail7.style.display = 'none'

//     land8.style.display = 'none'
//     thumbnail8.style.display = 'none'

//     land9.style.display = 'none'
//     thumbnail9.style.display = 'none'

// } else {
//     console.log("The device is in landscape mode.");

//     // Portrait
//     land10.style.display = 'none'
//     thumbnail10.style.display = 'none'

//     land11.style.display = 'none'
//     thumbnail11.style.display = 'none'

//     land12.style.display = 'none'
//     thumbnail12.style.display = 'none'

// }

// // Listen for orientation changes
// window.matchMedia("(orientation: portrait)").addEventListener("change", function (e) {
//     if (e.matches) {
//         console.log("The device switched to portrait mode.");


//         // Landscapes
//         land5.style.display = 'block'
//         thumbnail5.style.display = 'block'

//         land6.style.display = 'block'
//         thumbnail6.style.display = 'block'

//         land7.style.display = 'block'
//         thumbnail7.style.display = 'block'

//         land8.style.display = 'block'
//         thumbnail8.style.display = 'block'

//         land9.style.display = 'block'
//         thumbnail9.style.display = 'block'


//         // Portrait
//         land10.style.display = 'none'
//         thumbnail10.style.display = 'none'

//         land11.style.display = 'none'
//         thumbnail11.style.display = 'none'

//         land12.style.display = 'none'
//         thumbnail12.style.display = 'none'


//     } else {
//         console.log("The device switched to landscape mode.");


//         // Landscapes
//         land5.style.display = 'none'
//         thumbnail5.style.display = 'none'

//         land6.style.display = 'none'
//         thumbnail6.style.display = 'none'

//         land7.style.display = 'none'
//         thumbnail7.style.display = 'none'

//         land8.style.display = 'none'
//         thumbnail8.style.display = 'none'

//         land9.style.display = 'none'
//         thumbnail9.style.display = 'none'


//         // Portrait
//         land10.style.display = 'block'
//         thumbnail10.style.display = 'block'

//         land11.style.display = 'block'
//         thumbnail11.style.display = 'block'

//         land12.style.display = 'block'
//         thumbnail12.style.display = 'block'

//     }
// });
