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
    if (req.isAuthenticated()) {
        return res.redirect('/myResume');
    }
    // Fixed Multiple Headers issue when signup
    // This Line will not be executed if the user is already authenticated
    res.render('login', { error: req.flash('error') });
})
// Login 
router.post('/login', passport.authenticate('local', {
    successRedirect: "/myResume",
    failureRedirect: '/login',
    failureFlash: true,
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

//? myResume Info (Inputs)
router.get('/myResumeInfo', isLoggedIn, async (req, res) => {
    try {
        const user = await userModel.findOne({ username: req.session.passport.user })
            .populate('resumeData'); // Populate the resumeData field
        console.log('Username:', req.session.passport.user);
        console.log('User Data:', user);
        res.render('myResumeInfo', { user });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/myResumeInfo', isLoggedIn, async (req, res) => {
    try {
        const userData = await userModel.findOne({ username: req.session.passport.user });
        let data;
        if (userData.resumeData && userData.resumeData.length > 0) {
            // If resumeData exists, attempt to find it
            data = await resumeModel.findById(userData.resumeData[0]); // Assuming resumeData is an array

            if (!data) {
                // If data is null, create a new resumeModel
                console.log('Creating new resumeData');
                data = new resumeModel({
                    // Personal Details
                    name: req.body.name,
                    profession: req.body.profession,
                    email: req.body.email,
                    phone: req.body.phone,
                    cityState: req.body.cityState,
                    githubLink: req.body.githubLink,
                    linkedinLink: req.body.linkedinLink,

                    // Skills
                    languages: req.body.languages,
                    frameworks: req.body.frameworks,
                    databases: req.body.databases,
                    tools: req.body.tools,

                    user: userData._id
                });

                // Save the new resumeData
                await data.save();

                // Update the user reference with the new resumeData
                userData.resumeData = [data._id]; // Assuming resumeData is an array
                await userData.save();
            } else {
                // If data is found, update the resumeData fields
                console.log('Updating existing resumeData');
                data.name = req.body.name;
                data.profession = req.body.profession;
                data.email = req.body.email;
                data.phone = req.body.phone;
                data.cityState = req.body.cityState;
                data.githubLink = req.body.githubLink;
                data.linkedinLink = req.body.linkedinLink;

                // Skills
                data.languages = req.body.languages;
                data.frameworks = req.body.frameworks;
                data.databases = req.body.databases;
                data.tools = req.body.tools;

                // Save the updated resumeData
                await data.save();
            }
        } else {
            // If resumeData doesn't exist, create a new one
            console.log('Creating new resumeData');
            data = new resumeModel({
                // Personal Details
                name: req.body.name,
                profession: req.body.profession,
                email: req.body.email,
                phone: req.body.phone,
                cityState: req.body.cityState,
                githubLink: req.body.githubLink,
                linkedinLink: req.body.linkedinLink,

                // Skills
                languages: req.body.languages,
                frameworks: req.body.frameworks,
                databases: req.body.databases,
                tools: req.body.tools,

                user: userData._id
            });

            // Save the new resumeData
            await data.save();

            // Update the user reference with the new resumeData
            userData.resumeData = [data._id]; // Assuming resumeData is an array
            await userData.save();
        }

        res.redirect('/myResume');
    } catch (error) {
        console.error('Error saving or updating resume data:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Resume Display for specific user
router.get('/myResume', isLoggedIn, async (req, res) => {
    const user = await userModel.findOne({ username: req.session.passport.user }).populate('resumeData');
    res.render('myResume', { user });
    console.log(user.resumeData);
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