const express = require('express')
const expressHandlebars = require('express-handlebars')
const path = require('path')
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
        title: 'TGIFF Home',
        name: 'Professor Eipp',
    })
})


// route to /about
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'Meadowlark About',
    })
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
