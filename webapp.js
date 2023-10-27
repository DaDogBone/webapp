const express = require('express')
const expressHandlebars = require('express-handlebars')
const path = require('path')
const axios = require('axios')
const port = process.env.PORT || 3000
const app = express()

app.engine('handlebars', expressHandlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'static')));


// establish a connection to a mariadb database
const mariadb = require('mariadb')
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'week6user',
    password: 'week6pw',
    connectionLimit: 5
})


// route to test my database setup
app.get('/test', async(req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const dbtest = await conn.query('select 1 as val')
        console.log(dbtest)
       
        res.type('text/plain')
        res.status(200)
        res.send('made it to route: /test')
    } catch(err) {
        console.log(err)
    } finally {
        if (conn) return conn.end();
    }
})

// route to /
app.get('/', (req, res) => {    
    res.render('home', {
        title: 'Artdrop',
        name: 'Ethan Maxson',
    })
})


// route to /about
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'Artdrop About',
    })
})

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

// custom 500
app.use((err, req, res, next) => {
    console.error(err.message)
    res.type('text/plain')
    res.status(500)
    res.send('500 - Server Error')
})


// custom 404
app.use((req, res)=> {
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
