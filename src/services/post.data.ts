import PostModel, { type PostDocument } from "@src/models/Post.model";
import UserModel from "@src/models/User.model";
import mongoose from "mongoose";
import { DataError, DataErrors, catchAsyncDataError, processMongoError } from "@src/utils/application-errors";
import type { IComment, IPost } from "@src/types";

const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

const getAllPostRecords = catchAsyncDataError(async function (): Promise<PostDocument[]> {
    let posts: PostDocument[] = [];
    try {
        posts = await PostModel.find();
    } catch (error) {
        processMongoError(error);
    }

    return posts.map((post) => ({
        ...post._doc,
        id: post._id.toString(),
    }));
});

const getAllPostRecordsByUser = catchAsyncDataError(async function (userId: string): Promise<PostDocument[]> {
    if (!isValidObjectId(userId)) throw new DataError(DataErrors.INVALID_ID, "invalid userId");

    let posts: PostDocument[] = [];
    try {
        posts = await PostModel.find({ "author.id": userId });
    } catch (error) {
        processMongoError(error);
    }

    return posts.map((post) => ({
        ...post._doc,
        id: post._id.toString(),
    }));
});

const getAllPostRecordsByUserFollowings = catchAsyncDataError(async function (userId: string): Promise<PostDocument[]> {
    if (!isValidObjectId(userId)) throw new DataError(DataErrors.INVALID_ID, "invalid userId");

    let posts: PostDocument[] = [];
    try {
        const user = await UserModel.findById(userId);
        posts = await PostModel.find({ "author.id": { $in: user?.followings } });
    } catch (error) {
        processMongoError(error);
    }

    return posts.map((post) => ({
        ...post._doc,
        id: post._id.toString(),
    }));
});

const getPostRecordByID = catchAsyncDataError(async function (postId: string): Promise<PostDocument> {
    if (!isValidObjectId(postId)) throw new DataError(DataErrors.INVALID_ID, "invalid postId");

    let post: PostDocument | null = null;

    try {
        post = await PostModel.findById(postId);
    } catch (error) {
        processMongoError(error);
    }
    if (!post) throw new DataError(DataErrors.DB_RECORD_NOT_FOUND, "post not found");

    return {
        ...post._doc,
        id: post._id.toString(),
        comments: post.comments.map((comment) => ({
            ...comment._doc,
            id: comment._id.toString(),
        })),
    };
});

const createNewPostRecord = catchAsyncDataError(async function (post: IPost): Promise<PostDocument> {
    const newPostInstance = await PostModel.create(post);
    let newPost: PostDocument;

    try {
        newPost = await newPostInstance.save();
    } catch (error) {
        processMongoError(error);
    }

    return {
        ...newPost._doc,
        id: newPost._id.toString(),
    };
});

const updatePostRecord = catchAsyncDataError(async function (
    postId: string,
    updatedData: IPost
): Promise<PostDocument> {
    if (!isValidObjectId(postId)) throw new DataError(DataErrors.INVALID_ID, "invalid postId");

    let updatedPost: PostDocument | null = null;
    try {
        updatedPost = await PostModel.findByIdAndUpdate(postId, { $set: { ...updatedData } }, { new: true });
    } catch (error) {
        processMongoError(error);
    }

    return {
        ...updatedPost?._doc,
        id: updatedPost?._id.toString(),
    };
});

const deletePostRecord = catchAsyncDataError(async function (postId: string): Promise<string> {
    if (!isValidObjectId(postId)) throw new DataError(DataErrors.INVALID_ID, "invalid postId");

    try {
        await PostModel.findByIdAndDelete(postId);
    } catch (error) {
        processMongoError(error);
    }

    return `post ${postId} deletion successful`;
});

const addCommentRecord = catchAsyncDataError(async function (postId: string, comment: IComment): Promise<PostDocument> {
    if (!isValidObjectId(postId)) throw new DataError(DataErrors.INVALID_ID, "invalid postId");

    let updatedPost: PostDocument | null = null;
    try {
        updatedPost = await PostModel.findByIdAndUpdate(postId, { $push: { comments: comment } }, { new: true });
    } catch (error) {
        processMongoError(error);
    }

    return {
        ...updatedPost?._doc,
        id: updatedPost?._id.toString(),
        comments: updatedPost?.comments.map((comment) => ({
            ...comment._doc,
            id: comment._id.toString(),
        })),
    };
});

