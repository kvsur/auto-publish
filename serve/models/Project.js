const mongoose = require('mongoose');
const Broker = require('./Broker');
const required = true, trim = true, unique = true;

/**
 * 项目
 */
const ProjectSchema = new mongoose.Schema({
    brokers: {
        type: [Broker],
        default: []
    },
    root: {
        type: String,
        trim,
        default: '',
    },
    dist: {
        type: String,
        required,
        trim,
    },
    packageWhere: {
        type: String,
        required,
        trim,
    },
    projectKey: {
        type: String,
        required,
        trim,
        unique,
    },
    projectName: {
        type: String,
        required,
        trim,
        unique,
    }
});

module.exports = mongoose.model('Project', ProjectSchema);
