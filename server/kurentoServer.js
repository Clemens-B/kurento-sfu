const fs = require('fs');
const https = require('https');
const RoomService = require('./roomService');
const config = require('../config/config.json');

module.exports = (app) => {

    const port = config.server.port;
    const uri = `${config.server.uri}:${port}`;
    const opts = {
        key: fs.readFileSync(__dirname + config.secure.key),
        cert: fs.readFileSync(__dirname + config.secure.cert)
    };
    const server = https.createServer(opts, app).listen(port, (err) =>
        console.log(err || `Listening at ${uri}`)
    );
    const roomService = new RoomService(server, config.kmsUri);

    return { uri };
}