const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');
const register = require('./controllers/register.js');
const signin = require('./controllers/signin.js');
const user = require('./controllers/user.js');
const image = require('./controllers/image.js')

const app = express();

app.use(bodyParser.json());
app.use(cors());

const db = knex({
    client: 'pg',
    connection: {
        // This is for Heroku
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    }
});

app.get('/', (req, res) => user.getUsers(req, res, db));

app.post('/signin', (req, res) => signin.handleSigninAuthentication(db, bcrypt));

app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt));

app.get('/profiles/:id', (req, res) => user.getUserProfile(req, res, db));

app.post('/profiles/:id', (req, res) => user.updateUserProfile(req, res, db));

app.put('/entries', (req, res) => user.getUserEntries(req, res, db));

app.post('/imageUrl', (req, res) => image.handleApiCall(req, res));

app.listen(process.env.PORT || 3000, () => console.log("Server is up"));