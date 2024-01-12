//? Schema-Model for Resume Data 
const mongoose = require('mongoose')

const resumeData = mongoose.Schema({
    // Header Part (Personal Details)
    name: String,
    profession: String,
    email: String,
    phone: String,
    cityState: String,
    githubLink: String,
    linkedinLink: String,
    // Reference to the user
    user: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ]
})

module.exports = mongoose.model('resumedata', resumeData);