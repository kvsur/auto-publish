const mongo = require('mongoose');

// const UserSchema = new mongo.Schema({
//     email: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     name: {
//         type: String,
//         required: true,
//         trim: true,
//     },
// });

// const User = mongo.model('User', UserSchema);
const User = require('../models/User');

mongo.connect('mongodb://licheng:hello1024@ds119476.mlab.com:19476/znkf_publish', {useNewUrlParser: true});

const db = mongo.connection;

db.on('connected', async () => {
    console.log(1);
    const user = new User({
        account: 'hello1024lc@mail.com',
        name: 'licheng',
    });
    try {
        await user.save();
    } catch(e) {
        console.log(e);
    }
    finally {
        db.close();
    }

    process.exit(1);

});

db.on('error', (e) => {
    console.log(0);
    console.log(e);
});

