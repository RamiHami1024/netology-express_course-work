const {Schema, model} = require('mongoose');

const AdvertisementSchema = new Schema({
    shortText: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    images: {
        type: [String],
        required: false,
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
        default: Date.now
    },
    tags: {
        type: [String],
        required: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
});

module.exports = model('Advertisement', AdvertisementSchema);