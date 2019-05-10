const path = require('path');

const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const rjwt = require('restify-jwt-community');

const secret = require('../config/common.config').SCRET; 

const App = express();

App.use(cors({
    origin: 'http://localhost:1024',
    methods: ['GET', 'POST', 'DELETE'],
})); // 跨域请求处理
App.use(bodyParser.json());
App.use(bodyParser.urlencoded({ extended: false }));
App.use(cookieParser());
App.use(express.static(path.join(__dirname, 'static'))); // 静态文件处理插件
App.use(logger(':method :url :status :res[content-length] - :response-time ms')); // 请求日志显示
App.use(rjwt({ secret }).unless({ path: ['/api/auth'] }));

module.exports = App;
