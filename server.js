const express = require("express");
const mongoose = require("mongoose");
const app = express();
//各ルーティングの情報を呼び出し
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
//PORTは港という意味、ポート番号を好きに設定できる。
//どこでサーバーを立てるか決める
const PORT = 5000;
require("dotenv").config();

//データベース接続（mongoDB)
mongoose.connect(
    //DBURLを隠すために.envを使用する。
    process.env.MONGOURL
)
.then(() => {
    //接続ができたか確認ログを表示
    console.log("DBと接続中........");
})
.catch((err) => {
    //パスワードミス確認のため
    console.log(err);
});

//ミドルウェア(エンドポイント設定)
//以下の指定したエンドポイントを、users.jsのrootディレクトリとして扱うという書き方
//各設定ごとにファイルを使用するとわかりやすい
//expressはJsonとして扱う
app.use(express.json());//これ最初に呼び出さないとpostmanでユーザー情報をおくれない
app.use("/api/users",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/posts",postRoute);



app.listen(PORT,() => console.log("サーバーが起動しました"));
