import mongoose from "mongoose";
import CommentSchema, { type CommentDocument } from "@src/models/Comment.model";

interface Author {
    id: string;
    name: string;
    handle: string;
}

export interface PostDocument extends mongoose.Document {
    _doc: any;
    author: Author;
    description: string;
    date: Date;
    likes: string[];
    img: string;
    comments: CommentDocument[];
    createdAt: Date;
    updatedAt: Date;
}

const postSchema = new mongoose.Schema<PostDocument>(
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
                maxLength: [20, "name length must be less than or equal to 20, received {VALUE}"],
                alias: "author_name",
            },
            handle: {
                type: String,
                required: [true, "handle is required, received {VALUE}"],
                minLength: [3, "handle length must be greater than or equal to 3, received {VALUE}"],
                maxLength: [20, "handle length must be less than or equal to 20, received {VALUE}"],
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
            type: [CommentSchema],
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

const PostModel = mongoose.model<PostDocument>("Post", postSchema);

export default PostModel;
