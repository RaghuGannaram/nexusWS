const Post = require("@/src/models/Post.model");
const User = require("@/src/models/User.model");
const hideSensitiveInfo = require("@/src/utils/hide-sensitive-info");
const CustomError = require("@/src/utils/custom-error");

const getAllPosts = async function () {
    const posts = await Post.find();

    return posts.map((post) => {
        post._doc.id = post._id.toString();
        return hideSensitiveInfo(post._doc, "comments", "updatedAt", "__v");
    });
};

const getPost = async function (postId) {
    const post = await Post.findById(postId);

    post._doc.id = post._id.toString();
    return hideSensitiveInfo(post._doc, "comments", "updatedAt", "__v");
};

const addPost = async function (user, post) {
    if (post.author.id !== user.id) throw new CustomError("Authorization Error", 403, "unauthorized", { message: "You are not authorized to perform this action" });

    const newPost = new Post(post);

    const savedPost = await newPost.save();

    savedPost._doc.id = savedPost._id.toString();
    return hideSensitiveInfo(savedPost._doc, "comments", "updatedAt", "__v");
};

const updatePost = async function (user, postId, updatedData) {
    const post = await Post.findById(postId);

    if (post.author.id !== user.id) throw new CustomError("Authorization Error", 403, "unauthorized", { message: "You are not authorized to perform this action" });

    const updatedPost = await post.updateOne({ $set: updatedData });

    updatedPost._doc.id = updatedPost._id.toString();
    return hideSensitiveInfo(updatedPost._doc, "comments", "updatedAt", "__v");
}

const deletePost = async function (user, postId) {
    const post = await Post.findById(postId);

    if (post.author.id !== user.id) throw new CustomError("Authorization Error", 403, "unauthorized", { message: "You are not authorized to perform this action" });

    await Post.deleteOne({ _id: post.id });

    return;
}

const getComments = async function (postId) {
    const post = await Post.findById(postId);

    const { comments } = post._doc;

    return comments;
};

const addComment = async function (user, postId, comment) {
    if(comment.author.id !== user.id) throw new CustomError("Authorization Error", 403, "unauthorized", { message: "You are not authorized to perform this action" });
    
    const post = await Post.findById(postId);

    const updatedPost = await post.updateOne({ $push: { comments: comment } });

    updatedPost._doc.id = updatedPost._id.toString();
    return hideSensitiveInfo(updatedPost._doc, "comments", "updatedAt", "__v");
}

const updateComment = async function (user, postId, commentId, updatedData) {
    const post = await Post.findById(postId);

    const comment = post.comments.find((comment) => comment.id === commentId);

    if (comment.id !== user.id) throw new CustomError("Authorization Error", 403, "unauthorized", { message: "You are not authorized to perform this action" });

    const updatedPost = await post.findOneAndUpdate({ "comments._id": commentId }, { $set: { "comments.$.comment": updatedData } });

    updatedPost._doc.id = updatedPost._id.toString();
    updatedPost.comments.map((comment) => {
        comment._doc.id = comment._id.toString();
        return hideSensitiveInfo(comment._doc, "updatedAt", "__v");
    });
}

const deleteComment = async function (user, postId, commentId) {
    const post = await Post.findById(postId);
    const comment = post.comments.find((comment) => comment.id === commentId);
    if (comment.id !== user.id) throw new CustomError("Authorization Error", 403, "unauthorized", { message: "You are not authorized to perform this action" });

    const updatedPost = await post.updateOne({ $pull: { comments: { _id: commentId } } });

    return updatedPost;
}

const likePost = async function (postId, userId) {
    const post = await Post.findById(postId);

    if (!post.likes.includes(userId)) {
        await post.updateOne({ $push: { likes: userId } });
    } else {
        await post.updateOne({ $pull: { likes: userId } });
    }

    return post;
}

const likeComment = async function (postId, commentId, userId) {
    let liked = false;
    const post = await Post.findById(postId);

    post?.comments?.map((comment) => {
        if (comment.id === commentId) {
            if (Object.values(comment?.likes).includes(userId)) {
                liked = true;
            }
        }
    });

    if (!liked) {
        await Post.findOneAndUpdate({ _id: postId }, { $push: { "comments.$[comment].likes": userId } }, { arrayFilters: [{ "comment._id": commentId }] });
    } else {
        await Post.findOneAndUpdate({ _id: postId }, { $pull: { "comments.$[comment].likes": userId } }, { arrayFilters: [{ "comment._id": commentId }] });
    }
}

const getTimelinePosts = async function (userId) {
    const user = await User.findById(userId);

    const userPosts = await Post.find({ "author.id": user.id });
    const friendPosts = await Promise.all(
        user?.followings?.map((friendId) => {
            return Post.find({ "author.id": friendId });
        })
    );

    const posts = [...userPosts, ...friendPosts];

    return hideSensitiveInfo(posts._doc, "comments", "updatedAt", "__v");
};

const getPersonalPosts = async function (userId) {
    const posts = await Post.find({ "author.id": userId });

    return hideSensitiveInfo(posts._doc, "comments", "updatedAt", "__v");
};

module.exports = {
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
