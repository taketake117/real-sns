//ユーザー情報スキーマ関連
const mongoose = require("mongoose");

//mongooseにschemaクラスがあるので使用
//そこからオブジェクト登録をする。
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 25,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        max: 50,
        unique: true,
    },
    password:{
        type: String,
        required: true,
        min: 6,
        max: 50,
        unique: true,
    },
    profilePicture:{
        //画像イメージのパスのため文字型
        type: String,
        default: "",
    },
    coverPicture:{
        //画像イメージのパスのため文字型
        type: String,
        default: "",
    },
    followers:{
        //フォロワーは増えるので、保存するため配列を用意
        type: Array,
        default: [],
    },
    followings:{
        //フォローする人も増えるので、保存するための配列を用意
        type: Array,
        default: [],
    },
    isAdmin: {
        //権限管理
        type: Boolean,
        default: false,
    },
    desc: {
        //概要欄など
        type: String,
        max: 50,
    },
    city: {
        //所属する国
        type: String,
        max: 50,
    },
   
  },
  //データを格納した日付を自動的に保存
  {timestamps: true}

);

module.exports = mongoose.model("User",UserSchema);