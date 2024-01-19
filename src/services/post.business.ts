import postData from "./post.data";
import hideSensitiveInfo from "@src/utils/hide-sensitive-info";
import { BusinessError, BusinessErrors, catchAsyncBusinessError } from "@src/utils/application-errors";
import type { IUser, IPost, IComment } from "@src/types";

const getAllPosts = catchAsyncBusinessError(async function () {
    const posts = await postData.getAllPostRecords();

    return posts.map((post) => {
        return hideSensitiveInfo(post, "comments", "updatedAt", "__v", "_id");
    });
});

const getPost = catchAsyncBusinessError(async function (postId: string) {
    const post = await postData.getPostRecordByID(postId);

    return hideSensitiveInfo(post, "updatedAt", "__v", "_id");
});

const addPost = catchAsyncBusinessError(async function (user: IUser, post: IPost) {
    post.author = {
        id: user.id,
        name: user.name,
        handle: user.handle,
    };
    const savedPost = await postData.createNewPostRecord(post);

    return hideSensitiveInfo(savedPost, "comments", "updatedAt", "__v", "_id");
});

const updatePost = catchAsyncBusinessError(async function (user: IUser, postId: string, updatedData: IPost) {
    const post = await postData.getPostRecordByID(postId);

    if (user.role !== "admin" && user.id !== post.author.id)
        throw new BusinessError(BusinessErrors.UNAUTHORIZED_ACCESS, "you can only update your own posts");

    const updatedPost = await postData.updatePostRecord(postId, updatedData);

    return hideSensitiveInfo(updatedPost, "comments", "updatedAt", "__v", "_id");
});

const deletePost = catchAsyncBusinessError(async function (user: IUser, postId: string) {
    const post = await postData.getPostRecordByID(postId);

    if (user.role !== "admin" && user.id !== post.author.id)
        throw new BusinessError(BusinessErrors.UNAUTHORIZED_ACCESS, "you can only delete your own posts");

    const response = await postData.deletePostRecord(postId);

    return response;
});

const getComments = catchAsyncBusinessError(async function (postId: string) {
    const post = await postData.getPostRecordByID(postId);

    return post.comments.map((comment) => {
        return hideSensitiveInfo(comment, "updatedAt", "__v", "_id");
    });
});

const addComment = catchAsyncBusinessError(async function (user: IUser, postId: string, comment: IComment) {
    comment.author = {
        id: user.id,
        name: user.name,
        handle: user.handle,
    };

    const updatedPost = await postData.addCommentRecord(postId, comment);

    return updatedPost.comments.map((comment) => {
        return hideSensitiveInfo(comment, "updatedAt", "__v", "_id");
    });
});

const updateComment = catchAsyncBusinessError(async function (
    user: IUser,
    postId: string,
    commentId: string,
    updatedData: IComment
) {
    const post = await postData.getPostRecordByID(postId);

    const comment = post.comments.find((comment) => comment.id === commentId);
    if (!comment) throw new BusinessError(BusinessErrors.ENTITY_NOT_FOUND, "comment not found.");

    if (user.role !== "admin" && user.id !== post.author.id)
        throw new BusinessError(BusinessErrors.UNAUTHORIZED_ACCESS, "you can only delete your own posts");

    const updatedPost = await postData.updateCommentRecord(postId, commentId, updatedData);

    return updatedPost.comments.map((comment) => {
        return hideSensitiveInfo(comment, "updatedAt", "__v", "_id");
    });
});

const deleteComment = catchAsyncBusinessError(async function (user: IUser, postId: string, commentId: string) {
    const post = await postData.getPostRecordByID(postId);

    const comment = post.comments.find((comment) => comment.id === commentId);
    if (!comment) throw new BusinessError(BusinessErrors.ENTITY_NOT_FOUND, "comment not found.");

    if (user.role !== "admin" && user.id !== post.author.id)
        throw new BusinessError(BusinessErrors.UNAUTHORIZED_ACCESS, "you can only delete your own posts");

    const response = await postData.deleteCommentRecord(postId, commentId);

    return response;
});

const likePost = catchAsyncBusinessError(async function (userId: string, postId: string) {
    const post = await postData.getPostRecordByID(postId);

    let response = null;

    if (!post.likes.includes(userId)) {
        response = postData.pushLikeIntoPostRecord(postId, userId);
    } else {
        response = postData.pullLikeFromPostRecord(postId, userId);
    }

    return response;
});

const likeComment = catchAsyncBusinessError(async function (userId: string, postId: string, commentId: string) {
    const post = await postData.getPostRecordByID(postId);

    const comment = post.comments.find((comment) => comment.id === commentId);
    if (!comment) throw new BusinessError(BusinessErrors.ENTITY_NOT_FOUND, "comment not found.");

    let response = null;

    if (!comment.likes.includes(userId)) {
        response = await postData.pushLikeIntoCommentRecord(postId, commentId, userId);
    } else {
        response = await postData.pullLikeFromCommentRecord(postId, commentId, userId);
    }

    return response;
});

const getTimelinePosts = catchAsyncBusinessError(async function (userId: string) {
    const userPosts = await postData.getAllPostRecordsByUser(userId);

    const followedPosts = await postData.getAllPostRecordsByUserFollowings(userId);

    const posts = [...userPosts, ...followedPosts];

    return posts.map((post) => {
        return hideSensitiveInfo(post, "comments", "updatedAt", "__v", "_id");
    });
});

const getPersonalPosts = catchAsyncBusinessError(async function (userId: string) {
    const posts = await postData.getAllPostRecordsByUser(userId);

    return posts.map((post) => {
        post.id = post._id.toString();
        return hideSensitiveInfo(post, "comments", "updatedAt", "__v", "_id");
    });
});

export default {
    getAllPosts,
    getPost,
    addPost,
    updatePost,
    deletePost,
    getComments,
    addComment,
    updateComment,
    deleteComment,
    likePost,
    likeComment,
    getTimelinePosts,
    getPersonalPosts,
};
