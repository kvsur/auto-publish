const exec = require('../common/exec');
const fs = require('fs');

const Log = require('../models/Log');
const Project = require('../models/Project');
const RollBack = require('./rollback');
const { success, error: errorConsole } = require('../common/chalk');
const execChmod = require('child_process').exec;
const SocketServer = require('../server/socket');

const { PACKAGE_DIR_ROOT, ARCHIVE_PATH, DIST_PATH, DEPLOY_PATH } = require('../config/path.config');

class Deploy {
    constructor({ id, _brokerId, _projectId, root, packageWhere, dist, isTrunk, svnVersion, projectKey, projectName, brokerKey, brokerName, operator, response }) {
        this._brokerId = _brokerId;
        this.id = id;
        this._projectId = _projectId;
        this.projectKey = projectKey;
        this.brokerKey = brokerKey;
        this.packageWhere = isTrunk && packageWhere || packageWhere + '_test';
        this.response = response;
        const deployPath = `${root || DEPLOY_PATH}/${projectKey}/${brokerKey}`;
        this.deployPath = deployPath;

        this.tarName = `hudson-${this.packageWhere}-${svnVersion}.tgz`;
        this.archive_source = `${PACKAGE_DIR_ROOT}/${this.packageWhere}/${svnVersion}/${this.tarName}`;

        this.distPath = dist === 'dist' ? `${DIST_PATH}/dist` : `${DIST_PATH}/dist/${dist}`;

        // 初始化日志文件
        this.log = new Log();
        this.log.operator = operator;
        this.log.projectName = projectName;
        this.log.brokerName = brokerName;
        this.log.svnVersion = svnVersion;
        this.log.deployTime = new Date().toLocaleString('zh-CN', { hour12: false });
        this.log.isTrunk = isTrunk;

        // shell script obj
        this.shell = {};

        this.stepError = '';

        // 初始化回滚工具
        this.rollback = new RollBack({ deployPath, ARCHIVE_PATH });
    }

    send(type, info) {
        SocketServer.sendMessage(this.id, 'deploy-message', {
            type,
            info
        });
    }

    /**
     * 一次完整发布的入口
     */
    async start() {
        const project = await Project.findById(this._projectId);

        // console.log(project.brokers[0]._id.toString() === this._brokerId);
        const broker = project.brokers.find(broker => broker._id.toString() === this._brokerId);
        const { brokerShell, useShell } = broker;
        this.shell = { brokerShell, useShell };
        this.send('success', '启动部署流程...')
        this._pullPackage();
    }

    _exec({ cmd, error, name, next, comment }) {
        this.send('success', comment)
        this.stepError = error;
        exec({ cmd }).then(res => {
            this.send('success', res.toString())
            name && this.rollback.push(name);
            next();
        }).catch(e => {
            errorConsole(e);
            this.send('error', e.message || e.toString())
            this.log.error = error;
            this._end();
        });
    };

    /**
     * 拉去将要发布的包
     */
    _pullPackage() {
        success('_pullPackage......↓');
        const cmd = `cp ${this.archive_source} ${ARCHIVE_PATH}`;
        this._exec({
            cmd,
            error: '拉去部署包失败',
            name: '_pullPackage',
            next: () => {
                this._tarArchive();
            },
            comment: '_pullPackage, 拉取puppet镜像包...',
        });
    }
    /**
     * 解压拉去过去的包
     */
    _tarArchive() {
        success('_tarArchive......↓');
        const cmd = `tar -mxvf ${ARCHIVE_PATH}/${this.tarName} -C ${DIST_PATH}`;
        this._exec({
            cmd,
            error: '解压部署包失败',
            name: '_tarArchive',
            next: () => {
                this._bakMap();
            },
            comment: '_tarArchive, 解压puppet镜像包...',
        });
    }
    /**
     * 备份已经部署的包
     */
    _bakMap() {
        success('_bakMap......↓');
        const cmd = `mv ${this.deployPath}.bk ${this.deployPath}.willdel && mv ${this.deployPath} ${this.deployPath}.bk`;
        this._exec({
            cmd,
            error: '备份失败',
            name: '_bakMap',
            next: () => {
                this._deploy();
            },
            comment: '_bakMap, 开始备份旧版文件...',
        });
    }
    /**
     * 正式发布环节，进行替换操作
     */
    _deploy() {
        success('_deploy......↓');
        const cmd = `cp -r ${this.distPath} ${this.deployPath}`;
        this._exec({
            cmd,
            error: '正式部署文件失败-deploy',
            name: '_deploy',
            next: () => {
                this._execPlusShell();
            },
            comment: '_deploy, 进行正式部署，替换文件...',
        });
    }

    // 附加shell 的执行操作
    async _execPlusShell() {
        success('_execPlusShell......↓');
        const { useShell, brokerShell } = this.shell;
        if (useShell && brokerShell) {
            try {
                await fs.writeFileSync(ARCHIVE_PATH + '/tempShell.sh', brokerShell.toString());

                const cmd = `${ARCHIVE_PATH}/tempShell.sh`;
                execChmod(`chmod 664 ${cmd}`);
                success(cmd + '----outter....');
                this._exec({
                    cmd,
                    error: '附件shell执行失败',
                    name: '_execPlusShell',
                    next: () => {
                        this.log.result = true;
                        this._end();
                    },
                    comment: '_execPlusShell, 执行项目附件脚本...',
                });
            } catch(e) {
                errorConsole(e.messages);
                this._end();
            }
        } else {
            this.log.result = true;
            this._end();
        }
    }
    /**
     * 删除取到的包，删除解压的包文件，删除备份.willdel 三个文件
     * 完成发布，写入日志
     */
    _end() {
        success('_end......↓');
        if (this.log.result) {
            const cmd = `rm -rf ${ARCHIVE_PATH}/* ${DIST_PATH}/* ${this.deployPath}.willdel`;
            this._exec({
                cmd,
                error: '最终部署步骤失败_end',
                next: () => {
                    this.log.save();
                    this.response.json({
                        c: 200,
                        m: '部署成功',
                        d: this.log,
                    });
                },
                comment: '_end, 执行最终部署步骤,_willdel, 删除临时文件...',
            });

            return;
        }
        this._roll();
    }
    /**
     * 如果中间环节出错，随时进行回滚
     */
    async _roll() {
        success('_roll......↓');
        this.send('warning', '_roll, 部署失败进行回滚...')
        this.log.error = this.stepError;
        await this.log.save();
        this.send('warning', '_log, 日志写入数据库...')
        this.rollback.roll();
        this.response.json({
            c: 500,
            m: this.stepError,
            d: this.log,
        });
    }
}

module.exports = Deploy;
