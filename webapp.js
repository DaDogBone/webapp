const express = require('express')
const expressHandlebars = require('express-handlebars')
const path = require ('path')

const app=express()

app.engine('handlebars', expressHandlebars.engine())
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname), 'views');
app.use(express.static(path.join(__dirname,'static')))
const port = process.env.PORT || 3000

const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'week6user',
    password: 'week6pw',
    connectionLimit: 5
});

app.get('/test', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();

        const rows = await conn.query("SELECT 1 as val");
        console.log(dbtest);

        const week6db = await conn.query('use week6db');
        console.log(week6db + 'hello');



        let rand = Math.random() * 100;

        const insert_result = await conn.query("insert into t values (?)", [rand]);
        console.log(insert_result); // { affectedRows: 1, insertId: 1, warningStatus: 0 }

        let trows = await conn.query("SELECT x from t as val_x");
        console.log(rows); //[ {x: 1}, meta: ... ]

        res.render('showdata', {
            title: 'data results',
            data: rows,
            isDeleted: false
        })

    } catch (err) {
        console.log(err)
        throw err;
    } finally {
        console.log('what just happened')
        if (conn) return conn.end();
    }
})


app.get('/', (req, res) => {
    res.render('home', {
        title: 'Artdrop',
        name: 'Me'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About ArtDrop',
        
    })
})

app.use((req, res, next) => {
    res.status(404)
    res.render('404')
})
/*
app.use((err, req, res, next) => {
    console.error(err.message)
    res.status(500)
    res.render('500')
})
*/
app.listen(port, () => console.log(`step on http://localhost:${port} Press Ctrl-C to terminate.`))