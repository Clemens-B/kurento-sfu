var socket = io.connect();
socket.emit('joinRoom', 'test');
socket.on('message', (message) => {
    switch (message.id) {
    case 'iceCandidate':
            console.log("iceCandidate from : " + message.sessionId);
            //add the iceCanditate to every user message.canditate
    }

})