const Post = require("../models/post");
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');


exports.createPost = [
    checkAuth,
    extractFile,
    (req, res, next) => {
        const url = req.protocol + '://' + req.get('host');
        const post = new Post({
            title: req.body.title,
            content: req.body.content,
            imagePath: url + "/images/" + req.file.filename,
            creator: req.userData.userId
        });
        post.save().then(createdPost => {
            res.status(201).json({
                message: 'Post added succesfully',
                post: {
                    ...createdPost,
                    id: createdPost._id,
                }
            });
        })
            .catch(error => {
                res.status(500).json({
                    message: 'Creating a post failed!'
                })
            });
    }
];

exports.updatePost = [
    checkAuth,
    extractFile,
    (req, res, next) => {
        let imagePath = req.body.imagePath;
        if (req.file) {
            const url = req.protocol + '://' + req.get('host');
            imagePath = url + "/images/" + req.file.filename;
        }
        const post = new Post({
            _id: req.params.id,
            title: req.body.title,
            content: req.body.content,
            imagePath: imagePath,
            creator: req.userData.userId
        });

        Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
            .then(result => {
                if (result.n > 0) {
                    res.status(200).json({ message: 'Update successfully!' });
                } else {
                    res.status(401).json({ message: 'Not authorized!' });
                }
            })
            .catch(error => {
                res.status(500).json({
                    message: "Couldn't update post!"
                })
            });
    }
];

exports.getPosts = (req, res, next) => {
    const pageSize = req.query.pagesize;
    const currentPage = req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;

    if (pageSize && currentPage) {
        postQuery
            .skip(pageSize * currentPage)
            .limit(pageSize);
    }
    postQuery
        .then(documents => {
            this.fetchedPosts = documents;
            return Post.countDocuments();
        })
        .then(count => {
            res.status(200).json({
                message: 'Posts fetched succesfully!',
                posts: this.fetchedPosts,
                maxPosts: count
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Fetching posts failed!"
            })
        });
};

exports.getSinglePost = (req, res, next) => {
    Post.findById(req.params.id)
        .then(post => {
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ message: 'Post not found!' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Fetching post failed!"
            })
        });
};

exports.deletePosts = [
    checkAuth,
    (req, res, next) => {
        Post.deleteOne({
            _id: req.params.id,
            creator: req.userData.userId
        })
            .then(
                result => {
                    if (result.deletedCount > 0) {
                        res.status(200).json({ message: 'Deletion successfully!' });
                    } else {
                        res.status(401).json({ message: 'Not authorized!' });
                    }
                }
            )
            .catch(error => {
                res.status(500).json({
                    message: "Fetching post failed!"
                })
            });
    }
];