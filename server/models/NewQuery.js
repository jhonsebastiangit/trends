const { Schema, model } = require("mongoose");

const newQuerySchema = new Schema({
    query: String,
    coordinates: {
        type: [Number],
        index: "2dsphere",
        required: true
    },
    createdAt: { type: Date, default: Date.now }
});

newQuerySchema.index({ coordinates: '2dsphere' });

module.exports = model("NewQuery", newQuerySchema, "newQueries");