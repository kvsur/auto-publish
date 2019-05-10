const exec = require('../common/exec');
const { ARCHIVE_PATH, DIST_PATH } = require('../config/path.config');

/**
 * 发布过程中如果遇到错误停止部署了则要进行回滚操作，保证已经部署版本不受影响
 */

class RollBack {
    constructor ({ deployPath }) {
        this.deployPath = deployPath;
        this.steps = [];
    }

    push(step) {
        this.steps.push(step);
    }

    roll() {
        const length = this.steps.length;

        if (length > 0) {
            this[this.steps[length - 1]]();
        }
    }

    /**
     * 回滚已pull的部署包
     */
    _pullPackage() {
        const cmd = `rm -rf ${ARCHIVE_PATH}/*`;
        exec({cmd});
    }
    /**
     * 回滚已解压的内容
     */
    _tarArchive() { 
        const cmd = `rm -rf ${DIST_PATH}/*`;
        exec({cmd}).finally(() => {
            this._pullPackage();
        });
    }
    /**
     * 回滚已备份的内容
     */
    _bakMap() {
        const cmd = `mv ${this.deployPath}.bk ${this.deployPath} && mv ${this.deployPath}.willdel ${this.deployPath}.bk`;
        exec({cmd}).finally(() => {
            this._tarArchive();
        });
    }
    /**
     * 回滚已发布的内容
     */
    _deploy() {
        const cmd = `rm -rf ${this.deployPath}`;
        exec({cmd}).finally(() => {
            this._bakMap();
        });
    }
}

module.exports = RollBack;
