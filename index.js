const express = require('express')
const sessions = require('express-session')
const filestore = require('session-file-store')(sessions)
const app = express()
const port = 3000
const mysql = require('mysql2')
const multer = require('multer')
require('dotenv').config();
const bodyParser = require('body-parser')
const { Encrypt, Decrypt } = require('./Security.js')
const fs = require('fs')

const oneDay = 86400000

const pool = mysql.createPool({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    multipleStatements: true
})

console.log(Decrypt('209103eaf3bcbd66a22710b25ac2233b'))


const connection = pool.promise()
//Remove cache

app.use((request, response, next) => {
    response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    response.setHeader("Pragma", "no-cache");
    response.setHeader("Expires", "0");
    next()
});


// connection.connect((err) => {
//     if (err) {
//         console.log(err)
//         throw (err)
//     }
//     console.log('connected to database')
// })

app.set('views', 'views')
app.set('view engine', 'hbs')
app.use(express.static('public'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Middlewares


// Middlewares
function isLogged(request, response, next) {
    const { user } = request.session
    if (user) {
        next()
    }
    else {
        response.redirect('/login')
    }
}


function loggedIn(request, response, next) {
    const { user } = request.session
    if (user) {
        next()
        response.redirect('/profile')
    }
    else {
        // response.redirect('/login')
        next()
    }
}


const upload = multer({ dest: '/uploads' })


//session middleware
app.use(sessions({
    name: process.env.Session_name,
    secret: process.env.Session_secret,
    saveUninitialized: false,
    cookie: { maxAge: oneDay, httpOnly: false },
    resave: false,
    store: new filestore({ logFn: function () { } }),
    path: "./sessions/"
}));

// GET METHODS

app.get('/', (request, response) => {
    response.render('home')
})

app.get('/login', loggedIn, (request, response) => {
    response.render('login')
})

app.get('/artists', (request, response) => {
    response.render('artists')
})

app.get('/profile', isLogged, (request, response) => {
    response.render('users/profile', { username: Decrypt(request.session.user.Username) })
})

app.get('/user/:username', (request, response) => {
    response.render('art')
})

app.get('/not-found', (request, response) => {
    response.render('404')
})

// Get user information
app.get('/user-info', async (request, response) => {
    const { user } = request.session
    const username = Decrypt(user.Username)

    const sql = `SELECT Email,Username,Name,Phone FROM users WHERE username = '${user.Username}'`
    pool.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            // throw(err)
            return response.status(500).json({ error: "Error fetching user info", success: false });
        }
        result[0].Username = username
        result[0].Email = Decrypt(result[0].Email)
        // result[0].Name = Decrypt(result[0].Name)
        response.send(result)
    })
})

// Get a user's id photo

//Send an image to user profile photo

app.get('/user-photo', (req, res) => {
    const { Username } = req.session.user

    // console.log("LINE 214")
    console.log('YO')

    const query = 'SELECT Photo FROM users WHERE Username = ?';
    pool.query(query, [Username], (error, results) => {
        if (error) {
            console.error('Error retrieving image:', error);
            res.status(500).send('Error retrieving image');
        } else if (results.length === 0) {

            res.status(404).send('Image not found');
        } else {
            const imageData = results[0].Photo;
            // console.log(results)
            res.setHeader('Content-Type', 'image/jpeg');
            res.send(imageData);
        }
    });
});


// Logout
app.get('/logout', (request, response) => {
    request.session.destroy((err) => {
        if (err) throw err;
        request.session = null;
        response.clearCookie('user')
        response.clearCookie('User_Session')
        response.redirect('/')
    })
})

app.get('*', (request, response) => {
    // response.render('404')
    response.redirect('/not-found')
})


// Handle 404 errors
// app.use((req, res, next) => {
//     res.status(404).render('404'); // or .sendFile() or .send() as per your setup
// });

// POST METHODS



