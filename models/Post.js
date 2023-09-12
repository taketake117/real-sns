const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    userId: {
        type: String,
        require: true,
    },
    desc: {
        type: String,
        max: 200,
    },
    img: {
        type: String,
    },
    likes: {
        type: Array,
        default: [],
    },
  },
  {timestamps: true}
);

//exportして他のファイルでも使用可能にする。
module.exports = mongoose.model("Post", PostSchema);
