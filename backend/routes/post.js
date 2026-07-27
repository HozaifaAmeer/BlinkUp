const express = require("express");
const router = express.Router();
const Post = require("../models/posts.js");
const Comment = require("../models/comment.js");
const multer = require("multer");
const { cloudinary, storage } = require("../cloudConfig.js");
const authenticateToken = require("../middleware/auth.js");

const upload = multer({ storage });

// GET /posts — return all posts
router.get("/", async (req, res) => {
    try {
        const allPosts = await Post.find({}).populate("owner", "username");
        res.status(200).json(allPosts);
    } catch (err) {
        console.error("Error fetching posts:", err.message);
        res.status(500).json({ error: "Failed to fetch posts" });
    }
});

// POST /posts — create a new post (requires login)
router.post("/", authenticateToken, upload.single("image"), async (req, res) => {
    try {
        const { category, description } = req.body;

        // Validate required fields
        if (!category || !category.trim()) {
            return res.status(400).json({ error: "Category is required" });
        }
        if (!description || !description.trim()) {
            return res.status(400).json({ error: "Description is required" });
        }

        const url = req.file ? req.file.path : "";
        const filename = req.file ? req.file.filename : "";

        const newPost = new Post({
            category,
            description,
            image: {
                url,
                filename,
            },
            owner: req.user.id,
        });
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (err) {
        console.error("Error creating post:", err.message);
        res.status(500).json({ error: "Failed to create post" });
    }
});

// GET /posts/:id — return a single post
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate("owner", "username")
            .populate({
                path: "comment",
                populate: { path: "author", select: "username" },
            });
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.status(200).json(post);
    } catch (err) {
        console.error("Error fetching post:", err.message);
        res.status(500).json({ error: "Failed to fetch post" });
    }
});

// POST /posts/:id/comments — add a comment to a post (requires login)
router.post("/:id/comments", authenticateToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Validate comment text
        if (!req.body.comment || !req.body.comment.trim()) {
            return res.status(400).json({ error: "Comment cannot be empty" });
        }

        const newComment = new Comment({
            comment: req.body.comment,
            author: req.user.id,
        });
        await newComment.save();
        post.comment.push(newComment._id);
        await post.save();

        // Populate author before returning
        await newComment.populate("author", "username");
        res.status(201).json(newComment);
    } catch (err) {
        console.error("Error creating comment:", err.message);
        res.status(500).json({ error: "Failed to add comment" });
    }
});

// DELETE /posts/:id/comments/:commentId — delete a comment (only comment author)
router.delete("/:id/comments/:commentId", authenticateToken, async (req, res) => {
    try {
        const { id, commentId } = req.params;
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }
        // Only the comment author can delete
        if (comment.author.toString() !== req.user.id) {
            return res.status(403).json({ error: "You are not authorized to delete this comment" });
        }
        // Remove comment ref from the post
        await Post.findByIdAndUpdate(id, { $pull: { comment: commentId } });
        await Comment.findByIdAndDelete(commentId);
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (err) {
        console.error("Error deleting comment:", err.message);
        res.status(500).json({ error: "Failed to delete comment" });
    }
});

// PUT /posts/:id — edit/update a post (only owner)
router.put("/:id", authenticateToken, upload.single("image"), async (req, res) => {
    try {
        const { category, description } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Check ownership
        if (post.owner.toString() !== req.user.id) {
            return res.status(403).json({ error: "You are not authorized to edit this post" });
        }

        // Validate: at least category or description must be non-empty if provided
        if (category !== undefined && !category.trim()) {
            return res.status(400).json({ error: "Category cannot be empty" });
        }
        if (description !== undefined && !description.trim()) {
            return res.status(400).json({ error: "Description cannot be empty" });
        }

        if (category) post.category = category;
        if (description) post.description = description;

        // If a new image was uploaded, update Cloudinary image details
        if (req.file) {
            post.image = {
                url: req.file.path,
                filename: req.file.filename,
            };
        }

        const updatedPost = await post.save();
        res.status(200).json(updatedPost);
    } catch (err) {
        console.error("Error updating post:", err.message);
        res.status(500).json({ error: "Failed to update post" });
    }
});

// DELETE /posts/:id — delete a post (only owner)
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Check ownership
        if (post.owner.toString() !== req.user.id) {
            return res.status(403).json({ error: "You are not authorized to delete this post" });
        }

        // Delete image from Cloudinary if filename exists
        if (post.image && post.image.filename) {
            try {
                await cloudinary.uploader.destroy(post.image.filename);
            } catch (cloudErr) {
                console.error("Failed to delete image from Cloudinary:", cloudErr.message);
            }
        }

        await Post.findByIdAndDelete(id);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
        console.error("Error deleting post:", err.message);
        res.status(500).json({ error: "Failed to delete post" });
    }
});

module.exports = router;