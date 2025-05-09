const { Schema, model } = require('mongoose')

const reviewSchema = new Schema({
    comment: String,
    trend: {
        type: Schema.ObjectId,
        ref: "Trend"
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const ratingSchema = new Schema({
    rating: String,
    trend: {
        type: Schema.ObjectId,
        ref: "Trend"
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const suggestSchema = new Schema({
    trend: {
        type: Schema.ObjectId,
        ref: "Trend"
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const resultsSearchSchema = new Schema({
    place: {
        type: Schema.ObjectId,
        ref: "Place"
    },
})

const searchSchema = new Schema({
    query: String,
    results: resultsSearchSchema
})

const photoSchema = new Schema({
    filename: String,
    path: String
})

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    photo: photoSchema,
    phone: Number,
    ratings: [ratingSchema],
    reviews: [reviewSchema],
    suggests: [suggestSchema],
    searchs: [searchSchema],
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = model('User', userSchema, 'users')