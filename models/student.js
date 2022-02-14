const mongoose = require('mongoose')

// TODO: is this a student, or is this a user?
const studentSchema = new mongoose.Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    personalCode: String,
    // TODO: this is probably unnecessary, as default _id is already derrived from current time stamp, see https://mongoosejs.com/docs/guide.html#_id
    dateCreated: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Student', studentSchema)