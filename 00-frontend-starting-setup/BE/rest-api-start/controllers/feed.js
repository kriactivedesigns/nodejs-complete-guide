exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [{ title: 'First Post' , content: "This is First Post Content!!!" }]
    })
};

exports.createPost = (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;
    // Create Post
    res.status(200).json({
        message: "Post created successfully",
        post: {
            title,
            content
        }
    })
}