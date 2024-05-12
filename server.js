const express = require('express');
const app = express();
const session = require('express-session');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config();


// Assuming Users() function handles database operations
const Users = require('./Public/User.js'); // Adjust the path as per your project structure

const PORT = process.env.PORT || 4000;

app.use(express.static('Public'));
app.use(express.static('View'));
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));

app.use(function(req, res, next) {
    res.locals.user = req.session.user;
    res.locals.currentPage = req.path;
    next();
});

const validateLogIn = (reqUser, dbUser) => {
    if (!reqUser.username || !reqUser.password) {
        return 'Both username and password are required';
    }
    if (dbUser === "") {
        return 'Username not found';
    }
    if (reqUser.password !== dbUser.password) {
        return 'Incorrect password';
    }
    return true;
};

function validateCreate(reqUser, dbUser) {
    if (!reqUser.username || !reqUser.password) {
        return 'Both username and password are required';
    }
    if (dbUser !== "") {
        return 'Username already exists';
    }
    return true;
};

app.get('/login', (req, res) => {
    if (req.session.loggedin) {
        res.redirect('/');
        return;
    }
    res.sendFile(path.join(__dirname, '../FINAL-PROG/login.html'));
});

app.post('/login', async (req, res) => {
    const reqUser = req.body;
    let validate = false;
    let dbUser;
    await Users('get', { username: reqUser.username }).then((result) => {
        dbUser = result;
    })
    .catch(err => {
        console.log(err)
    });

    validate = validateLogIn(reqUser, dbUser)

    if (validate !== true) {
        res.sendFile(path.join(__dirname, '../FINAL-PROG/login.html'), { error: validate });
        return;
    } else {
        req.session.loggedin = true;
        req.session.user = dbUser;
        res.redirect('/');
    }
});

app.post('/logout', (req, res) => {
    req.session.loggedin = false;
    req.session.user = "";
    res.redirect('/login.html');
});

app.get('/signup', (req, res) => {
    if (req.session.loggedin) {
        res.redirect('/');
        return;
    }
    res.sendFile(path.join(__dirname, '../FINAL-PROG/signup.html'));
});

app.post('/signup', async (req, res) => {
    const reqUser = req.body;
    let dbUser;
    await Users('get', { username: reqUser.username }).then((result) => {
        dbUser = result;
    })
    const validate = validateCreate(reqUser, dbUser);

    if (validate !== true) {
        res.sendFile(path.join(__dirname, '../FINAL-PROG/signup.html'), { error: validate });
    } else {
        // Save user to database
        await Users('create', { 
            username: reqUser.username, 
            password: reqUser.password, 
            weight: reqUser.weight, 
            age: reqUser.age, 
            gender: reqUser.gender 
        });
        res.redirect('/login.html'); // Change this to /login.html
    }
});


app.get('/', (req, res) => {
    if (!req.session.loggedin) {
        res.redirect('/login');
        return;
    }
    res.sendFile(path.join(__dirname, '../FINAL-PROG/Index.html'), { error: '' });
});

app.get('/Index.html', (req, res) => {
    if (!req.session.loggedin) {
        res.redirect('/login');
        return;
    }
    res.sendFile(path.join(__dirname, '../FINAL-PROG/Index.html'), { error: '' });
});

app.get('/meal-creator.html', (req, res) => {
    if (!req.session.loggedin) {
        res.redirect('/login');
        return;
    }
    res.sendFile(path.join(__dirname, '../FINAL-PROG/meal-creator.html'), { error: '' });
});

app.get('/meal-tracker.html', (req, res) => {
    if (!req.session.loggedin) {
        res.redirect('/login');
        return;
    }
    res.sendFile(path.join(__dirname, '../FINAL-PROG/meal-tracker.html'), { error: '' });
});

app.get('/nutri-reports.html', (req, res) => {
    if (!req.session.loggedin) {
        res.redirect('/login');
        return;
    }
    res.sendFile(path.join(__dirname, '../FINAL-PROG/nutri-reports.html'), { error: '' });
});

app.get('/activity-tracker.html', (req, res) => {
    if (!req.session.loggedin) {
        res.redirect('/login');
        return;
    }
    res.sendFile(path.join(__dirname, '../FINAL-PROG/activity-tracker.html'), { error: '' });
});

app.get('/signup.html', (req, res) => {
    if (req.session.loggedin) {
        res.redirect('/');
        return;
    }
    res.sendFile(path.join(__dirname, '../FINAL-PROG/signup.html'));
});

app.get('/login.html', (req, res) => {
    if (req.session.loggedin) {
        res.redirect('/');
        return;
    }
    res.sendFile(path.join(__dirname, '../FINAL-PROG/login.html'));
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`To access the login page, go to: http://localhost:${PORT}/login`);
});

