//ユーザー情報に関する設定

//Expressフレームワーク使用
//Router関数として存在している。
const router = require("express").Router();
const User = require("../models/User");

//CRUD操作関連
//ユーザー情報の更新,/:idは各ユーザーごとの固有のものを選択するためのもの
router.put("/:id", async(req,res) => {
    //ユーザーidが登録されているものと一致しているか
    if(req.body.userId === req.params.id  || req.body.isAdmin){
        try{
            //ユーザーを見つけ対象データをアップデートする。mongoDBにあるもの
            const user = await User.findByIdAndUpdate(req.params.id, {
                //ユーザースキーマ情報をすべて取得（$set)
                $set: req.body,
            });
            res.status(200).json("ユーザー情報が更新されました。")
        }catch(err){
            return res.status(500).json(err);
        }
    }else{
        return res
          .status(403)
          .json("アカウント情報が一致しないため更新ができません")
    }
});

//ユーザー情報の削除
router.delete("/:id", async(req,res) => {
    //ユーザーidが登録されているものと一致しているか
    if(req.body.userId === req.params.id  || req.body.isAdmin){
        try{
            //ユーザーを見つけ対象データをアップデートする。mongoDBにあるもの
            const user = await User.findByIdAndDelete(req.params.id, {
                //ユーザースキーマ情報をすべて取得（$set)
                $set: req.body,
            });
            res.status(200).json("ユーザー情報が削除されました。")
        }catch(err){
            return res.status(500).json(err);
        }
    }else{
        return res
          .status(403)
          .json("アカウント情報が一致しないため削除ができません")
    }
});

//ユーザー情報の取得
//タイムラインの情報など取得
router.get("/:id", async(req,res) => {
    try{
        //ユーザー取得
        const user = await User.findById(req.params.id);
        //分割代入操作、PW、Updata、その他を分割して追加。
        const { password, updatedAt, ...other } = user._doc;
        //分割代入でPWとUpdated以外のものを取得
        res.status(200).json(other);
    }catch(err){
        return res.status(500).json(err);
    }
});

//ユーザーをフォローする処理
router.put("/:id/follow", async (req,res) => {
    if(req.body.userId !== req.params.id){
        try{
            //相手のユーザーID
            const user = await User.findById(req.params.id);
            //自身のユーザーID
            const currentUser = await User.findById(req.body.userId);
            
            //相手のフォロワーに自分自身が登録されているか
            if(!user.followers.includes(req.body.userId)){
                //相手に自信を登録
                await user.updateOne({
                    $push: {
                        followers: req.body.userId,
                    },
                });
                //自身に相手のフォロー情報を登録
                await currentUser.updateOne({
                    $push: {
                        followings: req.params.id,
                    },
                });
                return res.status(200).json("相手をフォローしました。");
            }else{
                return res.status(403).json("あなたは既にこのユーザーをフォローしています");
            }
        }catch(err){
            return res.status(500).json(err);
        }
    }else{
        return res.status(500).json("自分自身をフォローはできません");
    }
});

//server.jsで使用したいのでExportをする。
module.exports = router;


// //以下練習用で使用
// router.get("/", (req,res) =>{
//     res.send("user router");
// });


// //"/"はrootディレクトリ（エンドポイント）、以下コールバック関数
// //req=リクエスト　クライアントから受け取る　res=レスポンス　backend側からクライアントに返す
// app.get("/", (req,res) => {
//     //ブラウザからlocalhost:3000を呼ぶとレスポンスとして以下を返す。
//     //htmlはクライアント　以下はバックエンド
//     res.send("hello express");
// })

// app.get("/users", (req,res) => {
//     //ブラウザからlocalhost:3000を呼ぶとレスポンスとして以下を返す。
//     //htmlはクライアント　以下はバックエンド
//     res.send("users express");
// })