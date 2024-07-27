const Router = require("@koa/router")
const {
  default: to
} = require("await-to-js")
const router = new Router
const commentModel = require("../model/Comments")

const { timeDifference } = require("../utils");

router.post('/add', async ctx => {
  let data = ctx.request.body
  const { name, avatar, content } = data
  const [err] = await to(
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

router.post('/get', async ctx => {
  const [err, comments] = await to(
    commentModel.findAll({})
  )
  const data = []
  comments.forEach((comment) => {
    data.push({
      content: comment.content,
      avatar: comment.avatar,
      name: comment.name,
      date: timeDifference(comment.create_time),
    })
  })
  if (err) {
    ctx.err("添加失败", err);
    console.log('err', err);
  } else {
    ctx.suc("添加成功", data);
  }
})

module.exports = router.routes()
