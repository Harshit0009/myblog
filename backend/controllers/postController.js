const cloudinary = require('../utils/cloudinary');
const Post = require('../models/postModel');
const ErrorResponse = require('../utils/errorResponse');
const main = require('../index');

// create post
async function createPost(req, res, next) {
  const { title, content, postedBy, image, comments, likes } = req.body;

  try {
    //upload image in cloudinary
    const result = await cloudinary.uploader.upload(image, {
      folder: 'posts',
      width: 1200,
      crop: 'scale',
    });
    const post = await Post.create({
      title,
      content,
      postedBy: req.user._id,
      image: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });
    res.status(201).json({
      success: true,
      post,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

//show posts
async function showPost(req, res, next) {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('postedBy', 'name');
    res.status(201).json({
      success: true,
      posts,
    });
  } catch (error) {
    next(error);
  }
}

//show single post
async function getSinglePost(req, res, next) {
  try {
    const post = await Post.findById(req.params.id).populate(
      'comments.postedBy',
      'name'
    );
    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    next(error);
  }
}

//delete post
async function deletePost(req, res, next) {
  const currentPost = await Post.findById(req.params.id);

  //delete post image in cloudinary
  const ImgId = currentPost.image.public_id;
  if (ImgId) {
    await cloudinary.uploader.destroy(ImgId);
  }

  try {
    const post = await Post.findByIdAndRemove(req.params.id);
    res.status(200).json({
      success: true,
      message: 'post deleted',
    });
  } catch (error) {
    next(error);
  }
}

//update post
async function updatePost(req, res, next) {
  try {
    const { title, content, image } = req.body;
    const currentPost = await Post.findById(req.params.id);

    //build the object data
    const data = {
      title: title || currentPost.title,
      content: content || currentPost.content,
      image: image || currentPost.image,
    };

    //modify post image conditionally
    if (req.body.image !== '') {
      const ImgId = currentPost.image.public_id;
      if (ImgId) {
        await cloudinary.uploader.destroy(ImgId);
      }

      const newImage = await cloudinary.uploader.upload(req.body.image, {
        folder: 'posts',
        width: 1200,
        crop: 'scale',
      });

      data.image = {
        public_id: newImage.public_id,
        url: newImage.secure_url,
      };
    }

    const postUpdate = await Post.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });

    res.status(200).json({
      success: true,
      postUpdate, // returning the modified document after the update
    });
  } catch (error) {
    next(error);
  }
}

// add comment
async function addComment(req, res, next) {
  const { comment } = req.body;
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $push: { comments: { text: comment, postedBy: req.user._id } },
      },
      { new: true }
    );
    // const post = await Post.findById(postComment._id).populate('comments.postedBy', 'name email');
    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    next(error);
  }
}

// add comment
async function addLike(req, res, next) {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likes: req.user._id },
      },
      { new: true }
    );
    // const post = await Post.findById(postComment._id).populate('comments.postedBy', 'name email');
    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    next(error);
  }
}

// removeLike
async function removeLike (req, res, next) {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likes: req.user._id },
      },
      { new: true }
    );
    // const post = await Post.findById(postComment._id).populate('comments.postedBy', 'name email');
    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createPost,
  showPost,
  updatePost,
  deletePost,
  getSinglePost,
  addComment,
  addLike,
  removeLike
};
