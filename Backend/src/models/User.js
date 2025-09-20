const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase:true
    },
    passwordHash: {
        type: String,
        required: true
    },
    kdfSalt: {     //// for vault encryption key derivation
        type: String,
        required: true
    },

},{timestamps: true });

module.exports = mongoose.model('User', userSchema);