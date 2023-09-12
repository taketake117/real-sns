//投稿情報に関する設定

//Expressフレームワーク使用
//Router関数として存在している。
const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//投稿を作成する。
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try{
        const savedPost = await newPost.save();
        return res.status(200).json(savedPost);
    }catch (err) {
        return res.status(500).json(err);
    }
});

//投稿を更新する
router.put("/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.updateOne({
                $set: req.body,
            });
            return res.status(200).json("投稿編集に成功しました！");
        }else{
            return res.status(403).json("あなたは他の人の投稿を編集できません");
        }
    }catch (err) {
        return res.status(500).json(err);
    }
});

//投稿を削除する。
router.delete("/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.deleteOne();
            return res.status(200).json("投稿削除に成功しました！");
        }else{
            return res.status(403).json("あなたは他の人の投稿を削除できません");
        }
    }catch (err) {
        return res.status(500).json(err);
    }
});

//特定の投稿を取得する
router.get("/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        return res.status(200).json(post);
    }catch (err) {
        return res.status(500).json(err);
    }
});

//ユーザーにいいねをする
router.put("/:id/like", async (req,res) => {
    try{
        //ユーザーID
        const post = await Post.findById(req.params.id);
        //まだ投稿にいいねが押されていなかった場合いいねできる。
        if(!post.likes.includes(req.body.userId)){
            //相手に自信を登録
            await post.updateOne({
                $push: {
                    likes: req.body.userId,
                },
            });
            return res.status(200).json("投稿にいいねを押しました。");
            //投稿に既にいいねが押されていた場合
        }else{
            //いいねしているユーザーIDを取り除く
            await post.updateOne({$pull:{
                likes: req.body.userId,
            }})
            return res.status(403).json("投稿のいいねを外しました");
        }
    }catch(err){
        return res.status(500).json(err);
    }
});

//プロフィール専用のタイムライン
router.get("/profile/:username", async(req,res) => {
    try{
        const user = await User.findOne({ username: req.params.username });
        const posts = await Post.find({ userId: user._id });
        return res.status(200).json(posts);
    }catch(err){
        return res.status(500).json(err);
    }
});


//タイムラインの投稿を取得
router.get("/timeline/:userId", async(req,res) => {
    try{
        
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({ userId: currentUser._id });
        //自分がフォローしている人の投稿内容をすべて取得する。
        const friendPosts = await Promise.all(
            currentUser.followings.map((firendId) => {
                return Post.find({ userId: firendId });
            })
        );
        return res.status(200).json(userPosts.concat(...friendPosts));
    }catch(err){
        
        return res.status(500).json(err);
    }
});

// router.get("/", (req,res) =>{
//     res.send("posts router");
// });

//server.jsで使用したいのでExportをする。
module.exports = router;