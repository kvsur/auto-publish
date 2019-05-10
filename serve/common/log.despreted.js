const fs = require('fs');
const path = require('path');

const JSONUtil = require('./JSONUtil');

const read = date => {
    date = date || (new Date()).toLocaleDateString().split('/').join('-');
    const dataPath = path.resolve(__dirname, `../log/${date}.log`);
    return JSONUtil.readJSON(dataPath);
}

class Log {
    /**
     * 
     * @param { String } brokerName 券商对应名称
     * @param { String } deployTime 发布时间
     * @param { String /^\d+$/} b SVN版本号
     * @param { Boolean } isTrunk 是否为trunk包
     * @param { Boolean } result 部署结果
     */
    constructor() {
        this.projectName = '';
        this.brokerName = '';
        this.deployTime = '';
        this.svnVersion = '';
        this.isTrunk = false;
        this.result = false;
        this.error = '';
    }

    writeLog() {
        const logContent = {
            projectName: this.projectName,
            brokerName: this.brokerName,
            deployTime: this.deployTime,
            svnVersion: this.svnVersion,
            isTrunk: this.isTrunk,
            result: this.result,
            error: this.error
        };
        let finalLogs = [logContent];

        const date = (new Date()).toLocaleDateString().split('/').join('-');
        const dataPath = path.resolve(__dirname, `../log/${date}.log`);

        return new Promise((resolve, reject) => {
            read(date).then(logs => {
                finalLogs = finalLogs.concat(logs);
            }).catch(e => {
                // what should I do here???
            }).finally(() => {
                JSONUtil.writeJSON(dataPath, finalLogs).then(res => {
                    resolve(res);
                }).catch(res => {
                    reject(res);
                });
            });
        });
    }

    static readLog(date) {
        return read(date);
    }
}

module.exports = Log;
