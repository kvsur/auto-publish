const mongoose = require('mongoose');
const md5 = require('md5');
const required = true, trim = true, unique = true;

const UserSchema = mongoose.Schema({
    account: {
        type: String,
        trim,
        required,
        unique,
    },
    name: {
        type: String,
        trim,
        required,
    },
    password: {
        type: String,
        default: () => md5('123456'),
        trim,
    },
    role: {
        type: String,
        default: () => 'monkey-coder',
        trim,
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;