const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

const Post = require('../models/post');
const User = require('../models/user');

exports.getPosts = (req, res, next) => {
    const currentPage = req.query.page || 1;
    perPage = 2;

    let totalItems;

    Post.find().countDocuments()
    .then(count => {
        totalItems = count;
        return Post.find()
        .skip(((currentPage -1) * perPage))
        .limit(perPage)
    })
    .then(posts => {
        res.status(200).json({ message: 'Post fetched', posts: posts, totalItems: totalItems })
    })
    .catch(error => {
        if(!error.statusCode) {
            error.statusCode = 500
        }
        next(error);
    })
};

exports.createPost = (req, res, next) => {

    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        const error = new Error("Validation failed!, entered data is incorrect")
        error.statusCode = 422
        throw error;
    }
    if(!req.file) {
        const error = new Error('No image provided');
        error.statusCode = 422;
        throw error;
    }

    const title = req.body.title;
    const imageUrl = req.file.path.replace("\\","/");
    const content = req.body.content;
    let creator = req.userId;

    const post = new Post({
        title,
        imageUrl,
        content,
        creator
    })

    post.save()
    .then(result => {
        return User.findById(req.userId)
    }).then(user => {
        creator = user;
        user.posts.push(post)
        return user.save()
    }).then(result => {
        res.status(200).json({
            message: "Post created successfully",
            post: post,
            creator: {
                _id: creator._id,
                name: creator.name
            }
        })
    })
    .catch(error => {
        if(!error.statusCode) {
            error.statusCode = 500
        }
        next(error);
    })
};

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;

    Post.findById(postId)
    .then(post => {
        if(!post) {
            const error = new Error("Could not find post.");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ message: 'Post fetched', post: post })
    })
    .catch(error => {
        if(!error.statusCode) {
            error.statusCode = 500
        }
        next(error);
    })
};

exports.getStatus = (req, res, next) => {
    User.findById(req.userId)
    .then(user => {
        res.status(200).json({ message: 'Status Fetched', status: user.status })
    })
    .catch(error => {
        if(!error.statusCode) {
            error.statusCode = 500
        }
        next(error);
    })
}

exports.updateStatus = (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        const error = new Error("Validation failed!, entered data is incorrect")
        error.statusCode = 422
        throw error;
    }

    const status = req.body.status;
    User.findById(req.userId)
    .then(user => {
        user.status = status;
        return user.save()
    }).then(resullt => {
        res.status(200).json({ message: 'Status Updated', status: status })
    })
    .catch(error => {
        if(!error.statusCode) {
            error.statusCode = 500
        }
        next(error);
    })
}

exports.updatePost = (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        const error = new Error("Validation failed!, entered data is incorrect")
        error.statusCode = 422
        throw error;
    }

    if(post.creator.toString() !== req.userId) {
        const err = new Error('Not Authorized!!')
        err.statusCode = 401;
        throw err
    }
   
    const postId = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;
    console.log(req.body)
    if(req.file) {
        imageUrl = req.file.path.replace("\\","/");
    }

    if(!imageUrl){
        const error = new Error("No file picked.");
        error.statusCode = 422;
        throw error;
    }

    Post.findById(postId)
    .then(post => {
        if(!post) {
            const error = new Error("Could not find post.");
            error.statusCode = 404;
            throw error;
        }

        if(imageUrl !== post.imageUrl) {
            clearImage(post.imageUrl);
        }
        post.title = title;
        post.content = content;
        post.imageUrl = imageUrl;
        return post.save();
    }).then(result => {
        res.status(200).json({ message: 'Post updated', post: result })
    })
    .catch(error => {
        if(!error.statusCode) {
            error.statusCode = 500
        }
        next(error);
    })
};

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;

    Post.findById(postId)
    .then(post => {
        // Check logged in user
        if(!post) {
            const error = new Error("Could not find post.");
            error.statusCode = 404;
            throw error;
        }

        if(post.creator.toString() !== req.userId) {
            const err = new Error('Not Authorized!!')
            err.statusCode = 401;
            throw err
        }

        clearImage(post.imageUrl);
        return Post.findByIdAndRemove(postId);
    }).then(result => {
        return User.findById(req.userId)
    }).then(user => {
        user.posts.pull(postId);
        return user.save();
    }).then(result => {
        res.status(200).json({ message: "Post deleted", data: result })
    })
    .catch(error => {
        if(!error.statusCode) {
            error.statusCode = 500
        }
        next(error);
    })
}

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => {
        if(err) {
            console.log(err);
        }
    })
}
