const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    contactPhone: {
        type: String,
        required: false,
    }
});

UserSchema.set('autoIndex', true);

module.exports = model('User', UserSchema);