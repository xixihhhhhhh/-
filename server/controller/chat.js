const Router = require("@koa/router")
const {
    default: to
} = require("await-to-js")
const router = new Router
const friendModel = require("../model/Chat")

router.post('/getMsgList', async ctx => {
    let data = ctx.request.body
    //判断所传参数是否为空值
    if (ctx.empty(["user_id", "toUser_id"])) {
        return
    }
    const [err, msgs1] = await to(
        friendModel.findAll({
            where: {
                user_id: data.user_id,
                toUser_id: data.toUser_id,
            },
            raw: true
        })
    )
    const [err1, msgs2] = await to(
        friendModel.findAll({
            where: {
                user_id: data.toUser_id,
                toUser_id: data.user_id,
            },
            raw: true
        })
    )
    if (err) {
        ctx.err("添加失败", err)
        console.log('err', err)
        return
    } else {
        console.log('succ')
        const arr = [...msgs1, ...msgs2].sort((item1, item2) => item1.id - item2.id)
        ctx.suc("查找聊天信息成功", arr)
    }
})

module.exports = router.routes()
