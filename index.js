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
const uuid4 = require('uuid4')

const oneDay = 86400000

const pool = mysql.createPool({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    multipleStatements: true
})

// const connection = pool.promise()
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
const arts = multer({ dest: '/arts' })


//session middleware
app.use(sessions({
    name: process.env.Session_name,
    secret: process.env.Session_secret,
    saveUninitialized: false,
    cookie: { maxAge: oneDay, httpOnly: false },
    resave: false,
    store: new filestore({ logFn: function () { } }),
    path: "./sessions/",
    ttl: oneDay
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

app.get('/socials', isLogged, (request, response) => {
    response.render('users/User Social', { username: Decrypt(request.session.user.Username) })
})

app.get('/my-arts', isLogged, (request, response) => {
    response.render('users/User Arts', { username: Decrypt(request.session.user.Username) })
})

app.get('/artists/:username', (request, response) => {
    response.render('Artist profile',{username:request.params.username})
})

app.get('/gallery',(request,response)=>{
    response.render('Gallery')
})

app.get('/gallery/:tag',(request,response)=>{
    const {tag} = request.params
    console.log(tag)
    response.render('Gallery Tag',{tag:tag})
})

app.get('/art/:id',(request,response)=>{
    response.render('Art Info')
})

app.get('/buyer-profile',(request,response)=>{
    response.render('buyers/profile',{username:request.session.user.Name})
})

app.get('/not-found', (request, response) => {
    response.render('404')
})

// Get user information
app.get('/user-info', async (request, response) => {
    const { user } = request.session
    const username = Decrypt(user.Username)

    const sql = `SELECT Email,Username,Name,Phone, Bio FROM users WHERE username = '${user.Username}'`
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
    // console.log('YO')

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

app.get('/profile-pic/:username', (request, response) => {
    const username = request.params.username
    const encryptedUsername = Encrypt(username)
    console.log(encryptedUsername)
    const query = 'SELECT Photo FROM users WHERE Username = ?';
    pool.query(query, [encryptedUsername], (error, results) => {
        if (error) {
            console.error('Error retrieving image:', error);
            response.status(500).send('Error retrieving image');
        } else if (results.length === 0) {
            response.status(404).send('Image not found');
        } else {
            const imageData = results[0].Photo;
            response.setHeader('Content-Type', 'image/jpeg');
            response.send(imageData);
        }
    });
})

// Get all the artists

app.get('/get-all-artists', (request, response) => {
    const query = 'SELECT Name, Username, Instagram, Twitter, Youtube,Tiktok FROM users WHERE TYPE = "ARTIST"'
    pool.query(query, (err, results) => {
        if (err) {
            return response.status(500).json({ success: false, message: "Error fetching artists" })
        }
        console.log(results)
        const artists = results.map(artist => {
            return {
                Name: artist.Name,
                Username: Decrypt(artist.Username),
                Instagram: artist.Instagram,
                Twitter: artist.Twitter,
                Youtube: artist.Youtube,
                Tiktok: artist.Tiktok
            }
        })
        return response.status(200).send(artists)
    })
})

app.get('/get-socials', (request, response) => {
    const { Username } = request.session.user
    const query = 'SELECT Instagram, Twitter, Youtube, Tiktok FROM users WHERE Username = ?'
    pool.query(query, [Username], (err, results) => {
        if (err) {
            console.error('Error retrieving socials:', err);
            response.status(500).send('Error retrieving socials');
        } else if (results.length === 0) {
            response.status(404).send('Socials not found');
        } else {
            const socials = results[0];
            response.send(socials);
        }
    })
})

app.get('/get-arts', (request, response) => {
    const { Username } = request.session.user
    const query = 'SELECT * FROM arts WHERE Username = ?'
    pool.query(query, [Username], (err, results) => {
        if (err) {
            console.error('Error retrieving arts:', err);
            response.status(500).send('Error retrieving arts');
        } else if (results.length === 0) {
            response.status(404).send('Arts not found');
        } else {
            response.send(results);

        }
    })
})

app.get('/art-photo/:id',(request,response)=>{
    const {id} = request.params
    const query = 'SELECT Photo FROM arts WHERE ID = ?';
    pool.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error retrieving image:', error);
            response.status(500).send('Error retrieving image');
        } else if (results.length === 0) {
            response.status(404).send('Image not found');
        } else {
            const imageData = results[0].Photo;
            response.setHeader('Content-Type', 'image/jpeg');
            response.send(imageData);
        }
    });
})

app.get('/get-artist/:username', (request, response) => {
    console.log('HERE')
    const query = 'SELECT Name, Instagram, Twitter, Youtube, Tiktok FROM users WHERE Username = ?';
    const {username} = request.params
    console.log(username)
    const encryptedUsername = Encrypt(username)

    pool.query(query, [encryptedUsername], (error, results) => {
        if (error) {
            console.error('Error retrieving artist:', error);
            response.status(500).send('Error retrieving artist');
        } else if (results.length === 0) {
            response.status(404).send('Artist not found');
        } else {
            const artist = results[0];
            response.send(artist);
        }
    });
})

app.get('/get-art/:username',(request,response)=>{
    const {username} = request.params;
    const encryptedUsername = Encrypt(username)
    let arts = [];
    // const query = `SELECT ID, Title, Description, Dimensions, Price  FROM arts WHERE Username = ?`;
    const query = `
    SELECT a.ID, a.Title, a.Description, a.Dimensions, a.Price, a.Type, u.Name, u.Email, u.Phone
    FROM arts a
    JOIN users u ON a.Username = u.Username
    WHERE a.Username = ?
    `
    pool.query(query,[encryptedUsername],(error,results) =>{
        if(error){
            console.error('Error retrieving artist:', error);
            response.status(500).send('Error retrieving arts');
        }
        else{
            results.forEach(art => {
                arts.push({
                    ID: art.ID,
                    Title: art.Title,
                    Description: art.Description,
                    Dimensions: art.Dimensions,
                    Price: art.Price,
                    Type: art.Type,
                    Name: art.Name,
                    Email: Decrypt(art.Email),
                    Phone: art.Phone
                })
            })
            response.send(arts)
        }
    })

})

app.get('/get-all-arts',(request,response)=>{
    let arts = [];
    // const query = `SELECT ID, Title, Description, Dimensions, Price  FROM arts WHERE Username = ?`;
    const query = `
    SELECT a.ID, a.Title, a.Description, a.Dimensions, a.Price, a.Type, u.Name, u.Email, u.Phone
    FROM arts a
    JOIN users u ON a.Username = u.Username
    `
    pool.query(query,(error,results) =>{
        if(error){
            console.error('Error retrieving artist:', error);
            response.status(500).send('Error retrieving arts');
        }
        else{
            results.forEach(art => {
                arts.push({
                    ID: art.ID,
                    Title: art.Title,
                    Description: art.Description,
                    Dimensions: art.Dimensions,
                    Price: art.Price,
                    Type: art.Type,
                    Name: art.Name,
                    Email: Decrypt(art.Email),
                    Phone: art.Phone
                })
            })
            response.send(arts)
        }
    })
})



app.get('/get-all-arts/:tag',(request,response)=>{
    let arts = [];
    const {tag} = request.params
    // const query = `SELECT ID, Title, Description, Dimensions, Price  FROM arts WHERE Username = ?`;
    const query = `
    SELECT a.ID, a.Title, a.Description, a.Dimensions, a.Price, a.Type, u.Name, u.Email, u.Phone
    FROM arts a
    JOIN users u ON a.Username = u.Username
    WHERE a.Type = ?
    `
    pool.query(query,[tag],(error,results) =>{
        if(error){
            console.error('Error retrieving artist:', error);
            response.status(500).send('Error retrieving arts');
        }
        else{
            results.forEach(art => {
                arts.push({
                    ID: art.ID,
                    Title: art.Title,
                    Description: art.Description,
                    Dimensions: art.Dimensions,
                    Price: art.Price,
                    Type: art.Type,
                    Name: art.Name,
                    Email: Decrypt(art.Email),
                    Phone: art.Phone
                })
            })
            response.send(arts)
        }
    })
})

app.get('/get-art-info/:id',(request,response)=>{
    const {id} = request.params
    const query = `
    SELECT a.ID,a.Description,a.Dimensions,a.Price,a.Title,a.Type,u.Name,u.Email,u.Phone
    FROM arts a
    JOIN users u ON a.Username = u.Username
    WHERE a.ID = ?
     `;
    pool.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error retrieving art:', error);
            response.status(500).send('Error retrieving art');
        } else if (results.length === 0) {
            response.status(404).send('Art not found');
        } else {
            results[0].Email = Decrypt(results[0].Email)
            response.send(results[0]);
        }      
    })
})

