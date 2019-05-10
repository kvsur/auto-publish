const fs = require('fs');
const request = require('request');

async function ddd() {
    try {
        const html = await fs.readFileSync('d:/projects/znkf-publish/serve/vsupdate.html');
        const version = html.toString().match(/<strong>Update[^(</strong>)]+<\/strong>/g)[0].match(/\d.+</g)[0].replace('<', '');

        const vscode_udpate_url = `https://vscode.cdn.azure.cn/stable/dea8705087adb1b5e5ae1d9123278e178656186a/VSCode-win32-x64-${version}.zip`;

        // await fs.unlinkSync('d:/vscodePackage/vscode.zip');

        request.get(vscode_udpate_url).on('error', error => {
            throw error;
        }).pipe(fs.createWriteStream('d:/vscodePackage/vscode.zip'));
    } catch (err) {
        console.log(err);
    }
}

ddd();