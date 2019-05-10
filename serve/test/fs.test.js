const fs = require('fs');

const file = fs.createWriteStream('d:/fuckyou.txt');
file.write('fuck you hello world');

file.on('finish', () => {
    console.log('over');
})

file.end();
// (async function ddd () {
//     try {
//         const sh = await fs.readFileSync('d:/update.sh');
//         console.log(sh.toString());
//     } catch (err) {
//         console.log(err);
//     }
// })();