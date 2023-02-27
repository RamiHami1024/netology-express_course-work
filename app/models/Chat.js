const {Schema, model} = require('mongoose');

const ChatSchema = new Schema({
    users: {
        type: [Schema.Types.ObjectId],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    messages: [{
        type: Schema.Types.ObjectId, 
        ref: 'Message'
    }]
});

module.exports = model('Chat', ChatSchema);