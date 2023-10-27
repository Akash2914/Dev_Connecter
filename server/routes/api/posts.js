const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const Post = require('../../models/Post');
const User = require('../../models/User');

//! route  POST api/posts
//! desc   Test route
//! access Private

router.post(
  '/',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPostData = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };
      const newPost = new Post(newPostData);
      const post = await newPost.save();
      res.json(post);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);
//! route  POST api/posts
//! desc   get all posts
//! access Private

router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    if (!posts) {
      res.json({ msg: 'No Posts found for this user' });
    }
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

//! route  POST api/posts/:id
//! desc   get posts by id
//! access Private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post Not Found' });
    }

    res.json(post);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post Not Found' });
    }
    res.status(500).send('Server Error');
  }
});

//! route  POST api/posts/:id
//! desc   delete posts by id
//! access Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post Not Found' });
    }
    //? check correct user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User Not Authorized' });
    }
    await post.deleteOne({ _id: req.params.id });
    res.json({ msg: 'Post Deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

//! route  POST api/posts/like/:id
//! desc   like posts by id
//! access Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //! Check if the post exists
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    //? check if the post has been like by the user
    const alreadyLiked = post.likes.some(
      (like) => like.user.toString() === req.user.id
    );
    if (alreadyLiked) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    //! Add the like
    post.likes.unshift({ user: req.user.id });
    await post.save();

    res.json({ msg: 'Post liked' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

//! route  POST api/posts/unlike/:id
//! desc   unlike posts by id
//! access Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post exists
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    //! Check if the user has already liked the post
    const likedIndex = post.likes.findIndex(
      (like) => like.user.toString() === req.user.id
    );
    if (likedIndex === -1) {
      return res.status(400).json({ msg: 'Post has not been liked yet' });
    }

    //! Remove the like
    post.likes.splice(likedIndex, 1);
    await post.save();

    res.json({ msg: 'Post unliked' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});
//! route  POST api/posts/comment/:id
//! desc   coomment posts by id
//! access Private
router.post(
  '/comment/:id',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const post = await Post.findById(req.params.id);
      const user = await User.findById(req.user.id).select('-password');
      //! Check if the post exists
      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      //! Create a new comment object
      const newComment = {
        text: req.body.text,
        user: req.user.id,
        avatar: user.avatar,
        user: req.user.id,
      };

      //! Add the new comment to the post's comments array
      post.comments.unshift(newComment);

      //! Save the post with the new comment
      await post.save();

      res.json({ msg: 'Comment added' });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);
//! route  POST api/posts/comment/:id/:id
//! desc   uncomment posts by id
//! access Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //? Check if the post exists
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    //? Find the index of the comment to remove
    const commentIndex = post.comments.findIndex(
      (comment) => comment._id.toString() === req.params.comment_id
    );

    //? Check if the comment exists in the post
    if (commentIndex === -1) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    //? Check if the user is the author of the comment (or has the necessary permissions)
    if (post.comments[commentIndex].user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User Not Authorized' });
    }

    //? Remove the comment from the post's comments array
    post.comments.splice(commentIndex, 1);

    //? Save the post with the comment removed
    await post.save();

    res.json({ msg: 'Comment removed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
