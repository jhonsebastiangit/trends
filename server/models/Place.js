const { Schema, model } = require('mongoose');

const reviewSchema = new Schema({
    comment: String,
    userComment: {
        type: Schema.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const photosSchema = new Schema({
    path: String,
    filename: String,
    size: Number,
    uploadedAt: { 
        type: Date, 
        default: Date.now
    }
});

const suggestSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const specialProductsSchema = new Schema({
    comment: String,
    name: String,
    price: Number,
    rating: Number,
    active: {
        type: Boolean,
        default: true
    },
    photos: [photosSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const placeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    phone: Number,
    email: String,
    address: { type: String, default: '' },
    coordinates: {
        type: [Number],
        index: "2dsphere",
        required: true
    },
    photos: [photosSchema],
    rating: {
        type: Number,
        default: 0
    },
    reviews: [reviewSchema],
    suggests: [suggestSchema],
    specialProducts: [specialProductsSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Exportar modelo
module.exports = model('Place', placeSchema, 'places');