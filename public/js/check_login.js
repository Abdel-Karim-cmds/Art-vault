
const getCookie = (cookie_name) => {
    // Construct a RegExp object as to include the variable name
    const re = new RegExp(`(?<=${cookie_name}=)[^;]*`);
    try {
        if (document.cookie.match(re)[0])
            return true // Will raise TypeError if cookie is not found
    } catch {
        return false
    }
}

(
    function islogged() {
        // console.log(getCookie('User_Session'))
        if (getCookie('User_Session')) {
            document.getElementById('login').style.display = 'none'
        } else {
            document.getElementById('logout').style.display = 'none'
            // document.getElementById('profile').style.display = 'none'
        }

    }
)();

(function isBuyer(){
    const cookie = getCookieValue('user')
    console.log(cookie)
    if(cookie === 'Buyer'){
        // alert('Buyer')
        document.getElementById('buyer-profile').style.display = 'block'
        document.getElementById('profile').style.display = 'none'
    }
    else if(cookie === 'Artist'){
        // alert('Artist')
        document.getElementById('buyer-profile').style.display = 'none'
        document.getElementById('profile').style.display = 'block'
    }
    else{
        // alert('Not logged in')
        document.getElementById('buyer-profile').style.display = 'none'
        document.getElementById('profile').style.display = 'none'
    }
})()

function getCookieValue(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
