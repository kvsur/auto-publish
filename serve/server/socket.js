const Server = require('ws').Server;

const SERVER_PORT = 9527;

const instances = {};

class SocketServer {
    static startSokcetServer() {
        console.log('---Start socket server action---')
        const server  = new Server({
            port: SERVER_PORT
        });
        try {
            server.on('connection', instance => {
                instance.send(JSON.stringify({messageType: 'connect-response', data: null}));
                instance.on('message', msgString => {
                    const msg = JSON.parse(msgString);
                    const { id, messageType, data } = msg;
                    console.log({ id, messageType, data })
                    if (messageType === 'login') {
                        instances[id] = instance;
                    } else if(messageType === 'logout') {
                        instances[id] = null;
                        /** eslint-disable */
                        delete instances[id];
                    }
                });

                instance.on('error', e => {
                    throw e;
                })
            });
        } catch (e) {
            console.log(e);
        }
    }

    static sendMessage(id, messageType, data) {
        try {
           if (instances[id]) {
            instances[id].send(JSON.stringify({
                    messageType,
                    data
                }))
           }
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = SocketServer;
