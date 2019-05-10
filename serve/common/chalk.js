const chalk = require('chalk');
const chalkConfig = require('../config/chalk.config');

Object.keys(chalkConfig).forEach(key => {
    module.exports[key] = content => {
        console.log(chalk[chalkConfig[key]](content));
    }
});
