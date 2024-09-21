const Router = require("@koa/router")
const {
  default: to
} = require("await-to-js")
const router = new Router()
const questionnaireModel = require("../model/Questions");
const { checkExistingField, handleResult, randomArray } = require("../utils");

router.post('/add', async ctx => {
  let data = ctx.request.body
  const positionType = data.positionType
  const careerField = positionType[0]
  const careerAdvantages = positionType[1]
  const competency = positionType[2]
  const quesData = data.quesData
  if (await checkExistingField(questionnaireModel, 'competency', competency)) {
    const [_err, res] = await to(
      questionnaireModel.update({ careerField, careerAdvantages, quesData }, {
        where: {
          competency
        },
        raw: true
      })
    )
    if (res.length > 0) {
      ctx.suc("更新成功", { success: true })
    }
    return;
  }

  const [err] = await to(
    questionnaireModel.create({
      careerField,
      careerAdvantages,
      competency,
      quesData,
    })
  )

  handleResult(ctx, err, "添加成功", { success: true })
})

router.post('/get', async ctx => {
  const allQuestionnaires = await questionnaireModel.findAll({
    raw: true
  });
  const arr = []
  allQuestionnaires.forEach(item => {
    const { quesData } = item
    for (const element of quesData) {
      arr.push({
        ...item,
        quesData: element
      })
    }
  })
  const questionTypeOne = randomArray(arr.filter(item => item.quesData.questionType === 'typeOne'))
  const questionTypeTwo = randomArray(arr.filter(item => item.quesData.questionType === 'typeTwo'))
  let questionTypeThree = randomArray(arr.filter(item => item.quesData.questionType === 'typeThree'))
  const repeatCompetency = ['teamwork', 'plan', 'norms']
  questionTypeThree = questionTypeThree.filter(item => {
    if (item.quesData.isRepeat && !repeatCompetency.includes(item.competency)) {
      return
    }
    return item
  })
  const AVARAGENUM = 52
  const firstWenJuan = {
    questionTypeOne,
    questionTypeTwo,
    questionTypeThree: questionTypeThree.slice(0, AVARAGENUM)
  }
  const secondWenJuan = {
    questionTypeThree: questionTypeThree.slice(AVARAGENUM)
  }
  const res = {
    firstWenJuan,
    secondWenJuan,
  }
  ctx.suc("查询成功", res)
})

module.exports = router.routes() 