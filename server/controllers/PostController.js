const Post = require("../models/Post");

const create = async (req, res) => {
    const { userId, placeId, comment, mediaDescriptions } = req.body
    try {
        const media = req.files?.length > 0
            ? req.files.map((file, index) => ({
                path: file.path,
                filename: file.filename,
                size: file.size,
                description: mediaDescriptions[index],
                type: file.mimetype.startsWith('image/')
                    ? 'image'
                    : file.mimetype.startsWith('video/')
                        ? 'video'
                        : 'unknown'
            }))
            : [];
        const post = new Post({
            userId, placeId, comment, media
        })
        await post.save();
        return res.status(200).json({
            message: 'ok',
            post
        })
    } catch (error) {
        return res.status(500).json({
            message: 'internal server error'
        })
    }
}

const comments = async (req, res) => {
    const { postId } = req.params
    const { description, userId } = req.body
    const comment = {
        description: description,
        userId: userId
    };
    try {
        const post = await Post.findOneAndUpdate(
            { _id: postId },
            { $push: { comments: comment } },
            { new: true }
        );
        return res.status(200).json({
            message: 'ok',
            post
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
}

const likes = async (req, res) => {
    const { postId } = req.params;
    const { userId } = req.body;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post no encontrado' });
        }

        const alreadyLiked = post.likes.includes(userId);

        if (alreadyLiked) {
            post.likes.pull(userId);
        } else {
            post.likes.push(userId);
        }

        await post.save();

        return res.status(200).json({
            message: alreadyLiked ? 'Like eliminado' : 'Like agregado',
            results: post
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate('userId placeId');
        return res.status(200).json({
            message: 'ok',
            results: posts
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'internal server error'
        })
    }
}

const getUserPosts = async (req, res) => {
    const { userId } = req.params
    try {
        const posts = await Post.findOne({ userId: userId }).sort({ createdAt: -1 })
        return res.status(200).json({
            message: 'ok',
            posts
        })
    } catch (error) {
        return res.status(500).json({
            message: 'internal server error'
        })
    }
}

const getPlacePosts = async (req, res) => {
    const { placeId } = req.params
    try {
        const posts = await Post.findOne({ placeId: placeId }).sort({ createdAt: -1 })
        return res.status(200).json({
            message: 'ok',
            posts
        })
    } catch (error) {
        return res.status(500).json({
            message: 'internal server error'
        })
    }
}

const editPost = async (req, res) => {
    const { postId } = req.params;
    const { comments, likes, mediaDescriptions } = req.body;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post no encontrado" });
        }

        if (comments.length > 0) post.comments = comments;
        if (description) post.likes = likes;

        // Si se envían nuevas medias, agregarlas
        if (req.files?.length > 0) {
            if (post.media.length > 0) {
                post.media.forEach(media => {
                    fs.unlink(media.path, (err) => {
                        if (err) {
                            return res.status(500).json({ message: 'Internal server error' });
                        }
                    });
                })
                await Post.updateOne({ _id: postId }, { $unset: { media: "" } });
            }

            const newMedia = req.files?.length > 0
                ? req.files.map((file, index) => ({
                    path: file.path,
                    filename: file.filename,
                    size: file.size,
                    description: mediaDescriptions[index],
                    type: file.mimetype.startsWith('image/')
                        ? 'image'
                        : file.mimetype.startsWith('video/')
                            ? 'video'
                            : 'unknown'
                }))
                : [];
            post.media.push(...newMedia);
        }

        // Guardar cambios en la base de datos
        await post.save();

        return res.status(200).json({
            message: "Post actualizado exitosamente",
            post
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

const deletePost = async (req, res) => {
    const { postId } = req.params
    try {
        const post = await Post.deleteOne({ _id: postId });

        if (post.deletedCount === 0) {
            return res.status(404).json({
                message: 'Post no encontrado',
            });
        }

        return res.status(200).json({
            message: 'ok',
            post,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

module.exports = {
    create,
    getPosts,
    getUserPosts,
    getPlacePosts,
    editPost,
    deletePost,
    comments,
    likes
}