const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

const Post = require('../models/post');
const User = require('../models/user');

exports.getPosts = async(req, res, next) => {
    const currentPage = req.query.page || 1;
    perPage = 2;
    try {
        const totalItems = await Post.find().countDocuments()
        const posts = await Post.find()
            .populate('creator')
            .skip(((currentPage -1) * perPage))
            .limit(perPage)
        console.log(posts)
        res.status(200).json({ message: 'Post fetched', posts: posts, totalItems: totalItems })
    } catch(error) {
        if(!error.statusCode) {
            error.statusCode = 500
        }
        next(error);
    }
};

exports.createPost = async(req, res, next) => {

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

    try {
        await post.save();
        const user = await User.findById(req.userId)
        creator = user;
        user.posts.push(post)
        await user.save()
        res.status(200).json({
            message: "Post created successfully",
            post: post,
            creator: {
                _id: creator._id,
                name: creator.name
            }
        })
    } catch (error) {
        if(!error.statusCode) {
            error.statusCode = 500
        }
        next(error);
    }
};

exports.getPost = async(req, res, next) => {
    const postId = req.params.postId;
    try{
        const post = await Post.findById(postId)
        if(!post) {
            const error = new Error("Could not find post.");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ message: 'Post fetched', post: post })
    } catch (error) {
        if(!error.statusCode) {
            error.statusCode = 500
        }
        next(error);
    }
};

exports.getStatus = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId)
        res.status(200).json({ message: 'Status Fetched', status: user.status })
    } catch(error) {
        if(!error.statusCode) {
            error.statusCode = 500
        }
        next(error);
    }
}

exports.updateStatus = async(req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        const error = new Error("Validation failed!, entered data is incorrect")
        error.statusCode = 422
        throw error;
    }
    try {
        const status = req.body.status;
        const user = User.findById(req.userId)
        user.status = status;
        await user.save()
        res.status(200).json({ message: 'Status Updated', status: status })
    } catch(error) {
        if(!error.statusCode) {
            error.statusCode = 500
        }
        next(error);
    }
}

exports.updatePost = async(req, res, next) => {
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
    
    if(req.file) {
        imageUrl = req.file.path.replace("\\","/");
    }

    if(!imageUrl){
        const error = new Error("No file picked.");
        error.statusCode = 422;
        throw error;
    }
    try {
        const post = Post.findById(postId)
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
        await post.save();
        res.status(200).json({ message: 'Post updated', post: result })
    } catch (error) {
        if(!error.statusCode) {
            error.statusCode = 500
        }
        next(error);
    }
};

exports.deletePost = async(req, res, next) => {
    const postId = req.params.postId;

    const post = Post.findById(postId)
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
    try {
        await Post.findByIdAndRemove(postId);
        const user = await User.findById(req.userId)
        user.posts.pull(postId);
        await user.save();
        res.status(200).json({ message: "Post deleted", data: result })
    } catch(error) {
        if(!error.statusCode) {
            error.statusCode = 500
        }
        next(error);
    }
}

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => {
        if(err) {
            console.log(err);
        }
    })
}
