const express = require("express");

const sequelize = require("../database");
const logger = require("../logger");

// middlewares
const checkAuth = require("../middlewares/auth/checkAuth");
const checkPostCreation = require("../middlewares/posts/checkPostCreation");
const checkValidation = require("../middlewares/checkValidation");
const paginationMiddleware = require("../middlewares/paginationMiddleware");

const router = express.Router();

router.use(checkAuth)

router.get("/", paginationMiddleware, async (req, res) => {
    try {
        const Post = sequelize.models.Post;
        const posts = await Post.findAndCountAll({offset:});
        res.json(posts);
    } catch (error) {
        logger.error("Error happened while fetching the posts: ", error)
        res.status(500).json({message: "Error happened while fetching the posts"});
    }
})

router.post("/", checkPostCreation, checkValidation, async (req, res) => {
    try {
        const post = await sequelize.transaction(async (transaction) => {
            const Post = sequelize.models.Post;
            return await Post.create({
                user_id: req.user.id,
                title: req.body.title,
                body: req.body.body,
            }, {transaction});
        });
        logger.info(`Post created successfully: Post.id = ${post.id}`);
        res.status(201).json(post);
    } catch (error) {
        logger.error("Post creation failed: ", error); // Logging the detailed error
        res.status(500).json({message: "Error happened while creating the post"});
    }
})

router.get("/:id", async (req, res) => {
    try {
        const Post = sequelize.models.Post;
        const post = await Post.findByPk(req.params.id);
        if (!post) return res.status(404).json({message: "Post not found"});
        res.json(post);
    } catch (error) {
        logger.error("Error happened while fetching the post: ", error)
        res.status(500).json({message: "Error happened while fetching the post"});
    }
})

router.put("/:id", checkValidation, async (req, res) => {

    try {
        const post = await sequelize.transaction(async (transaction) => {
            const Post = sequelize.models.Post;
            const post = await Post.findByPk(req.params.id);
            if (!post) return res.status(404).json({message: "Post not found"});
            return await post.update({
                title: req.body.title,
                body: req.body.body,
            }, {transaction});
        })
        res.json(post);
    } catch (error) {
        logger.error("Error happened while updating the post: ", error)
        res.status(500).json({message: "Error happened while updating the post"});
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const post = await sequelize.transaction(async (transaction) => {
            const Post = sequelize.models.Post;
            const post = await Post.findByPk(req.params.id);
            if (!post) return res.status(404).json({message: "Post not found"});
            return await post.destroy({transaction});
        })
        res.status(204).json({message: "Post deleted successfully"});
    } catch (error) {
        logger.error("Error happened while deleting the post: ", error)
        res.status(500).json({message: "Error happened while deleting the post"});
    }
})

module.exports = router;