const express = require('express')
const expressHandlebars = require('express-handlebars')
const path = require('path')
const axios = require('axios')
const port = process.env.PORT || 3001
const app = express()

const { credentials } = require('./config')
const { requiresAuth } = require('express-openid-connect');

const cookieParser = require('cookie-parser')
const expressSession = require('express-session')


app.engine('handlebars', expressHandlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'static')));


app.use(
    express.urlencoded({
        extended: true,
    })
)


//order of next two lines matter! cookie parser must come first 

// app.use(cookieParser(credentials.cookie_secret))

/*
app.use(expressSession({

    resave: false,
    saveUnintitalized: false,
    secret: credentials.cookie_secret,

}))
*/


////////////////////////////////////////////////////

const { auth } = require('express-openid-connect');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'http://localhost:3000',
  clientID: 'dT6WPWxPkjh8LlEECZBF3YKQjkFWIFjf',
  issuerBaseURL: 'https://dev-4flb1xfw0zmfcbxo.us.auth0.com'
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
 
    //res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
    
    if(req.oidc.isAuthenticated())
        res.redirect('/home')
    else
        res.redirect('/login')

});

    
/////////////////////////////////////////////////////////////




//resave forces session to be saved back to the store even if
//      the request wasnt modifed
//saveUninitalized: true causes unitalzied sessions to be saved to the store 
//       even when not modified
//secret: the key used tp sogn the cookie of the session id

// establish a connection to a mariadb database
const mariadb = require('mariadb')
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'week6user',
    password: 'week6pw',
    connectionLimit: 5
})


// route to test my database setup
app.get('/test', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const dbtest = await conn.query('select 1 as val')
        console.log(dbtest)

        res.type('text/plain')
        res.status(200)
        res.send('made it to route: /test')
    } catch (err) {
        console.log(err)
    } finally {
        if (conn) return conn.end();
    }

})

/*
app.get('/hands', async (req, res) => {
})

*/
// route to /
/*
app.get('/', (req, res) => {

    console.log
        ('snacking on some cookies')
    res.cookie
        ('monster', 'ohh nom nom nom',
            { secure: true, maxAge: 720000 })
    res.cookie
        ('signed_monster', 'signed much munch munch', { signed: true },
            { signed: true, secure: true, maxAge: 720000 })
    //console.log
    //  ('done with cookies')


    //secure: only sends over https
    //signed: if tampered with, rejected by server, restored to origonal value
    // maxAge: how long clinet keeps cookies before deleting it
    //      if ommited, it is denied when browser is closed


    req.session.username = 'DogBone'
    req.session.password = 'saveoursouls'
    const color = req.session.colorScheme || 'dark'
    console.log('session color: ' + color)

    res.render('login', {
        title: 'Artdrop',
        name: 'Ethan Maxson',
        loginHeader: true,

    })
})

*/

/*
app.get('/cookies', (req, res) => {

    const mv = 'monster: ' + res.cookies.monster + '<br>'
    const smv = 'signed_moster: ' + req.cookies.signed_monster + '<br>'

    let values = mv + smv
    values += req.session.username + ' :: ' + req.session.password

    //delete cookies
    res.clearCookie('monster')
    res.clearCookie('signed_monster')

    //clear session data
    delete req.session.username
    delete req.session.password

    res.type('html')
    res.end(values)
})
*/


// route to /about
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'Artdrop About',
        loginHeader: true,

    })
})


app.get('/register', (req, res) => {

    res.render('register', {
        title: 'Sign Up',
        loginHeader: true,
    })

})

/*
app.post('/addnewuser', (req, res) => {

    // console.log(req)
    const usern = req.body.username
    const userpassw = req.body.userpw
    console.log(usern + userpassw)

    // do database work here

    res.render('register', {
        title: 'Sign Up'
    })
})
*/

app.get('/home', async (req, res) => {

    if (!req.oidc.isAuthenticated()) {
        // redirect to /login route
    }

    res.render('home', {
        title: 'home',
        loggedin: req.oidc.isAuthenticated(),

    })
})

app.get('/postimage', async (req, res) => {
    res.render('postimage', {
        title: 'ArtDrop'
    })
})

app.post('/finishpost', async (req,res) => {
    res.render('home', {
        title: 'Home'
    })
})

    
/*
app.post('/login', async (req, res) => {
    console.log(req)
    const usern = req.body.username
    const userpassw = req.body.userpw

    res.render('register', {
        title: 'Welcome!!!',
        username: usern,
        userpw: userpassw,
    })
})

*/


/*
app.get('/apinasa', (req, res) => { 
    axios.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
    .then(response => {
        console.log(response.data)
        console.log(response.data.url)
        console.log(response.data.explanation)

        res.end(response.data.explanation)
    })
    .catch(error => {
        console.log(error)
    })
    
})

app.get('/apidad', async(req, res) => {
    const options = {
    method: 'GET',
    url: 'https://dad-jokes.p.rapidapi.com/random/joke',
    headers: {
        'X-RapidAPI-Key': '0a05d4f6e2msh5da4800a566796dp1a0aacjsnd8490e08088f',
        'X-RapidAPI-Host': 'dad-jokes.p.rapidapi.com'
            }
};

    try {
        const response = await axios.request(options);
        //console.log(response.data);

        //console.log(response.data.body)
        const obj = response.data.body
        
        const setup = obj.setup
        const punchline = obj.punchline

        console.log(setup)
        console.log("\n" + punchline)

        res.end(JSON.stringify(response.data))
    } catch (error) {
        console.error(error);
    }

})
*/
// custom 500
app.use((err, req, res, next) => {
    console.error(err.message)
    res.type('text/plain')
    res.status(500)
    res.send('500 - Server Error')
})


// custom 404
app.use((req, res) => {
    res.type('text/plain')
    //console.log(res.get('Content-Type'))
    res.status(404)
    res.send('404 - Page Not Found')
})


// start the server listening for requests...
app.listen(port, () => {
    console.log(`Running on http://localhost:${port} ` +
        `Press Ctrl-C to terminate.`)
})
