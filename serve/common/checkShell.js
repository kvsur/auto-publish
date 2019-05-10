module.exports = shell => {
    const dangerCMD = [
        /rm/,
        /chown/,
        /chmod/,
        /\>/,
        /:\(\) \{ :\|:& \};:/,
        /dd/,
        /drop/,
        /mv \/[^(\/var\/www\/html.)]\/\* \/dev\/null/,
        //,
        //,
    ];
}