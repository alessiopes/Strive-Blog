const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  cover: {
    type: String,
    required: true,
  },
  readTime: {
    value: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "Authors" },
  content: {
    type: String,
    required: true,
  },
    comments: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Comment',
    default: [],
  },
});

const BlogPost = mongoose.model("BlogPost", blogPostSchema);

module.exports = BlogPost;
