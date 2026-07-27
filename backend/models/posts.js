const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  category: {
    type: String,
    required: true,
  },
  image: {
    url: String,
    filename: String,
  },
  description: String,
  date: {
    type: Date,
    default: Date.now,
  },
  comment: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Post", postSchema);