const Router = require("@koa/router")
const {
  default: to
} = require("await-to-js")
const router = new Router
const questionnireModel = require("../model/Questions");
const { checkExistingField, handleResult } = require("../utils");

router.post('/add', async ctx => {
  let data = ctx.request.body
  // const quesData = json.toString(data.quesData)
  const quesData = data.quesData
  if (await checkExistingField(questionnireModel, 'positionType', data.positionType)) {
    const res = await questionnireModel.update({ questionNum: data.questionNum, quesData }, {
      where: {
        positionType: data.positionType,
      },
      raw: true
    })
    if (res.length > 0) {
      ctx.suc("添加成功", { success: true })
    }
    return;
  }

  const [err, newQues] = await to(
    questionnireModel.create({
      positionType: data.positionType,
      questionNum: data.questionNum,
      quesData
    })
  )

  handleResult(ctx, err, "添加成功", { success: true })
})

router.post('/get', async ctx => {
  let data = ctx.request.body
  const existingAuestionnire = await questionnireModel.findAll({
    where: {
      positionType: data.positionType
    },
    raw: true
  });
  ctx.suc("添加成功", existingAuestionnire[0])
})

module.exports = router.routes()