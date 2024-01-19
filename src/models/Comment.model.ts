import mongoose from "mongoose";

interface Author {
    id: string;
    name: string;
    handle: string;
}

export interface CommentDocument extends mongoose.Document {
    _doc: any;
    author: Author;
    description: string;
    date: Date;
    likes: string[];
    hidden: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const CommentSchema = new mongoose.Schema<CommentDocument>(
    {
        author: {
            id: {
                type: String,
                required: [true, "author_id is required, received {VALUE}"],
                alias: "author_id",
            },
            name: {
                type: String,
                required: [true, "auther_name is required, received {VALUE}"],
                minLength: [3, "auther_name length must be greater than or equal to 3, received {VALUE}"],
                maxLength: [20, "auther_name length must be less than or equal to 20, received {VALUE}"],
                alias: "author_name",
            },
            handle: {
                type: String,
                required: [true, "auther_handle is required, received {VALUE}"],
                minLength: [3, "auther_handle length must be greater than or equal to 3, received {VALUE}"],
                maxLength: [20, "auther_handle length must be less than or equal to 20, received {VALUE}"],
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
        hidden: {
            type: Boolean,
            default: false,
        },
    },
    {
        collection: "commentCollection",
        autoIndex: true,
        optimisticConcurrency: true,
        bufferTimeoutMS: 10000,
        timestamps: true,
    }
);

export default CommentSchema;
