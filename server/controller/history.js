const Router = require("@koa/router")
const {
  default: to
} = require("await-to-js")
const router = new Router
const HistoryModel = require("../model/EvaluateHistory");
const { checkExistingField, handleResult, randomArray } = require("../utils");

router.post('/add', async ctx => {
  const data = ctx.request.body

  const [err, newHistory] = await to(
    HistoryModel.create({
      ...data
    })
  );
  handleResult(ctx, err, "添加成功", { success: true })
})

router.post('/get', async ctx => {
  const allQuestionnaires = await questionnaireModel.findAll({
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