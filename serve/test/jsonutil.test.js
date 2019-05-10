const path = require('path');

const { writeJSON, readJSON, readJSONSync } = require('../common/JSONUtil');
const { error, success } = require('../common/chalk');
const dataPath = path.resolve(__dirname, '../db/data/doc.index.json');
// const data = [
//     {
//         projectName: 'mgmt',
//         packageWhere: 'znkf2b_hcs',
//         dist: 'mgmt',
//         brokers: [
//             {
//                 brokerKey: 'common',
//                 brokerName: '公版',
//             }
//         ],
//     },
//     {
//         projectName: 'webapp',
//         packageWhere: 'znkf2b_webapp',
//         dist: 'webapp',
//         brokers: [
//             {
//                 brokerKey: 'rebuild',
//                 brokerName: '公版',
//             },
//             {
//                 brokerKey: 'jintou',
//                 brokerName: '金投',
//             }
//         ],
//     },
// ];

const data = [
    {
        docName: 'messageCenter',
        docKey: 'messageCenter',
        createTime: '2018-11-13 16:10:44',
        author: 'licheng',
        lastUpdateTime: '2018-11-13 16:10:44',
    }
];

writeJSON(dataPath, data).then(res => {
    console.log(success(res));
}).catch(res => {
    console.log(error(res));
}).finally(() => {
    console.log((readJSONSync(dataPath)));

    readJSON(dataPath).then(res => {
        console.log(res);
    }).catch(e => {
        console.log(e);
    });
});

