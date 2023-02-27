const {ChatModule} = require('../modules/chat');
const mongoose = require('mongoose');

function toObject(id) {
    return mongoose.Types.ObjectId(id);
}

exports.socketHandler = (socket) => {
    socket.on('getHistory', async (id) => {
        const messages = await ChatModule.getHistory(id);
        socket.emit('chatHistory', messages);
    });

    socket.on('sendMessage', async (data) => {
        const {author, receiver, text} = data;
        const newChat = await ChatModule.sendMessage(toObject(author), toObject(receiver), text);

        socket.emit('newMessage', newChat);
    });

    socket.on('subscribe', (id) => {
        ChatModule.subscribe(id, (chat) => {
            const id = chat._id.toString()

            socket.on('newMessage_' + id, (msg) => {
                socket.broadcast.emit('newMessage_' + id, msg);
            })
        })
    });
}
