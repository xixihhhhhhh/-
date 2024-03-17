/*show.js*/
const Router = require("@koa/router")
const {
    default: to
} = require("await-to-js")
const router = new Router()
const showModel = require("../model/User")

//示例，有关这个表的操作或相关操作都写在这个文件下
router.get('/list', async ctx => {
    console.log(ctx)
    // 查询所有用户
    const users = await to(showModel.findAll());
    console.log(users)
    ctx.body = users
})

/**
 * @api {post} /show/add 增加一条数据
 * @apiGroup 添加
 * @apiParam {String} username
 * @apiParam {string} phone
 */
router.post('/add', async ctx => {
    let data = ctx.request.body
    //判断所传参数是否为空值
    if (ctx.empty(["name", "phone"])) {
        return
    }
    const [err, newUser] = await to(
        showModel.create({
            name: data.name,
            phone: data.phone
        })
    )
    if (err) {
        ctx.err("添加失败", err)
        console.log('err', err)
        return
    } else {
        console.log('succ')
        delete newUser.phone
        ctx.suc("添加成功", newUser)
    }
})

module.exports = router.routes()
console.log(router.routes())