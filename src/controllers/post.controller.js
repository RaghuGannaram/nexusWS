const postService = require("@/src/services/post.service");
// const { postSchema, optionalPostSchema, commentSchema, optionalCommentSchema } = require("@/src/schemas/post.schema");
const catchAsyncError = require("@/src/middlewares/catch-async-error.middleware");
const CustomError = require("@/src/utils/custom-error");

const getAllPosts = catchAsyncError(async (req, res) => {
    const posts = await postService.getAllPosts();

    res.status(200).json({ posts: posts });
});

const getPost = catchAsyncError(async (req, res) => {
    const { postId } = req.params;
    if (!postId) throw new CustomError("Validation Error", 400, "invalid_field", { message: "Bad Request" });

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
    if (!postId) throw new CustomError("Validation Error", 400, "invalid_field", { message: "Bad Request" });

    const user = req.user;
    const data = optionalPostSchema.validateAsync(req.body);

    const updatedPost = postService.updatePost(user, postId, data);

    res.status(200).json({ post: updatedPost });
});

const deletePost = catchAsyncError(async (req, res) => {
    const { postId } = req.params;
    if (!postId) throw new CustomError("Validation Error", 400, "invalid_field", { message: "Bad Request" });

    const user = req.user;
    await postService.deletePost(user, postId);

    res.status(200).json({ message: "Post deleted successfully..!" });
});

const getComments = catchAsyncError(async (req, res) => {
    const { postId } = req.params;
    if (!postId) throw new CustomError("Validation Error", 400, "invalid_field", { message: "Bad Request" });

    const comments = await postService.getComments(postId);

    res.status(200).json({ comments: comments });
});

const addComment = catchAsyncError(async (req, res) => {
    const { postId } = req.params;
    if (!postId) throw new CustomError("Validation Error", 400, "invalid_field", { message: "Bad Request" });

    const user = req.user;
    const data = await commentSchema.validateAsync(req.body);
    const updatedPost = postService.addComment(user, postId, data);

    res.status(200).json({ post: updatedPost });
});

const updateComment = catchAsyncError(async (req, res) => {
    const { postId, commentId } = req.params;
    if (!postId || !commentId) throw new CustomError("Validation Error", 400, "invalid_field", { message: "Bad Request" });

    const user = req.user;
    const data = await optionalCommentSchema.validateAsync(req.body);

    const updatedPost = postService.updateComment(user, postId, commentId, data);

    res.status(200).json({ post: updatedPost });
});

const deleteComment = catchAsyncError(async (req, res) => {
    const { postId } = req.params;
    if (!postId) throw new CustomError("Validation Error", 400, "invalid_field", { message: "Bad Request" });

    const updatedPost = postService.deleteComment(postId);

    res.status(200).json({ post: updatedPost });
});

const likePost = catchAsyncError(async (req, res) => {
    const { postId } = req.params;
    if (!postId) throw new CustomError("Validation Error", 400, "invalid_field", { message: "Bad Request" });

    const user = req.user;

    const updatedPost = postService.likePost(postId, user.id);

    res.status(200).json({ post: updatedPost });
});

const likeComment = catchAsyncError(async (req, res) => {
    const { postId, commentId } = req.params;
    if (!postId || !commentId) throw new CustomError("Validation Error", 400, "invalid_field", { message: "Bad Request" });

    const user = req.user;
    const updatedPost = postService.likeComment(postId, commentId, user.id);

    res.status(200).json({ post: updatedPost });
});

const getTimelinePosts = catchAsyncError(async (req, res) => {
    const { userId } = req.params;
    if (!userId) throw new CustomError("Validation Error", 400, "invalid_field", { message: "Bad Request" });

    const posts = await postService.getTimelinePosts(userId);

    res.status(200).json({ posts: posts });
});

const getPersonalPosts = catchAsyncError(async (req, res) => {
    const { userId } = req.params;
    if (!userId) throw new CustomError("Validation Error", 400, "invalid_field", { message: "Bad Request" });

    const posts = postService.getPersonalPosts(userId);

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
