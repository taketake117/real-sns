//投稿情報に関する設定

//Expressフレームワーク使用
//Router関数として存在している。
const router = require("express").Router();

router.get("/", (req,res) =>{
    res.send("posts router");
});

//server.jsで使用したいのでExportをする。
module.exports = router;