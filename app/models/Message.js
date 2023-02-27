const {Schema, model} = require('mongoose');

const MessageSchema = new Schema({
    author: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    sentAt: {
        type: Date,
        default: Date.now
    },
    text: {
        type: String,
        required: true
    },
    readAt: {
        type: Date
    }
})

module.exports = model('Message', MessageSchema);