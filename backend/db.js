require("dotenv").config();
const mongoose = require("mongoose");
const url = process.env.MONGO_URL;

mongoose.connect(url)

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 30
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        length: 10,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 8
    }
});

const User = mongoose.model('User', userSchema);

const bookingSchema = new mongoose.Schema({
    service:{
        type:String,
        require:true
    },
    appointmentDate:{
        type:String,
        require:true,
    },
    appointmentTime:{
        type:String,
        require:true
    },
    place:{
        type:String,
        require:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
})

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = { User, Booking };