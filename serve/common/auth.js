const md5 = require('md5');

const User = require('../models/User');

module.exports = ({ account, password }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ account });
            password = md5(password.trim());
            if (user.password === password) {
                resolve(user);
            }
            reject('密码错误');
        } catch(err) {
            reject('账号不存在');
        }
    });
}
