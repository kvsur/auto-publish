module.exports = {
    uri: process.env.DB_URI || 'mongodb://hello:hello1024@ds119476.mlab.com:19476/znkf_publish',
    useNewUrlParser: process.env.USE_NEW_URL_PARSER || true,
}