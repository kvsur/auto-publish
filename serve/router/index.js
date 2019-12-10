const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');

const upload = multer({});

const Core = require('../core');
const SVNS = require('../common/svns');
const Doc = require('../doc');
const Log = require('../models/Log');
const Project = require('../models/Project');
const scret = require('../config/common.config').SCRET;
const auth = require('../common/auth');
const User = require('../models/User');
const md5 = require('md5');

const router = express.Router();
/**
 * 登录认证
 */

router.post('/auth', async (request, response) => {
    try {
        const { account, password } = request.body;
        const user = await auth({ account, password });

        const token = jwt.sign(user.toJSON(), scret, {
            expiresIn: '4h',
        });

        const { iat, exp } = jwt.decode(token);

        response.json({
            c: 200,
            m: '',
            d: {
                iat, exp, token,
                user: {
                    name: user.name,
                    role: user.role,
                }
            }
        });
    } catch (err) {
        response.json({
            c: 401,
            m: err,
            d: null,
        });
    }
});

/**
 * 日志路由
 */
router.post('/log', async (request, response) => {
    const { beginTime, endTime, projectName, brokerName, currentPage, perPage } = request.body;
    try {
        const t = (await Log.find()).length;
        const logs = await Log.find({
            date: { $gte: beginTime, $lte: endTime },
            projectName: new RegExp(`${projectName}`),
            brokerName: new RegExp(`${brokerName}`),
        })
            .sort({_id: -1}).skip(((currentPage || 1) - 1) * perPage).limit(perPage || 20);
        response.json({
            c: 200,
            m: '',
            d: logs,
            t
        });
    } catch (e) {
        response.json({
            c: 500,
            m: e,
            d: null,
        });
    }
});

/**
 * 文档路由
 */
router.get('/docs', (request, response) => {
    Doc.getDocs({ response });
});
router.get('/doc', (request, response) => {
    const { docKey } = request.query;
    Doc.getDoc({ docKey, response });
});
router.delete('/doc', (request, response) => {
    const { docKey } = request.query;
    Doc.delDoc({ docKey, response });
});
router.post('/doc', (request, response) => {
    const doc = request.body;
    Doc.newDoc({ doc, response });
});


/**
 * 发包部署
 */
router.post('/deploy', (request, response) => {
    const keys = Object.keys(request.body);
    if (keys.length < 8) {
        response.json({
            c: 400,
            m: '参数错误，请检测',
            d: null
        });
        return;
    }
    const deployConfig = {
        ...request.body,
        response,
    };
    Core.deploy(deployConfig);
});

/**
 * 对应项目所有版本号
 */
router.post('/getVersions', async (request, response) => {

    let { packageWhere, pagePer, currentPage, isTrunk } = request.body;
    packageWhere = isTrunk ? packageWhere : `${packageWhere}_test`;
    let result = null;
    try {
        result = await SVNS.getVersions({ packageWhere, pagePer, currentPage });
    } catch (res) {
        result = res;
    } finally {
        const { versions, totalCounts } = result;
        response.json({
            c: 200,
            m: '',
            d: {
                versions,
                totalCounts
            },
        });
    }
});

/**
 * 部署项目的配置
 */
router.get('/projectConfig', async (request, response) => {
    let projects = [];
    try {
        projects = await Project.find({});
    } catch (err) {

    } finally {
        response.json({
            c: 200,
            m: '',
            d: projects,
        });
    }
});

router.post('/addConfig', async (request, response) => {
    const config = request.body;

    try {
        const proejct = new Project(config);
        await proejct.save();

        response.json({
            c: 200,
            m: '',
            d: proejct,
        });
    } catch (e) {
        console.log(e);
        response.json({
            c: 500,
            m: e.errmsg,
            d: null
        });
    }
});

router.delete('/deleteProject', async (request, response) => {
    const { _id } = request.query;
    try {
        const result = await Project.findOneAndDelete({ _id });

        response.json({
            c: 200,
            m: '',
            d: result
        });
    } catch(err) {
        response.json({
            c: 500,
            m: err.message,
            d: null
        });
    }
});

router.delete('/deleteBroker', async (request, response) => {
    const { _id, index } = request.query;
    try {
        const result = await Project.findOne({ _id });
        result.brokers.splice(index, 1);

        await result.updateOne({brokers: result.brokers});

        response.json({
            c: 200,
            m: '',
            d: result
        });
    } catch(err) {
        response.json({
            c: 500,
            m: err.message,
            d: null
        });
    }
});


router.post('/addBroker', async (request, response) => {
    const project = request.body;

    try {
        const _id = project._id;
        const broker = project.broker;

        let old = await Project.findById(_id);
        const brokers = old.brokers;

        await old.updateOne({brokers: [broker, ...brokers]})

        response.json({
            c: 200,
            m: '',
            d: old,
        });
    } catch (e) {
        console.log(e);
        response.json({
            c: 500,
            m: e.errmsg,
            d: null
        });
    }
});

router.post('changeBroker', async (request, response) => {
    const { _id, index, useShell, brokerShell } = request.body;

    try {
        let old = await Project.findById(_id);
        const brokers = old.brokers;
        brokers[index].useShell = useShell;
        brokers[index].brokerShell = brokerShell;
        await old.updateOne({brokers: [...brokers]})

        response.json({
            c: 200,
            m: '',
            d: old,
        });
    } catch (e) {
        console.log(e);
        response.json({
            c: 500,
            m: e.errmsg,
            d: null
        });
    }
});

router.post('/addUser', async (request, response) => {
    const { account, password, name, role } = request.body;

    try {
        let user = new User({ account, password: md5(password), name, role });

        user = await user.save();
        user.password = '***********';

        response.json({
            c: 200,
            m: '',
            d: user
        });
    } catch(err) {
        response.json({
            c: 500,
            m: err.message,
            d: null
        });
    }
});

router.post('/updateUserInfo', async (request, response) => {
    const { account } = request.body;

    try {
        if (request.body.password) {
            request.body.password = md5(request.body.password);
        }
        const user = await User.findOneAndUpdate({ account }, { ...request.body });
        user.password = '***********';

        response.json({
            c: 200,
            m: '',
            d: user
        });
    } catch(err) {
        response.json({
            c: 500,
            m: err.message,
            d: null
        });
    }
});

router.delete('/deleteUser', async (request, response) => {
    const { _id } = request.query;
    try {
        const result = await User.findOneAndDelete({ _id });

        response.json({
            c: 200,
            m: '',
            d: result
        });
    } catch(err) {
        response.json({
            c: 500,
            m: err.message,
            d: null
        });
    }
});

router.get('/users', async (request, response) => {
    let users = null, m = '', c = 200;
    try {
        users = await User.find({});
        users = users.map(user => {
            return {
                _id: user._id,
                name: user.name,
                password: '************',
                account: user.account,
                role: user.role,
            };
        });
    } catch(err) {
        users = [];
        m = err.message;
        c = 500;
    } finally {
        response.json({
            c,
            m,
            d: users
        });
    }
});

router.post(`/attachment/upload`, (request, response, next) => {
    next();
});

module.exports = router;
