// server.js
const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const dotenv = require('dotenv');
const { Connection, Request, TYPES } = require('tedious');

const app = express();

dotenv.config();

const config = {
    authentication: {
        options: {
            userName: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        },
        type: 'default'
    },
    server: process.env.DB_SERVER,
    options: {
        database: process.env.DB_NAME,
        encrypt: true
    }
};

const connection = new Connection(config);
connection.on('connect', err => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to Azure SQL Database');
    }
});

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));

app.get('/Signup.html', (req, res) => {
    res.sendFile(__dirname + '/Signup.html');
});

app.get('/Signup', (req, res) => {
    res.sendFile(__dirname + '/Signup.html');
});


app.post('/Signup', async (req, res) => {
    const { username, password, weight, age, gender } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const request = new Request(
            `INSERT INTO Users (username, password, weight, age, gender) VALUES (@username, @password, @weight, @age, @gender);`,
            err => {
                if (err) {
                    console.error(err.message);
                    res.status(500).send('Error saving user');
                } else {
                    res.redirect('/Login');
                }
            }
        );

        request.addParameter('username', TYPES.NVarChar, username);
        request.addParameter('password', TYPES.NVarChar, hashedPassword);
        request.addParameter('weight', TYPES.Int, weight);
        request.addParameter('age', TYPES.Int, age);
        request.addParameter('gender', TYPES.NVarChar, gender);

        connection.execSql(request);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating user');
    }
});

app.get('/Login.html', (req, res) => {
    res.sendFile(__dirname + '/Login.html');
});

// Define route handler for root URL
app.get('/', (req, res) => {
    res.redirect('/Signup'); 
});

app.post('/Login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const request = new Request(
            `SELECT password FROM Users WHERE username = @username;`,
            async (err, rowCount, rows) => {
                if (err) {
                    console.error(err.message);
                    res.status(500).send('Error retrieving user');
                } else {
                    if (rowCount === 0) {
                        res.status(401).send('Invalid username or password');
                    } else {
                        const storedPassword = rows[0][0].value;
                        const match = await bcrypt.compare(password, storedPassword);
                        if (match) {
                            req.session.authenticated = true;
                            res.redirect('/Index');
                        } else {
                            res.status(401).send('Invalid username or password');
                        }
                    }
                }
            }
        );

        request.addParameter('username', TYPES.NVarChar, username);

        connection.execSql(request);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error authenticating user');
    }
});

app.get('/Index.html', (req, res) => {
    if (req.session.authenticated) {
        res.send('Welcome to the dashboard!');
    } else {
        res.redirect('/Login');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
