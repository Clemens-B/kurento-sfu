const io = require('socket.io');
const kurentoClient = require('kurento-client');
const User = require('./userService');

module.exports = class RoomService {
    constructor(server, kmsUri) {
        this.kurento = kurentoClient(kmsUri);
        this.Ice = kurentoClient.getComplexType('IceCandidate');
        io(server).on('connection', socket => new User(socket, this));
        console.log("Roomservice OK!");
        this.rooms = {};
        this.newRoom('test');
    }

    // create pipeline for room
    newRoom(roomName) {
        this.kurento.create('MediaPipeline', (error, pipeline) => {
            if (error) {
                console.log(error);
            }
            let room = {
                name: roomName,
                pipeline: pipeline,
                users: {}
            };
            this.rooms[roomName] = room;
            console.log('New Room: ' + JSON.stringify(room));
        });
    }

    addUserToRoom(roomName, userId, user) {
        this.rooms[roomName].users[userId] = user;
    }

    getUsersOfRoom(roomName) {
        return this.rooms[roomName].users || null;
    }

    getRoom(roomName) {
        return this.rooms[roomName] || null;
    }

    getAllRooms() {
        return this.rooms;
    }

}

