//! Resume Builder
require('dotenv').config(); 
const express = require('express');
const app = express()
const indexRouter = require('./routes/index');  // index Router
const resumeDataRouter = require('./routes/resumeData');    // resumeData Router 

//? Middlewares 
app.use(express.static('public'))
app.set('view engine', 'ejs')

//? Using Routers 
app.use('/', indexRouter)
app.use('/resumeData', resumeDataRouter)


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server Running on Port ${port}`);
})