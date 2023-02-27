const Chat = require('../models/Chat');
const Message = require('../models/Message');

exports.ChatModule = {
    find: async function(users) {
        try {
            return await Chat.find({users});
        } catch (error) {
            console.log(error);
            throw Error(error);
        }
    },
    sendMessage: async function(author, receiver, text) {
        const users = [author, receiver];

        try {   
            let chat = await Chat.findOne({users});
            const message = new Message({author, text});
        
            if (!chat) {
                chat = new Chat({users, messages: [message._id]});
            } 
            console.log('\n', chat, '\n')
            chat.messages.push(message._id);
            await message.save();
            await chat.save();

            return {
                chatId: chat._id,
                message: message
            };
        } catch (error) {
            console.log(error);
            throw Error(error);
        }
    },
    subscribe: async function(id, callback) {
        const chat = await Chat.findById(id);

        callback(chat);
    },
    getHistory: async function(id) {
        try {
            const chatHistory = await Chat
                .findOne({_id: id});

            return chatHistory.messages;
        } catch (error) {
            console.log(error);
            throw Error(error);
        }
    }
}