const fs = require('fs');
const path = require('path');
const { readJSON } = require('../common/JSONUtil');
const { PACKAGE_DIR_ROOT } = require('../config/path.config');

/**
 * 获取已有版本号列表，可以进行分页查询
 * @param {*} packageWhere 
 * @param {*} pagePer 
 * @param {*} currentPage 
 */
module.exports.getVersions = ({packageWhere, pagePer, currentPage}) => {
    const null_result = {
        versions: [],
        totalCounts: 0
    };
    packageWhere = PACKAGE_DIR_ROOT + '/' + packageWhere;

    return new Promise((resolve, reject) => {
        fs.open(packageWhere, 'r', (err) => {
            if (err) {
                reject(null_result);
                return;
            }
            fs.readdir(packageWhere, (err, files) => {
                if (err) {
                    resolve(null_result);
                    return;
                }
                const reg = /^\d+$/;
                const reg2 = /^[0-9]+(\.[0-9]+){1,}\.\w+.\w+$/;
                let versions = [];
                files.forEach(file => {
                    if (reg.test(file) || reg2.test(file)) {
                        versions.unshift(file);
                    }
                });
                const start = pagePer * currentPage - pagePer;
                const totalCounts = versions.length;
                versions = versions.splice(start, pagePer);
                resolve({
                    versions,
                    totalCounts,
                });
            });
        });
    });
};

module.exports.getProjectConfig =  () => {
    return readJSON(path.resolve(__dirname, '../db/data/project.config.json'));
};