// POST METHODS
app.post('/login', (request, response) => {
    const { email, password } = request.body
    const encryptedEmail = Encrypt(email);
    const encryptedPassword = Encrypt(password);
    const sql = `SELECT * FROM users WHERE email = '${encryptedEmail}' AND password = '${encryptedPassword}'`
    pool.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            // throw(err)
            return response.status(500).json({ error: "Error login you in", success: false });
        }
        else if (result.length > 0) {
            request.session.user = result[0]
            // console.log(result[0].Type)
            response.status(200).json({ userType: result[0].Type, success: true, message: "Logins successful" });
            // response.redirect('/profile')
        } else {
            return response.status(500).json({ error: "Invalid email or password", success: false });
            // response.render('login', { error: 'Invalid email or password', success: false })
        }
    })
})

app.post('/signup', (request, response) => {
    const { name, email, password, type, username } = request.body
    console.log(name, email, password, type, username)
    const encryptedEmail = Encrypt(email);
    const encryptedPassword = Encrypt(password);
    const encryptedUsername = Encrypt(username);
    const sql = `INSERT INTO users (name,email,password,type,username) VALUES ('${name}','${encryptedEmail}','${encryptedPassword}','${type}','${encryptedUsername}')`
    pool.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            if (err.sqlState == 45000) { // username already exists
                return response.status(500).json({ error: 'Username already exists', success: false });
            }
            else if (err.sqlState == 23000) { // email already exists
                return response.status(500).json({ error: 'Email already exists', success: false });
            }
            // throw(err)
            else
                return response.status(500).json({ error: "err", success: false });
        }

        // response.redirect('/login')
        console.log('User added successfully')
        return response.status(200).json({ success: true, message: 'User added successfully' });
    })
})


//Uploading a user's photo
app.post('/upload-photo', upload.single('photo'), (request, response) => {
    console.log(request.file)
    // const { email } = request.session.user
    const { Username } = request.session.user
    // const decryptedUsername = Decrypt(Username)
    const imageFile = request.file.path;
    const imageData = fs.readFileSync(imageFile);
    pool.query(`UPDATE users SET Photo = ? WHERE Username = ?`, [imageData, Username], (err, result) => {
        if (err) {
            console.log(err)
            return response.status(500).json({ message: "Something went wrong" })
        }
        console.log(result)
        response.status(200).json({ message: "Photo uploaded successfully" })
    }
    )
    //Delete the temporary file
    fs.unlink(imageFile, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
        }
    });
})

// PATCH METHOD
app.patch('/change-password', (request, response) => {
    const { newPassword, current_password } = request.body
    const { Username } = request.session.user
    console.log(newPassword, current_password)

    const encryptedCurrentPassword = Encrypt(current_password)
    const encryptedNewPassword = Encrypt(newPassword)

    pool.query(`UPDATE users SET password = ? WHERE Username = ? AND password = ?`, [encryptedNewPassword, Username, encryptedCurrentPassword], (err, result) => {
        if (err) {
            console.log(err)
            return response.status(500).json({ message: "Something went wrong" })
        }
        console.log(result)
        response.status(200).json({ message: "Password changed successfully" })
    })
})


// PUT Methods

app.put('/edit-profile', (request, response) => {
    const { full_name, email, phone, username } = request.body
    const {Username} = request.session.user

    pool.query(`UPDATE users SET Name = ?, email = ?, phone = ?, username = ? WHERE Username = ?`, [full_name, Encrypt(email), phone, Encrypt(username), Username], (err, result) => {
        if (err) {
            console.log(err)
            return response.status(500).json({ message: "Something went wrong" })
        }   
        request.session.user.Name = full_name
        request.session.user.Email = Encrypt(email)
        request.session.user.Phone = phone
        request.session.user.Username = Encrypt(username)
        response.status(200).json({ message: "Profile updated successfully" })
    })
})


app.listen(port, () => { console.log(`Listening on port ${port}`) })