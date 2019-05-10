const { success, error, warning } = require('../common/chalk');
const exec = require('child_process').exec;


exec('D:\\projects\\znkf-publish\\publish\\serve\\test\\test.sh', (err, stdout, stderr) => {
    if (err) {
        error(err);
    }
    if (stderr) {
        warning(stderr);
    } else {
        success(stdout);
    }
});