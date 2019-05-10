const exec = require('child_process').exec;
const { success, error, warning } = require('../common/chalk');

const typeOfCmdIsArray = value => !!~Object.prototype.toString.call(value).indexOf('Array');

module.exports = ({cmd, options, args}) => {
    if (!cmd) {
        error('非法的执行命令行');
        return Promise.reject('非法的执行命令行');
    }
    return new Promise((resolve, reject) => {
        // console.log(success(cmd));
        // resolve();
        if (typeOfCmdIsArray(cmd)) {
            for (let cmdItem of cmd) {
                exec(cmdItem, (err, stdout, stderr) => {
                    if (err) {
                        error(err);
                        reject(err);
                    }
                    if (stderr) {
                        warning(stderr);
                    } else {
                        success(stdout);
                    }
                    resolve(stdout || stderr);
                });
            }
        } else {
            const finalCmd = !args && cmd || `${cmd} -${options} ${args}`;
            exec(finalCmd, (err, stdout, stderr) => {
                if (err) {
                    error(err);
                    reject(err);
                    return;
                }
                if (stderr) {
                    warning(stderr);
                } else {
                    success(stdout);
                }
                resolve(stdout || stderr);
            });
        }
    });
}