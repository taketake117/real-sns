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
//ユーザー情報の取得

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