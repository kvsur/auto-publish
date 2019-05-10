const mongoose = require('mongoose');

const required = true, trim = true;

/**
 * 日志
 */
const LogSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required,
    },
    brokerName: {
        type: String,
        required,
        trim,
    },
    svnVersion: {
        type: String,
        required,
        trim,
    },
    result: {
        type: Boolean,
        default: false,
    },
    isTrunk: {
        type: Boolean,
        default: false,
    },
    error: {
        type: String,
        trim,
    },
    deployTime: {
        type: String,
        required,
        trim,
    },
    operator: {
        type: String,
        trim,
        required,
    },
    deployDate: {
        type: String,
        default: () => new Date().toLocaleString('zh-CN', {hour12: false, day: '2-digit', month: '2-digit', year: 'numeric'}),
        trim,
    },
});

const Log = mongoose.model('Log', LogSchema);

module.exports = Log;
