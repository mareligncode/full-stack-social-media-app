const mongoose = require("mongoose");
const filter = require("../util/filter");
const PostLike = require("./PostLike");

const PostSchema = new mongoose.Schema(
  {
    poster: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxLength: [80, "Must be no more than 80 characters"],
    },
    content: {
      type: String,
      required: function () {
        return !this.media && !this.mediaUrl; // Content not required if media exists
      },
      maxLength: [8000, "Must be no more than 8000 characters"],
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    edited: {
      type: Boolean,
      default: false,
    },
    // New media fields
    media: {
      type: String, // This will store the filename
      required: false,
    },
    mediaUrl: {
      type: String, // This will store the full URL to the media
      required: false,
    },
    mediaType: {
      type: String,
      enum: ["image", "video", "none"],
      default: "none",
    },
  },
  { timestamps: true }
);

PostSchema.pre("save", function (next) {
  if (this.title.length > 0) {
    this.title = filter.clean(this.title);
  }

  if (this.content && this.content.length > 0) {
    this.content = filter.clean(this.content);
  }

  next();
});

PostSchema.pre("remove", async function (next) {
  console.log(this._id);
  await PostLike.deleteMany({ postId: this._id });
  next();
});

module.exports = mongoose.model("post", PostSchema);