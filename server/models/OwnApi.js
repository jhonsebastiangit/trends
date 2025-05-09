const { Schema, model } = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");

const categorySchema = new Schema({
    id: Number,
    name: String,
    short_name: String,
    plural_name: String
});

const photoSchema = new Schema({
    url: String
});

const location = new Schema({
    address: String,
    country: String,
    cross_street: String,
    formatted_address: String,
    locality: String,
    region: String
})

const OwnApiSchema = new Schema({
    fsq_id: { type: String, unique: true, required: true },
    query: String,
    name: { type: String, required: true },
    rating: { type: Number, default: 0 },
    popularity: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    location: location,
    coordinates: {
        type: [Number],
        index: "2dsphere",
        required: true
    },
    categories: [categorySchema],
    photos: [photoSchema],
    createdAt: { type: Date, default: Date.now }
});
OwnApiSchema.plugin(mongoosePaginate);
module.exports = model('OwnApi', OwnApiSchema, 'ownapis');