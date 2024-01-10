//! Resume Builder 

const express = require('express');
const app = express()

app.get('/', (req, res)=> {
    res.send('Heyy');
})

app.listen(3000);