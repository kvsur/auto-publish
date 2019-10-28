const mongoose = require('mongoose');

const required = true, trim = true;

/**
 * 券商
 */
module.exports = new mongoose.Schema({
    brokerName: {
        type: String,
        required,
        trim,
        unique: true,
    },
    brokerKey: {
        type: String,
        required,
        trim,
        unique: true,
    },
    brokerShell: {
        type: String,
        default: '#!/bin/bash'
    },
    useShell: {
        type: Boolean,
        default: false,
    },
    dist: {
        type: String,
        default: '',
    },
    _id: {
        type: mongoose.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
    },
});