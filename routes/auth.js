//認証情報に関する設定

//Expressフレームワーク使用
//Router関数として存在している。
const router = require("express").Router();
const User = require("../models/User")

// router.get("/", (req,res) =>{
//     res.send("auth router");
// });

//ユーザー登録
//非同期処理でawait,asyncを使用
router.post("/register", async (req,res) => {
    //エラーハンドリング処理
    try{
        const newUser = await new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });
        //ユーザー登録データ保存
        const user = await newUser.save();
        //すべてOKなら200
        return res.status(200).json(user);
    }catch(err){
        //500サーバー関連エラー
        return res.status(500).json(err);
    }
});

//ログイン
router.post("/login", async (req,res) => {
    try{
        //email情報からユーザーの特定をする。
        //mongooseにfindoneという特定の情報を一つ取得する関数
        const user = await User.findOne({ email: req.body.email });//左右半角空白いれないとpostmanでlogin情報取得できなかった。
        if (!user) return res.status(404).send("ユーザー情報が見つかりません。");

        //パスワードが登録されているものと一致しているか。
        //400はステータスコード、作り終えたらハッシュ化などして堅牢にする。
        const vailedpassword = req.body.password === user.password;
        if (!vailedpassword) return res.status(400).json("パスワードが違います");

        return res.status(200).json(user);
    }catch(err){
        return res.status(500).json(err);
    }
});

//server.jsで使用したいのでExportをする。
module.exports = router;
