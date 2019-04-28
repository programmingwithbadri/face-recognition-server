const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const database = {
    users:
        [{
            id: 1,
            name: 'John',
            email: 'john@gmail.com',
            password: '12345',
            entries: 1,
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
        res.status('200').json("Success")
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

    res.json(database.users[database.users.length-1]);
})

app.listen(3001, () => {
    console.log("Server is up");
});