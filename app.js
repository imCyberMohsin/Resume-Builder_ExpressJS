//! Resume Builder
require('dotenv').config();
const express = require('express');
const app = express()
const indexRouter = require('./routes/index');  // index Router
const userRouter = require('./routes/users');   // user Router
// const resumeDataRouter = require('./routes/resumeData');    // resumeData Router 
const expressSession = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')

//? Middlewares 
app.use(express.urlencoded({ extended: true })); // Middleware to parse form data
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(flash());

//? Persistance login session - using express session 
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: 'MDMDMD'
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(userRouter.serializeUser());
passport.deserializeUser(userRouter.deserializeUser());

//? Using Routers 
app.use('/', indexRouter)
app.use('/users', userRouter)
// app.use('/resumeData', resumeDataRouter)


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server Running on Port ${port}`);
})