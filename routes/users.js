//! user Model 
const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose');

// mongoose.connect('mongodb://127.0.0.1:27017/resumeDB');  // Local
mongoose.connect(process.env.MONGO_URL);  // MongoAtlas
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.on('open', () => console.log("Connected To resumeDB"));

const userSchema = new mongoose.Schema({
    fullname: String,
    username: String,
    email: String,
    password: String,
    // Reference to the resumeData
    resumeData: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'resumedata'
        }
    ]
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', userSchema);