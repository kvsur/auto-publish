// require('shelljs/global'); // 全局注入shell脚本执行包

// const { PACKAGE_DIR_ROOT } = require('../config/path.config');
// const AutoDeploy = require('./auto-deploy');
const Deploy = require('./deploy');

class Core {
    static autoDeploy() {
        // const watch_dir_children = PACKAGE_DIR_CHILDREN.map(child => PACKAGE_DIR_ROOT + child);

        // watch_dir_children.forEach(child_path => {
        //     const deploy = new AutoDeploy(child_path);
        //     deploy.start();
        // });
    }

    static deploy(deployConfig) {
        const deploy = new Deploy(deployConfig);
        deploy.start();
    }
}

module.exports = Core;