app.get('/get-art-comments/:id',(request,response)=>{
    const {id} = request.params
    const query = `
    SELECT c.Comment, c.Rating, u.Name
    FROM comments c
    JOIN users u ON c.Username = u.Username
    WHERE c.Art = ?`
    pool.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error retrieving comments:', error);
            response.status(500).send('Error retrieving comments');
        } else {
            response.send(results);
        }
    })
})

app.post('/add-comment',(request,response)=>{
    console.log(request.body)
    const {Username} = request.session.user
    const {artId,comment,rating} = request.body

    const query = 'INSERT INTO comments (ID,Comment, Rating, Username, Art) VALUES (?, ?, ?, ?, ?)';
    const id = uuid4();
    pool.query(query, [id,comment,rating,Username,artId], (error, results) => {
        if (error) {
            console.error('Error adding comment:', error);
            return response.status(500).json({message:'Error adding comment',success:false});
        } else {
            response.status(200).json({message:'Comment added successfully',success:true});
        }
    })
})

// Logout
app.get('/logout', (request, response) => {
    console.log("Yo")
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
            delete result[0].Photo
            request.session.user = result[0]
            response.cookie('user', result[0].Type)
            response.status(200).json({ userType: result[0].Type, success: true, message: "Logins successful" });
        } else {
            return response.status(500).json({ error: "Invalid email or password", success: false });
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

app.post('/upload-art', arts.single('photo'), (request, response) => {
    console.log(request.file)
    console.log(request.body)
    const imageFile = request.file.path;
    const imageData = fs.readFileSync(imageFile);

    console.log(request.session.user)
    const { Username } = request.session.user;

    const { title, description, price, dimensions, type } = request.body;
    // console.log(request.body)
    const id = uuid4();
    console.log(id, Username)
    console.log(title, description, price, dimensions, type)
    const query = 'INSERT INTO arts (ID, Username, Title, Description, Price, Dimensions, Type, Photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    pool.query(query, [id, Username, title, description, price, dimensions, type, imageData], (err, result) => {
        if (err) {
            console.log(err)
            if (err.sqlState === '08S01') {
                return response.status(500).json({ message: "File too big" })
            }
            return response.status(500).json({ message: "Something went wrong here" })
        }
        console.log(result)
        return response.status(200).json({ message: "Art uploaded successfully" })
    })
    fs.unlink(imageFile, (err) => {
        if (err) {
            console.error('Error deleting file:', err);  
        }
    })
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
    const { full_name, email, phone, username,bio } = request.body
    const { Username } = request.session.user

    pool.query(`UPDATE users SET Name = ?, email = ?, phone = ?, username = ?, Bio = ? WHERE Username = ?`, [full_name, Encrypt(email), phone, Encrypt(username), bio, Username], (err, result) => {
        if (err) {
            console.log(err)
            return response.status(500).json({ message: "Something went wrong" })
        }
        request.session.user.Name = full_name
        request.session.user.Email = Encrypt(email)
        request.session.user.Phone = phone
        request.session.user.Username = Encrypt(username)
        request.session.user.Bio = bio
        response.status(200).json({ message: "Profile updated successfully" })
    })
})

app.put('/edit-socials', (request, response) => {
    const { instagram, twitter, youtube, tiktok } = request.body
    const { Username } = request.session.user

    pool.query(`UPDATE users SET Instagram = ?, Twitter = ?, Youtube = ?, Tiktok = ? WHERE Username = ?`, [instagram, twitter, youtube, tiktok, Username], (err, result) => {
        if (err) {
            console.log(err)
            return response.status(500).json({ message: "Something went wrong" })
        }
        response.status(200).json({ message: "Socials updated successfully" })
    })
})


// DELETE Methods

// Deleting an art piece
app.delete('/delete-art/:id', (request, response) => {
    const { id } = request.params
    const { Username } = request.session.user
    const query = 'DELETE FROM arts WHERE ID = ? AND Username = ?';
    pool.query(query, [id, Username], (err, results) => {
        if (err) {
            console.error('Error deleting art:', err);
            return response.status(500).json({message:'Error deleting art', success:false});
        } else if (results.affectedRows === 0) {
            return response.status(404).json({message:'Art not found', success:false});
        } else {
            return response.status(200).json({message:'Art deleted successfully', success:true});
        }
    })
})


app.listen(port, () => { console.log(`Listening on port ${port}`) })