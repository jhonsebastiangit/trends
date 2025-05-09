const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const queryHistorySchema = new Schema({
    query: String,
    coordinates: {
        type: [Number],
        index: "2dsphere",
        required: true
    },
    count: {
        type: Number, 
        default: 0
    },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now }
});
queryHistorySchema.plugin(mongoosePaginate);
module.exports = model("QueryHistory", queryHistorySchema, "queriesHistory");