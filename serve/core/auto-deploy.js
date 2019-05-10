const fs = require('fs');
const { success, error, warning } = require('../common/chalk');
const Log = require('../common/log');
const RollBack = require('./rollback');
const options = require('../config/common.config').watchOptions;
const { PACKAGE_CONFIG } = require('../config/path.config');

class AutoDeploy {
    constructor(watchDir) {
        this.watchDir = watchDir;
        this.dist = !!~watchDir.indexOf('hcs') ? PACKAGE_CONFIG['znkf2b_hcs'].dist : PACKAGE_CONFIG['znkf2b_webapp'].dist;
        this.rollBack = new RollBack();
        this.log = new Log();
    }

    start() {
        fs.open(this.watchDir, 'r', (err, fd) => {
            if (err) {
                error(`操作错误：无法对文件夹 ${this.watchDir} 进行监听`);
                return;
            }
            fs.watch(this.watchDir, options, this.listener);
        });
    }
    stop() {
        // fs.unwatchFile
    }

    listener(eventName, SVN_DIR) {
        if (eventName !== 'change' && fs.existsSync(`${this.watchDir}/${SVN_DIR}`)) {
            this.log.deployTime = (new Date).toLocaleString('zh-CN', {hour12: false}).replace(/\//g, '-');
        }
    }
};

module.exports = AutoDeploy;
