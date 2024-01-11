//? Schema-Model for Resume Data 
const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/resumeDB');
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.on('open', () => console.log("Connected To resumeDB"));

const resumeData = mongoose.Schema({
    name: String,
    github: String,
    linkedin: String,
})

module.exports = mongoose.model('data', resumeData);