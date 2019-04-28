const express = require("express");

const app = express();

app.get('/', (req,res) => {
    res.send('This is working');
});

app.listen(3001, () => {
    console.log("Server is up"); 
});