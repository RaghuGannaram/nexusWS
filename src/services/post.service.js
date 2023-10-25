const Post = require("@/src/models/Post.model");
const User = require("@/src/models/User.model");
const hideSensitiveInfo = require("@/src/utils/hide-sensitive-info");
const CustomError = require("@/src/utils/custom-error");

const getAllPosts = async function () {
    const posts = await Post.find();

    return posts.map((post) => {
        post._doc.id = post._id.toString();
        return hideSensitiveInfo(post._doc, "comments", "createdAt", "updatedAt", "__v", "_id");
    });
};

const getPost = async function (postId) {
    const post = await Post.findById(postId);

    post._doc.id = post._id.toString();
    post._doc.comments = post.comments.map((comment) => {
        comment._doc.id = comment._id.toString();
        return hideSensitiveInfo(comment._doc, "createdAt", "updatedAt", "__v", "_id");
    });
    return hideSensitiveInfo(post._doc, "createdAt", "updatedAt", "__v", "_id");
};

const addPost = async function (user, post) {
    post.author = {
        id: user.id,
        name: user.name,
        handle: user.handle,
    };
    const newPost = new Post(post);

    const savedPost = await newPost.save();

    return savedPost;
    savedPost._doc.id = savedPost._id.toString();
    return hideSensitiveInfo(savedPost._doc, "comments", "createdAt", "updatedAt", "__v", "_id");
};

const updatePost = async function (user, postId, updatedData) {
    const post = await Post.findById(postId);
    if (!post) throw new CustomError("Not Found", 404, "NOT_FOUND_ERROR", "Post not found.");

    if (user.role !== "admin" && user.id !== post.author.id) throw new CustomError("Forbidden", 403, "AUTHORIZATION_ERROR", "You are not authorized to perform this action.");

    const updatedPost = await Post.findByIdAndUpdate(postId, { $set: { ...updatedData } }, { new: true });

    updatedPost._doc.id = updatedPost._id.toString();
    return hideSensitiveInfo(updatedPost._doc, "comments", "createdAt", "updatedAt", "__v", "_id");
}

const deletePost = async function (user, postId) {
    const post = await Post.findById(postId);

    if (!post) throw new CustomError("Not Found", 404, "NOT_FOUND_ERROR", "Post not found.");

    if (user.role !== "admin" && user.id !== post.author.id) throw new CustomError("Forbidden", 403, "AUTHORIZATION_ERROR", "You are not authorized to perform this action.");

    await await Post.deleteOne({ _id: postId });

    return `Deleted post ${postId}`;
}

const getComments = async function (postId) {
    const post = await Post.findById(postId);

    const { comments } = post._doc;
    return comments.map((comment) => {
        comment._doc.id = comment._id.toString();
        return hideSensitiveInfo(comment._doc, "createdAt", "updatedAt", "__v", "_id");
    });
};

const addComment = async function (user, postId, comment) {
    const post = await Post.findById(postId);
    if (!post) throw new CustomError("Not Found", 404, "NOT_FOUND_ERROR", "Post not found.");

    comment.author = {
        id: user.id,
        name: user.name,
        handle: user.handle,
    };
    const updatedPost = await Post.findByIdAndUpdate(postId, { $push: { comments: comment } }, { new: true });

    const { comments } = updatedPost._doc;
    return comments.map((comment) => {
        comment._doc.id = comment._id.toString();
        return hideSensitiveInfo(comment._doc, "createdAt", "updatedAt", "__v", "_id");
    });
}

const updateComment = async function (user, postId, commentId, updatedData) {
    const post = await Post.findById(postId);
    if (!post) throw new CustomError("Not Found", 404, "NOT_FOUND_ERROR", "Post not found.");

    const comment = post.comments.find((comment) => comment.id === commentId);
    if (!comment) throw new CustomError("Not Found", 404, "NOT_FOUND_ERROR", "Comment not found.");

    if (user.role !== "admin" && user.id !== comment.author.id) throw new CustomError("Forbidden", 403, "AUTHORIZATION_ERROR", "You are not authorized to perform this action.");

    const updatedPost = await Post.findByIdAndUpdate(postId, { $set: { "comments.$[comment].description": updatedData.description } }, { arrayFilters: [{ "comment._id": commentId }], new: true });

    const { comments } = updatedPost._doc;
    return comments.map((comment) => {
        comment._doc.id = comment._id.toString();
        return hideSensitiveInfo(comment._doc, "createdAt", "updatedAt", "__v", "_id");
    });
}

const deleteComment = async function (user, postId, commentId) {
    const post = await Post.findById(postId);
    if (!post) throw new CustomError("Not Found", 404, "NOT_FOUND_ERROR", "Post not found.");

    const comment = post.comments.find((comment) => comment.id === commentId);
    if (!comment) throw new CustomError("Not Found", 404, "NOT_FOUND_ERROR", "Comment not found.");

    if (user.role !== "admin" && user.id !== comment.author.id) throw new CustomError("Forbidden", 403, "AUTHORIZATION_ERROR", "You are not authorized to perform this action.");

    const updatedPost = await Post.findByIdAndUpdate(postId, { $pull: { comments: { _id: commentId } } }, { new: true });

    const { comments } = updatedPost._doc;
    return comments.map((comment) => {
        comment._doc.id = comment._id.toString();
        return hideSensitiveInfo(comment._doc, "createdAt", "updatedAt", "__v", "_id");
    });
}

const likePost = async function (userId, postId) {
    const post = await Post.findById(postId);
    if(!post) throw new CustomError("Not Found", 404, "NOT_FOUND_ERROR", "Post not found.");

    if (!post.likes.includes(userId)) {
        await post.updateOne({ $push: { likes: userId } });
        return `Liked post ${postId}`;
    } else {
        await post.updateOne({ $pull: { likes: userId } });
        return `Unliked post ${postId}`;
    }

}

const likeComment = async function (userId, postId, commentId) {
    const post = await Post.findById(postId);

    if(!post) throw new CustomError("Not Found", 404, "NOT_FOUND_ERROR", "Post not found.");

    const comment = post.comments.find((comment) => comment.id === commentId);
    if(!comment) throw new CustomError("Not Found", 404, "NOT_FOUND_ERROR", "Comment not found.");

    if (!comment.likes.includes(userId)) {
        await Post.findOneAndUpdate({ _id: postId }, { $push: { "comments.$[comment].likes": userId } }, { arrayFilters: [{ "comment._id": commentId }] });
        return `Liked comment ${commentId}`;
    } else {
        await Post.findOneAndUpdate({ _id: postId }, { $pull: { "comments.$[comment].likes": userId } }, { arrayFilters: [{ "comment._id": commentId }] });
        return `Unliked comment ${commentId}`;
    }

}

const getTimelinePosts = async function (userId) {
    const user = await User.findById(userId);

    const userPosts = await Post.find({ "author.id": userId });
    const followedPosts = await Promise.all(
        user.followings?.map((followedId) => {
            return Post.find({ "author.id": followedId });
        })
    );

    const posts = [...userPosts, ...followedPosts];

    return posts.map((post) => {
        post._doc.id = post._id.toString();
        return hideSensitiveInfo(post._doc, "comments", "createdAt", "updatedAt", "__v", "_id");
    });
};

const getPersonalPosts = async function (userId) {
    const posts = await Post.find({ "author.id": userId });

    return posts.map((post) => {
        post._doc.id = post._id.toString();
        return hideSensitiveInfo(post._doc, "comments", "createdAt", "updatedAt", "__v", "_id");
    });
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
