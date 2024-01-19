import type { Request, Response } from "express";
import postService from "@src/services/post.business";
import { postSchema, commentSchema } from "@src/schemas/post.schema";
import catchAsyncError from "@src/middlewares/catch-async-error.middleware";
import { HttpError, HttpErrors, processValidationError } from "@src/utils/application-errors";
import type { IVerifiedRequest } from "@src/types";

const getAllPosts = catchAsyncError(async (_req: Request, res: Response) => {
    const posts = await postService.getAllPosts();

    res.status(200).json({ posts: posts });
});

const getPost = catchAsyncError(async (req: Request, res: Response) => {
    const { postId } = req.params;
    if (!postId) throw new HttpError(400, HttpErrors.BAD_REQUEST, "postId not provided.");

    const post = await postService.getPost(postId);

    res.status(200).json({ post: post });
});

const addPost = catchAsyncError(async (req: Request, res: Response) => {
    let data = null;
    try {
        data = await postSchema.validateAsync(req.body);
    } catch (error) {
        processValidationError(error);
    }

    const user = (req as IVerifiedRequest).user;
    const post = await postService.addPost(user, data);

    res.status(200).json({ post: post });
});

const updatePost = catchAsyncError(async (req: Request, res) => {
    const { postId } = req.params;
    if (!postId) throw new HttpError(400, HttpErrors.BAD_REQUEST, "postId not provided.");

    const user = (req as IVerifiedRequest).user;

    let data = null;
    try {
        data = await postSchema.validateAsync(req.body);
    } catch (error) {
        processValidationError(error);
    }

    const updatedPost = await postService.updatePost(user, postId, data);

    res.status(200).json({ post: updatedPost });
});

const deletePost = catchAsyncError(async (req: Request, res) => {
    const { postId } = req.params;
    if (!postId) throw new HttpError(400, HttpErrors.BAD_REQUEST, "postId not provided.");

    const user = (req as IVerifiedRequest).user;
    const response = await postService.deletePost(user, postId);

    res.status(200).json({ message: response });
});

const getComments = catchAsyncError(async (req: Request, res) => {
    const { postId } = req.params;
    if (!postId) throw new HttpError(400, HttpErrors.BAD_REQUEST, "postId not provided.");

    const comments = await postService.getComments(postId);

    res.status(200).json({ comments: comments });
});

const addComment = catchAsyncError(async (req: Request, res) => {
    const { postId } = req.params;
    if (!postId) throw new HttpError(400, HttpErrors.BAD_REQUEST, "postId not provided.");

    const user = (req as IVerifiedRequest).user;

    let data = null;
    try {
        data = await commentSchema.validateAsync(req.body);
    } catch (error) {
        processValidationError(error);
    }
    const comments = await postService.addComment(user, postId, data);

    res.status(200).json({ comments: comments });
});

const updateComment = catchAsyncError(async (req: Request, res) => {
    const { postId, commentId } = req.params;
    if (!postId || !commentId) throw new HttpError(400, HttpErrors.BAD_REQUEST, "postId/commentId not provided.");

    const user = (req as IVerifiedRequest).user;

    let data = null;
    try {
        data = await commentSchema.validateAsync(req.body);
    } catch (error) {
        processValidationError(error);
    }

    const comments = await postService.updateComment(user, postId, commentId, data);

    res.status(200).json({ comments: comments });
});

const deleteComment = catchAsyncError(async (req: Request, res) => {
    const { postId, commentId } = req.params;
    if (!postId || !commentId) throw new HttpError(400, HttpErrors.BAD_REQUEST, "postId/commentId not provided.");

    const user = (req as IVerifiedRequest).user;
    const comments = await postService.deleteComment(user, postId, commentId);

    res.status(200).json({ comments: comments });
});

const likePost = catchAsyncError(async (req: Request, res) => {
    const { postId } = req.params;
    if (!postId) throw new HttpError(400, HttpErrors.BAD_REQUEST, "postId not provided.");

    const user = (req as IVerifiedRequest).user;
    const response = await postService.likePost(user.id, postId);

    res.status(200).json({ message: response });
});

const likeComment = catchAsyncError(async (req: Request, res) => {
    const { postId, commentId } = req.params;
    if (!postId || !commentId) throw new HttpError(400, HttpErrors.BAD_REQUEST, "postId/commentId not provided.");

    const user = (req as IVerifiedRequest).user;
    const response = await postService.likeComment(user.id, postId, commentId);

    res.status(200).json({ message: response });
});

const getTimelinePosts = catchAsyncError(async (req: Request, res) => {
    const user = (req as IVerifiedRequest).user;

    const posts = await postService.getTimelinePosts(user.id);

    res.status(200).json({ posts: posts });
});

const getPersonalPosts = catchAsyncError(async (req: Request, res) => {
    const { userId } = req.params;
    if (!userId) throw new HttpError(400, HttpErrors.BAD_REQUEST, "userId not provided.");

    const posts = await postService.getPersonalPosts(userId);

    res.status(200).json({ posts: posts });
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
