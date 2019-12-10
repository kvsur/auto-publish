const mongo = require('mongoose');
const Log = require('../models/Log');

mongo.connect('mongodb://10.10.80.224:27017/ZNKF_PUBLISH', { useNewUrlParser: true });

const db = mongo.connection;

db.on('connected', async () => {
    console.log('Mongo connection is ok .....');
    try {
        const logs = await Log.find({});
        for (let log of logs) {
            const { _id, deployTime } = log;
            await Log.findByIdAndUpdate(_id, { date: (new Date(deployTime.toString())).getTime() });
        }
    } catch (e) {
        console.log(e);
    }
    finally {
        process.exit(1)
    }
});

db.on('error', (e) => {
    console.log(0);
    console.log(e);
});