const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors());

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
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
        res.status('200').json(database.users[0])
    }
    else {
        res.status('400').json("Bad Request")
    }
});

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    database.users.push({
        id: 3,
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    });

    res.json(database.users[database.users.length - 1]);
})

app.get('/profiles/:id', (req, res) => {
    const { id } = req.params;

    // Checking for == since the id will be string in the params
    const userProfile = database.users.find(user => user.id == id);

    userProfile
        ? res.json(userProfile)
        : res.status('404').json("User profile not found");
})

app.put('/entries', (req, res) => {
    const { id } = req.body;
    const user = database.users.find((user) => {
        if(user.id == id) {
           return user.entries++;
        }
    });

    user
        ? res.json(user.entries)
        : res.status('404').json("User profile not found");

})

app.listen(3001, () => {
    console.log("Server is up");
});