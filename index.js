const express = require('express')
const sessions = require('express-session')
const filestore = require('session-file-store')(sessions)
const app = express()
const port = 3000
const mysql = require('mysql2')
const {} = require('./Security.js')
require('dotenv').config();
const bodyParser = require('body-parser')
const {Encrypt,Decrypt} = require('./Security.js')

const oneDay = 86400000

const connection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    multipleStatements: true
})

//Remove cache

app.use((request, response, next) => {
    response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    response.setHeader("Pragma", "no-cache");
    response.setHeader("Expires", "0");
    next()
});


connection.connect((err)=>{
    if(err){
        console.log(err)
        throw(err)
    }
    console.log('connected to database')
})

app.set('views','views')
app.set('view engine','hbs')
app.use(express.static('public'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


// app.use('/auth',auth)

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

app.get('/',(request,response)=>{
    response.render('home')
})

app.get('/login',(request,response)=>{
    response.render('login')
})

app.get('/artists',(request,response)=>{
    response.render('artists')
})

app.get('/profile',(request,response)=>{
    response.render('users/profile')
})

app.get('*',(request,response)=>{
    response.render('404')
})

// POST METHODS



// POST METHODS
app.post('/login',(request,response)=>{
    const {email,password} = request.body
    const sql = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`
    connection.query(sql,(err,result)=>{
        if(err){
            console.log(err)
            throw(err)
        }
        if(result.length>0){
            request.session.user = result[0]
            response.redirect('/profile')
        }else{
            response.render('login',{error:'Invalid email or password'})
        }
    })
})

app.post('/signup',(request,response)=>{
    const {name,email,password,type,username} = request.body
    console.log(name,email,password,type,username)
    const encryptedEmail = Encrypt(email);
    const encryptedPassword = Encrypt(password);
    const sql = `INSERT INTO users (name,email,password,type,username) VALUES ('${name}','${encryptedEmail}','${encryptedPassword}','${type}','${username}')`
    connection.query(sql,(err,result)=>{
        if(err){
            console.log(err)
            if(err.sqlState == 45000){ // username already exists
                return response.status(500).json({error:'Username already exists',success:false});
            }
            else if(err.sqlState == 23000){ // email already exists
                return response.status(500).json({error:'Email already exists',success:false});
            }
            // throw(err)
            else
                return response.status(500).json({error:"err",success:false});
        }

        // response.redirect('/login')
        console.log('User added successfully')
        return response.status(200).json({success:true,message:'User added successfully'});
    })
})


app.listen(port,()=>{console.log(`Listening on port ${port}`)})