const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');

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

const database = {
    users:
        [{
            id: 1,
            name: 'John',
            email: 'john@gmail.com',
            password: '12345',
            entries: 3,
            joined: new Date()
        },
        {
            id: 2,
            name: 'James',
            email: 'james@gmail.com',
            password: '54321',
            entries: 2,
            joined: new Date()
        }]
};
app.get('/', (req, res) => {
    res.json(database.users);
});

app.post('/signin', (req, res) => {
    const { email, password } = req.body;
    db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid) {
                return db.select('*').from('users')
                    .where('email', '=', email)
                    .then(user => res.json(user[0]))
                    .catch(() => res.status(400).json('unable to get user'))
            } else {
                res.status(400).json('Wrong credentials')
            }
        })
        .catch(() => res.status(400).json('Wrong credentials'))
});

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            email: email,
            hash: hash
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        name: name,
                        email: loginEmail[0],
                        joined: new Date()
                    })
                    .then(user => res.json(user[0]))
            }).then(trx.commit)
            .catch(trx.rollback)
    })
        .catch(() => res.status('400').json('Unable to register'))
})

app.get('/profiles/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({
        id: id
    }).then(userProfile => {
        console.log(userProfile)
        if (userProfile.length) {
            res.json(userProfile[0])
        } else {
            res.status('404').json("User profile not found");
        }
    }).catch(() => res.status('500').json("Error getting the user profile"));
})

app.put('/entries', (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0])
        })
        .catch(() => res.status('400').json('Error getting user entries'));
})

app.listen(3001, () => {
    console.log("Server is up");
});