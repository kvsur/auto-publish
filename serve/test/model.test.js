const mongo = require('mongoose');
const Doc = require('../models/Doc');
const Project = require('../models/Project');

const md5 = require('md5');

const User = require('../models/User');

// const UserSchema = new mongo.Schema({
//     email: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     name: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     key: {
//         type: mongo.Types.ObjectId,
//         default: new mongo.Types.ObjectId()
//     }
// });

// const User = mongo.model('User', UserSchema);
// mongodb://licheng:hello1024@ds119476.mlab.com:19476/znkf_publish
// mongo.connect('mongodb://10.10.80.224:27017/ZNKF_PUBLISH', {useNewUrlParser: true});
mongo.connect('mongodb://licheng:hello1024@ds119476.mlab.com:19476/znkf_publish', {useNewUrlParser: true});

const db = mongo.connection;

db.on('connected', async () => {
    console.log('Mongo connection is ok .....');
    try {
        const project = await Project.brokers.findById('5c3319d2a7db971744099ad3');
        console.log(project);
        // await User.insertMany([
        //     {
        //         account: 'admin@gmail.com',
        //         password: md5('hello'),
        //         name: '管理员',
        //     }
        // ]);
    //     await Doc.insertMany([
    //         {
    //             "docName": "可视化部署项目设计方案",
    //             "docKey": "5c00d2bcfb6fc038cbafb027",
    //             "createTime": "2018-11-27 20:28:41",
    //             "author": "李成",
    //             "lastUpdateTime": "2018-11-30 15:17:12"
    //         },
    //         {
    //             "docName": "messageCenter消息中心",
    //             "docKey": "5c00d2e0fb6fc038cbafb033",
    //             "createTime": "2018-11-13 16:10:44",
    //             "author": "licheng",
    //             "lastUpdateTime": "2018-11-13 16:10:44"
    //         }
    //     ]);

    //     await Project.insertMany([
    //         {
    //             "projectName": "客服平台",
    //             "projectKey": "mgmt",
    //             "packageWhere": "znkf2b_hcs",
    //             "dist": "mgmt",
    //             "brokers": [
    //                 {
    //                     "brokerKey": "common",
    //                     "brokerName": "公版"
    //                 }
    //             ]
    //         },
    //         {
    //             "projectName": "对话页",
    //             "projectKey": "webapp",
    //             "packageWhere": "znkf2b_webapp",
    //             "dist": "webapp",
    //             "brokers": [
    //                 {
    //                     "brokerKey": "rebuild",
    //                     "brokerName": "公版"
    //                 },
    //                 {
    //                     "brokerKey": "jintou",
    //                     "brokerName": "金投"
    //                 }
    //             ]
    //         }
    //     ]);

    //     const projects = await Project.find({});

    //     console.log(projects);
    } catch(e) {
        console.log(e);
    }
});

db.on('error', (e) => {
    console.log(0);
    console.log(e);
});

