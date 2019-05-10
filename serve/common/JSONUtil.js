const fs = require('fs');

module.exports.readJSON = function (path) {
    return new Promise((resolve, reject) => {
        fs.open(path, 'r', (err, fd) => {
            if (err) {
                reject('数据不存在或无权限打开');
                return;
            }
            fs.readFile(path, 'utf8', (err, buffer) => {
                if (err) {
                    reject('读取数据失败');
                    return;
                }
                const data = JSON.parse(buffer && buffer.toString() || null);
                data && resolve(data);
                reject('读取数据失败');
            });
        });
    });
}

module.exports.readJSONSync = function (path) {
    try {
        return JSON.parse(fs.readFileSync(path).toString());
    } catch(e) {
        return e;
    }
}

module.exports.writeJSON = function (path, data) {
    return new Promise((resolve, reject) => {
        const buffer = new Uint8Array(Buffer.from(JSON.stringify(data, null, 2)));

        fs.writeFile(path, buffer, err => {
            if (err) {
                reject('保存数据失败');
                return;
            }
            resolve('保存数据成功');
        });
    });
}
