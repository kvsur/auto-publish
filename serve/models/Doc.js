const mongoose = require('mongoose');

const required = true, trim = true;

module.exports = mongoose.model('Doc', new mongoose.Schema({
    docName: {
        type: String,
        required,
        trim,
    },
    docKey: {
        type: mongoose.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
    },
    author: {
        type: String,
        required,
        trim,
    },
    createTime: {
        type: String,
        default: () => new Date().toLocaleString('zh-CN', {hour12: false}),
        trim,
    },
    lastUpdateTime: {
        type: String,
        default: () => new Date().toLocaleString('zh-CN', {hour12: false}),
        trim,
    }
}));