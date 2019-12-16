const path = require('path')
module.exports = {
    entry: {
        index: path.resolve(__dirname, 'src/index.js'),
        vendor: [
            'react',
            'react-dom',
            'react-router',
            'moment',
            '@babel/polyfill',
            'dva',
            // 'antd',
            'yt-simplemde-editor'
        ],
    },
    commons: [
        {
            names: ['vendor'], // 这里我们配置了 vendor chunk 名称
        },
        {
            name: 'manifest', // 为了避免工具 chunk 文件 hash 重新生成，毕竟我们是要对这种不常修改的文件做缓存的
            chunks: ['vendor',]
        },
    ],
    "hash": true,
    "html": {
        "template": "./src/document.ejs"
    },
    "extraBabelPlugins": [
        ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }]
    ],
    "proxy": {
        "/api": {
            "target": "http://127.0.0.1:1024/",
            "changeOrigin": true,
            "pathRewrite": { "^/api" : "/api" }
        },
        "/deploy_socket": {
            "target": "http://127.0.0.1:7321",
            "ws": true,
            "secure": false,
            "logLevel": "debug"
        }
    }
}
