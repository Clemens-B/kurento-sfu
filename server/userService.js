const CircularJSON = require('circular-json');

module.exports = class User {
    constructor(socket, roomService) {
        this.socket = socket;
        this.id = socket.id;
        this.roomService = roomService;
        this.currentRoom = null;
        this.endpoint = null;

        socket
            .emit('id', { id: this.id })
            .on('error', () => this.socketError())
            .on('joinRoom', roomName => this.joinRoom(roomName))
            .on('receiveVideoFrom', sender => this.receiveVideoFrom(sender));
        console.log(`New User : ${this.id}`);
    }

    joinRoom(roomName) {
        console.log(`${this.id} > wants to join room ${roomName}`);
        this.currentRoom = this.roomService.getRoom(roomName);

        // create an WebRtcEndpoint on the room media pipeline
        this.currentRoom.pipeline.create('WebRtcEndpoint', (error, endpoint) => {
            if (error) {
                console.error('Error creating endpoint', error);
                this.currentRoom.pipline.release();
            }
            endpoint.setMaxVideoSendBandwidth(30);
            endpoint.setMinVideoSendBandwidth(20);
            this.endpoint = endpoint;
            console.log("Endpoint created");

            //add ice canditate to every user in the room
            const roomUsers = this.roomService.getUsersOfRoom(roomName);

            if (roomUsers.length > 0) {
                console.log(roomUsers);
                roomUsers.forEach(() => {
                    var message = roomUsers.shift();
                    console.error('user : ' + this.id + ' collecting candidates for outgoing media');
                    this.endpoint.addIceCandidate(message.candidate);
                })
            }

            this.endpoint.on('OnIceCandidate', ({ candidate }) => {
                sendSocketMessageToUsers({
                    id: 'iceCandidate',
                    sessionId: pid,
                    candidate: this.Ice(candidate)
                });
            });

            this.roomService.addUserToRoom(roomName, this.id, this);

        })

    }

    receiveVideoFrom({senderId, sdpOffer}) {
        const sender = this.roomManager.getParticipantById(senderId);
        const room = this.roomManager.getRoom(this.roomName);

        (this.getSubscriber(senderId) || this.newSubscriberEndpoint(sender, room.pipeline))
            .then(endpoint => this.connectToRemoteParticipant(endpoint, sender, sdpOffer));
    }

    // TODO: release socket + delete user from room
    socketError() {
        console.log("Error connecting user to room" + this.roomName)
    }

    sendSocketMessageToUsers(data) {
        this.socket.emit(data);
    }

}