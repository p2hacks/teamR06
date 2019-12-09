/* 
Tree.js
b1018194 Ito Hajime
パスTree/以下の管理
*/
// Import express
const express = require('express')
// Import bodyParser
const bodyParser = require('body-parser')
// Import distance.js
const distancejs = require("../js/distance")

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const router = express.Router()

let objects = [] // JSONを返す際の連想配列

// middleware that is specific to this router
router.use(function Auth(req, res, next) {
    //login確認処理
    /*const token = req.headers// headerのlogin tokenを受け取る
        (async () => {
            try {
                const decodedToken = await admin.auth().verifyIdToken(token)
                console.log("login success")
                next()
            } catch (error) {
                console.error("login error")
            }
        })()
    */
    next()//test用
})

router.route('/')

    //TreeKey Map表示のためにGET
    .get((req, res) => {
        /*
        JSON
        {
        locationX: "XXXX"
        locationY: "XXXX"
        distance: "XXXX"
        }
        */

        //TreeKey
        const ref = db.ref("/Tree")
        try {
            // ボディからTreeKeyを取得
            const reqlocationX = req.body.locationX
            const reqlocationY = req.body.locationY
            const reqdistance = req.body.distance //一定距離

            // 一定距離内のTree情報を格納する
            ref.on('child_added', (snapshot) => {
                const locationX = snapshot.val().locationX
                const locationY = snapshot.val().locationY

                if (distancejs.distance(reqlocationX, reqlocationY, locationX, locationY, reqdistance)) {
                    const TreeKey = snapshot.val().TreeKey
                    ref.child(TreeKey).once('value', (snapshot) => {
                        const locationX = snapshot.val().locationX
                        const locationY = snapshot.val().locationY
                        const owner = snapshot.val().owner
                        const point = snapshot.val().point
                        const TreeKey = snapshot.val().TreeKey
                        const snap = {
                            "locationX": locationX,
                            "locationY": locationY,
                            "owner": owner,
                            "point": point,
                            "TreeKey": TreeKey,
                        }
                        objects.push(snap)
                        console.log(JSON.stringify(objects))
                    })
                }
            })

            const json = JSON.stringify(objects)
            res.send(json)
        } catch (error) { res.send("error") }
    })

    // Treeを作成する
    .post((req, res) => {
        /*
        curlコマンド
        curl -v -H "Accept: application/json" -H "Content-type: application/json" -X POST -d "{\"owner\":\"email@email.com\",\"locationY\":\"app123\",\"locationX\":\"app123\"}"  http://localhost:5000/Tree
        JSON
        {
        "owner":"XXXX",
        "locationY":"XXXX",
        "locationX":"XXXX"
        }
        */
        try {
            const ref = db.ref("/Tree")
            const TreeKey = ref.push().key

            // Databaseに保存
            ref.child(TreeKey).set({
                locationX: req.body.locationX,
                locationY: req.body.locationY,
                owner: req.body.owner,
                point: 0,
                TreeKey: TreeKey,
            })
            res.send("success")
        } catch (error) {
            res.send("error")
        }
    })

    // Treeのポイントを追加
    .put((req, res) => {
        /*
        curlコマンド
        curl -v -H "Accept: application/json" -H "Content-type: application/json" -X PUT -d "{\"TreeKey\":\"-LvgCz6vFmgQDLvD5axv\"}"  http://localhost:5000/Tree
        JSON
        {
        TreeKey: "XXXX"
        }
        */
        const ref = db.ref("/Tree")
        try {
            //TreeKeyを貰う
            const TreeKey = req.body.TreeKey
            console.log(TreeKey)
            ref.child(TreeKey + "/point").transaction(function (point) {
                return (point || 0) + 1
            })
            res.send("success")
        } catch (error) { res.send('error') }

    })

module.exports = router