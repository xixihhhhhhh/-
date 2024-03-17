const Router = require("@koa/router")
const {
    default: to
} = require("await-to-js")
const router = new Router
const friendModel = require("../model/Friend")

router.post('/add', async ctx => {
    let data = ctx.request.body
    console.log(data)
    //判断所传参数是否为空值
    if (ctx.empty(["user_id", "friend_id", "frined_name", "user_name"])) {
        return
    }
    const [err, newUser] = await to(
        friendModel.create({
            user_id: data.user_id,
            friend_id: data.friend_id,
            delete_flag: 0,
            friend_name: data.frined_name,
            friend_avatar_url: ''
        })
    )
    const [err1, newUser1] = await to(
        friendModel.create({
            user_id: data.friend_id,
            friend_id: data.user_id,
            delete_flag: 0,
            friend_name: data.user_name,
            friend_avatar_url: ''
        })
    )
    if (err) {
        ctx.err("添加失败", err)
        console.log('err', err)
        return
    } else {
        console.log('succ')
        ctx.suc("添加成功", newUser)
    }
})

router.post('/myFriend', async ctx => {
    let data = ctx.request.body
    console.log(data)
    //判断所传参数是否为空值
    if (ctx.empty(["user_id"])) {
        return
    }
    const [err, users] = await to(
        friendModel.findAll({
            where: {
                user_id: data.user_id
            },
            raw: true
        })
    )
    if (err) {
        ctx.err("查找失败", err)
        console.log('err', err)
        return
    } else {
        console.log('succ')
        ctx.suc("查找成功", users)
    }
})

//示例
router.get('/hhh',ctx=>{
    ctx.response.body='这是示例'
})

module.exports = router.routes()