const updateCommentRecord = catchAsyncDataError(async function (
    postId: string,
    commentId: string,
    updatedData: IComment
): Promise<PostDocument> {
    if (!isValidObjectId(postId)) throw new DataError(DataErrors.INVALID_ID, "invalid postId");

    let updatedPost: PostDocument | null = null;
    try {
        updatedPost = await PostModel.findByIdAndUpdate(
            postId,
            { $set: { "comments.$[comment].description": updatedData.description } },
            { arrayFilters: [{ "comment._id": commentId }], new: true }
        );
    } catch (error) {
        processMongoError(error);
    }

    return {
        ...updatedPost?._doc,
        id: updatedPost?._id.toString(),
        comments: updatedPost?.comments.map((comment) => ({
            ...comment._doc,
            id: comment._id.toString(),
        })),
    };
});

const deleteCommentRecord = catchAsyncDataError(async function (postId: string, commentId: string): Promise<string> {
    if (!isValidObjectId(postId)) throw new DataError(DataErrors.INVALID_ID, "invalid postId");

    try {
        await PostModel.findByIdAndUpdate(postId, { $pull: { comments: { _id: commentId } } }, { new: true });
    } catch (error) {
        processMongoError(error);
    }

    return `comment ${commentId} deletion successful`;
});

const pushLikeIntoPostRecord = catchAsyncDataError(async function (postId: string, userId: string): Promise<string> {
    if (!isValidObjectId(postId)) throw new DataError(DataErrors.INVALID_ID, "invalid postId");

    try {
        await PostModel.findByIdAndUpdate(postId, { $push: { likes: userId } });
    } catch (error) {
        processMongoError(error);
    }

    return `like added to post ${postId}`;
});

const pullLikeFromPostRecord = catchAsyncDataError(async function (postId: string, userId: string): Promise<string> {
    if (!isValidObjectId(postId)) throw new DataError(DataErrors.INVALID_ID, "invalid postId");

    try {
        await PostModel.findByIdAndUpdate(postId, { $pull: { likes: userId } });
    } catch (error) {
        processMongoError(error);
    }

    return `like removed from post ${postId}`;
});

const pushLikeIntoCommentRecord = catchAsyncDataError(async function (
    postId: string,
    commentId: string,
    userId: string
): Promise<string> {
    if (!isValidObjectId(postId)) throw new DataError(DataErrors.INVALID_ID, "invalid postId");

    try {
        await PostModel.findByIdAndUpdate(
            postId,
            { $push: { "comments.$[comment].likes": userId } },
            { arrayFilters: [{ "comment._id": commentId }] }
        );
    } catch (error) {
        processMongoError(error);
    }

    return `like added to comment ${commentId}`;
});

const pullLikeFromCommentRecord = catchAsyncDataError(async function (
    postId: string,
    commentId: string,
    userId: string
): Promise<string> {
    if (!isValidObjectId(postId)) throw new DataError(DataErrors.INVALID_ID, "invalid postId");

    try {
        await PostModel.findByIdAndUpdate(
            postId,
            { $pull: { "comments.$[comment].likes": userId } },
            { arrayFilters: [{ "comment._id": commentId }] }
        );
    } catch (error) {
        processMongoError(error);
    }

    return `like removed from comment ${commentId}`;
});

export default {
    getAllPostRecords,
    getAllPostRecordsByUser,
    getAllPostRecordsByUserFollowings,
    getPostRecordByID,
    createNewPostRecord,
    updatePostRecord,
    deletePostRecord,
    addCommentRecord,
    updateCommentRecord,
    deleteCommentRecord,
    pushLikeIntoPostRecord,
    pullLikeFromPostRecord,
    pushLikeIntoCommentRecord,
    pullLikeFromCommentRecord,
};
