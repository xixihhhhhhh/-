const Router = require("@koa/router")
const {
  default: to
} = require("await-to-js")
const router = new Router
const EvaluateLists = require("../model/EvaluateLists")

router.post('/add', async ctx => {
  let data = ctx.request.body
  const { name, avatar, content } = data
  const [err, newComment] = await to(
    commentModel.create({
      name,
      avatar,
      content,
    })
  )
  if (err) {
    ctx.err("添加失败", { success: false });
    console.log('err', err);
  } else {
    console.log('添加成功');
    ctx.suc("添加成功", { success: true });
  }
})


module.exports = router.routes()
