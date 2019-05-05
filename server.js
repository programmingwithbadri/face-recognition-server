const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');
const register = require('./controllers/register.js');
const signin = require('./controllers/signin.js')
const user = require('./controllers/user.js')

const app = express();

app.use(bodyParser.json());
app.use(cors());

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'admin',
        database: 'users'
    }
});

app.get('/', (req, res) => user.getUsers(req, res, db));

app.post('/signin', (req, res) => signin.handleSignin(req, res, db, bcrypt));

app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt));

app.get('/profiles/:id', (req, res) => user.getUserProfile(req, res, db));

app.put('/entries', (req, res) => user.getUserEntries(req, res, db));

app.listen(3001, () => console.log("Server is up"));