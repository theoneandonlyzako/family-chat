const router = require("express").Router();
const Post = require("../models/Post");

// Create a post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err)
    }

});

// Update a post
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).json("Post has been updated!")
        } else {
            res.status(403).json("You can only update youre posts!");
        }
    } catch (err) {
        res.status(500).json(err);
    }

});

// Delete a post
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json("Post has been deleted!")
        } else {
            res.status(403).json("You can only delete youre posts!");
        }
    } catch (err) {
        res.status(500).json(err);
    }

});

// Like/dislike a post
router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json("Post has been liked!");
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json("Post has been disliked!");
        }
    } catch (err) {
        res.status(500).json(err);
    }

});

// Get a post
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }

})


// Get posts timeline
router.get("/timeline/all", async (req, res) => {
    console.log("What The Fuck!");

    try {
        console.log("Try This!")
        console.log("Try Nothing!")

        const currentUser = await User.findById(req.body.userId);
        console.log("currentUser Loaded!");
        const userPosts = await Post.find({ userId: currentUser._id });
        
        
        const friendPosts = await Promise.all(
            currentUser.following.map((friendId) => {
                console.log("Promise this!")
                return Post.find({ userId: friendId });
            })
        );
        res.json(userPosts.concat(...friendPosts))
    } catch (err) {
        res.status(500).json(err);
        console.log("Fail!");

    }

})



// router.get("/", (req, res) => {
//     console.log("post page!");

// })

module.exports = router;