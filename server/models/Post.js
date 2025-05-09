const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Comment = new Schema({
    description: String,
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    created_at: String,
})

const Media = new Schema({
    type: String,
    path: String,
    filename: String,
    size: Number,
    description: String,
    uploadedAt: { 
        type: Date, 
        default: Date.now
    }
})

const postSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    placeId: {
        type: Schema.ObjectId,
        ref: "Place"
    },
    comment: String,
    comments: [Comment],
    likes: [
        { 
            type: Schema.Types.ObjectId, ref: 'User',
            createdAt: { type: Date, default: Date.now }
        }
    ],
    media: [Media],
    createdAt: { type: Date, default: Date.now }
});

postSchema.plugin(mongoosePaginate);
module.exports = model("Post", postSchema, "posts");