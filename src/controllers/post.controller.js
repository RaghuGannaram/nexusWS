const postService = require("@/src/services/post.service");
const { postSchema, commentSchema } = require("@/src/schemas/post.schema");
const catchAsyncError = require("@/src/middlewares/catch-async-error.middleware");
const CustomError = require("@/src/utils/custom-error");

const getAllPosts = catchAsyncError(async (req, res) => {
    const posts = await postService.getAllPosts();

    res.status(200).json({ posts: posts });
});

const getPost = catchAsyncError(async (req, res) => {
    const { postId } = req.params;
    if (!postId) throw new CustomError("Bad Request", 400, "VALIDATION_ERROR", "postId not provided.");

    const post = await postService.getPost(postId);

    res.status(200).json({ post: post });
});

const addPost = catchAsyncError(async (req, res) => {
    const data = await postSchema.validateAsync(req.body);

    const user = req.user;
    const post = await postService.addPost(user, data);

    res.status(200).json({ post: post });
});

const updatePost = catchAsyncError(async (req, res) => {
    const { postId } = req.params;
    if (!postId) throw new CustomError("Bad Request", 400, "VALIDATION_ERROR", "postId not provided.");

    const user = req.user;
    const data = await postSchema.validateAsync(req.body);

    const updatedPost = await postService.updatePost(user, postId, data);

    res.status(200).json({ post: updatedPost });
});

const deletePost = catchAsyncError(async (req, res) => {
    const { postId } = req.params;
    if (!postId) throw new CustomError("Bad Request", 400, "VALIDATION_ERROR", "postId not provided.");

    const user = req.user;
    const response = await postService.deletePost(user, postId);

    res.status(200).json({ message: response });
});

const getComments = catchAsyncError(async (req, res) => {
    const { postId } = req.params;
    if (!postId) throw new CustomError("Bad Request", 400, "VALIDATION_ERROR", "postId not provided.");

    const comments = await postService.getComments(postId);

    res.status(200).json({ comments: comments });
});

const addComment = catchAsyncError(async (req, res) => {
    const { postId } = req.params;
    if (!postId) throw new CustomError("Bad Request", 400, "VALIDATION_ERROR", "postId not provided.");

    const user = req.user;
    const data = await commentSchema.validateAsync(req.body);
    const comments = await postService.addComment(user, postId, data);

    res.status(200).json({ comments: comments });
});

const updateComment = catchAsyncError(async (req, res) => {
    const { postId, commentId } = req.params;
    if (!postId || !commentId) throw new CustomError("Bad Request", 400, "VALIDATION_ERROR", "postId not provided.");

    const user = req.user;
    const data = await commentSchema.validateAsync(req.body);

    const comments = await postService.updateComment(user, postId, commentId, data);

    res.status(200).json({ comments: comments });
});

const deleteComment = catchAsyncError(async (req, res) => {
    const { postId, commentId } = req.params;
    if (!postId || !commentId) throw new CustomError("Bad Request", 400, "VALIDATION_ERROR", "postId not provided.");

    const user = req.user;
    const comments = await postService.deleteComment(user, postId, commentId);

    res.status(200).json({ comments: comments });
});

const likePost = catchAsyncError(async (req, res) => {
    const { postId } = req.params;
    if (!postId) throw new CustomError("Bad Request", 400, "VALIDATION_ERROR", "postId not provided.");

    const user = req.user;
    const response = await postService.likePost(user.id, postId);

    res.status(200).json({ message: response });
});

const likeComment = catchAsyncError(async (req, res) => {
    const { postId, commentId } = req.params;
    if (!postId || !commentId) throw new CustomError("Bad Request", 400, "VALIDATION_ERROR", "postId or commentId not provided.");

    const user = req.user;
    const response = await postService.likeComment(user.id, postId, commentId);

    res.status(200).json({ message: response });
});

const getTimelinePosts = catchAsyncError(async (req, res) => {
    const user = req.user;

    const posts = await postService.getTimelinePosts(user.id);

    res.status(200).json({ posts: posts });
});

const getPersonalPosts = catchAsyncError(async (req, res) => {
    const { userId } = req.params;
    if (!userId) throw new CustomError("Bad Request", 400, "VALIDATION_ERROR", "userId not provided.");

    const posts = await postService.getPersonalPosts(userId);

    res.status(200).json({ posts: posts });
});


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
