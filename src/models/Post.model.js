const mongoose = require("mongoose");
const commentSchema = require("@/src/models/Comment.model");

const postSchema = new mongoose.Schema(
    {
        author: {
            id: {
                type: String,
                required: true,
                alias: "authoe_id",
            },
            name: {
                type: String,
                required: [true, "name is required, received {VALUE}"],
                minLength: [3, "name length must be greater than or equal to 3, received {VALUE}"],
                maxength: [20, "name length must be less than or equal to 20, received {VALUE}"],
                alias: "author_name",
            },
            handle: {
                type: String,
                required: [true, "handle is required, received {VALUE}"],
                minLength: [3, "handle length must be greater than or equal to 3, received {VALUE}"],
                maxength: [20, "handle length must be less than or equal to 20, received {VALUE}"],
                alias: "author_handle",
            },
        },
        description: {
            type: String,
            required: [true, "description is required, received {VALUE}"],
            maxLength: [500, "description length must be less than or equal to 500, received {VALUE}"],
        },
        date: {
            type: Date,
            default: Date.now,
        },
        likes: {
            type: Array,
            default: [],
        },
        img: {
            type: String,
            default: "",
        },
        comments: {
            type: [commentSchema],
        },
    },
    {
        collection: "postCollection",
        autoIndex: true,
        optimisticConcurrency: true,
        bufferTimeoutMS: 10000,
        timestamps: true,
    }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
