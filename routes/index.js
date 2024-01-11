//! Resume Builder - Index Router 
const express = require('express')
const router = express.Router()
const userModel = require('./users');           // User Model
const resumeModel = require('./resumeData');    // Resume Model
const passport = require('passport');
const localStrategy = require('passport-local');

passport.use(new localStrategy(userModel.authenticate()));

// Home - Landing Page (Info, Desc about the website like features, how it is ATS friendly)
router.get('/', (req, res) => {
    res.render('index');
})

//? Login View
router.get('/login', (req, res) => {
    res.render('login', { error: req.flash('error') });
})
// Login 
router.post('/login', passport.authenticate('local', {
    successRedirect: "/resumeInputs",
    failureRedirect: '/login',
    failureFlash: true, // enable flash messages
}), function (req, res) {
});

//? Signup View
router.get('/signup', (req, res) => {
    res.render('signup');
})
// signup Route
router.post('/signup', (req, res, next) => {
    const userData = new userModel({
        fullname: req.body.fullname,
        username: req.body.username,
        email: req.body.email,
    })

    userModel.register(userData, req.body.password)
        .then(function () {
            passport.authenticate('local')(req, res, function () {
                res.redirect('/login');
            })
        })
})

// Resume Data Inputs
router.get('/resumeInputs', isLoggedIn, async (req, res) => {
    res.render('resumeInputs')
})
router.post('/resumeInputs', isLoggedIn, async (req, res) => {
    const data = new resumeModel({
        // Header Part
        name: req.body.name,
        profession: req.body.profession,
        mail: req.body.mail,
        phone: req.body.phone,
        cityState: req.body.citystate,
        githubLink: req.body.githublink,
        linkedinLink: req.body.linkedinlink,
    })

    await data.save();
    res.redirect('/');
})

// Logout
router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err) };
        res.redirect('/login');
    })
});

// isLoggedIn Middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}

module.exports = router