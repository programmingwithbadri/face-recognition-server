const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const user = require('./controllers/user');
const image = require('./controllers/image')
const auth = require('./middleware/auth')

const app = express();

const port = process.env.PORT || 3000;

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

app.post('/signin', (req, res) => signin.handleSigninAuthentication(req, res, db, bcrypt));

app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt));

app.get('/profiles/:id', auth.requireAuth, (req, res) => user.getUserProfile(req, res, db));

app.post('/profiles/:id', auth.requireAuth, (req, res) => user.updateUserProfile(req, res, db));

app.put('/entries', auth.requireAuth, (req, res) => user.getUserEntries(req, res, db));

app.post('/imageUrl', auth.requireAuth, (req, res) => image.handleApiCall(req, res));

app.listen(port, () => console.log(`Server is listening at port ${port}`));