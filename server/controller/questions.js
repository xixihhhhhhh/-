const Router = require("@koa/router")
const {
  default: to
} = require("await-to-js")
const router = new Router
const questionnireModel = require("../model/Questions");
const { checkExistingField, handleResult, shuffleArray } = require("../utils");

router.post('/add', async ctx => {
  let data = ctx.request.body
  const positionType = data.positionType
  const careerField = positionType[0]
  const careerAdvantages = positionType[1]
  const competency = positionType[2]
  const quesData = data.quesData
  if (await checkExistingField(questionnireModel, 'competency', competency)) {
    const res = await questionnireModel.update({ careerField, careerAdvantages, quesData, }, {
      where: {
        competency
      },
      raw: true
    })
    if (res.length > 0) {
      ctx.suc("更新成功", { success: true })
    }
    return;
  }

  const [err, newQues] = await to(
    questionnireModel.create({
      careerField,
      careerAdvantages,
      competency,
      quesData,
    })
  )

  handleResult(ctx, err, "添加成功", { success: true })
})

router.post('/get', async ctx => {
  const allQuestionnaires = await questionnireModel.findAll({
    raw: true
  });
  const arr = []
  allQuestionnaires.forEach(item => {
    const { quesData } = item
    for (let i = 0; i < quesData.length; i++) {
      arr.push({
        ...item,
        quesData: quesData[i]
      })
    }
  })
  const questionTypeOne = shuffleArray(arr.filter(item => item.quesData.questionType === 'typeOne'))
  const questionTypeTwo = shuffleArray(arr.filter(item => item.quesData.questionType === 'typeTwo'))
  const questionTypeThree = shuffleArray(arr.filter(item => item.quesData.questionType === 'typeThree'))
  const res = {
    questionTypeOne,
    questionTypeTwo,
    questionTypeThree
  }
  ctx.suc("查询成功", res)
})
module.exports = router.routes()