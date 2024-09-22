const Router = require("@koa/router")
const {
  default: to
} = require("await-to-js")
const router = new Router()
const historyModel = require("../model/EvaluateHistory");
const userModel = require("../model/User")
const personInfoModel = require("../model/PersonInfo")
const { handleResult } = require("../utils");
const { matchingDegreeMap, competencyOrder } = require("../utils/data")

router.post('/add', async ctx => {
  const data = ctx.request.body
  const { user_id } = data

  const [err, user] = await to(
    userModel.findOne({
      where: {
        id: user_id
      }
    })
  );

  // 拿到上半份问卷的答题时间
  const lastHalfSpendTime = user.dataValues.spendTime
  data.spendTime = data.spendTime + lastHalfSpendTime
  await to(
    userModel.update({ canTest: false }, {
      where: {
        id: user_id,
      },
      raw: true
    })
  );

  const [err1, history] = await to(
    historyModel.findOne({
      where: {
        user_id
      }
    })
  );

  if (history) {
    await to(
      historyModel.update({ ...data }, {
        where: {
          user_id,
        },
        raw: true
      })
    );
  } else {
    await to(
      historyModel.create({
        ...data
      })
    );
  }

  handleResult(ctx, err1, "添加成功", { success: true })
})

router.post('/getAllEvaluateHistory', async ctx => {
  const data = ctx.request.body;
  const filteredObj = Object.fromEntries(
    Object.entries(data).filter(([key, value]) => value !== '')
  );

  const {
    department, position, subDepartment, positionLevel: filterPositionLevel, tenure: filterTenure, professional: filterProfessional,
    excellentTimes: filterExcellentTimes, beingCompetentTimes: filterBeingCompetentTimes,
    basicBeingCompetentTimes: filterBasicBeingCompetentTimes, incompetentTimes: filterIncompetentTimes
  } = filteredObj

  // 构建过滤条件
  let where = {};
  if (department) {
    where.department = filteredObj.department;
  }
  if (position) {
    where.position = filteredObj.position;
  }
  if (subDepartment) {
    where.subDepartment = filteredObj.subDepartment;
  }

  // 使用过滤条件查询
  const [err, allHistory] = await to(
    historyModel.findAll({
      where, // 使用过滤条件
      raw: true
    })
  );
  const all = []
  for (let i = 0; i < allHistory.length; i++) {
    const { name, department, position, subDepartment, finishTime, user_id, spendTime } = allHistory[i]
    const res = {
      ...allHistory[i]
    }
    const [err1, personInfo] = await to(personInfoModel.findOne({
      where: {
        userId: user_id
      }
    }))
    if (personInfo) {
      const { personMsg, annual, professional } = personInfo
      if (filterProfessional && !professional.length) {
        continue
      }
      let maxLevel
      if (professional?.length) {
        const levelMap = {
          '一级': 4,
          '二级': 3,
          '三级': 2,
          '四级': 1,
          '五级': 0,
        }
        const level = levelMap[filterProfessional]
        const reverseLevelMap = ['五级', '四级', '三级', '二级', '一级']
        const levelArr = professional.map(item => levelMap[item.level])
        maxLevel = Math.max(...levelArr)
        if (maxLevel < level) {
          continue
        }
        res.professional = reverseLevelMap[maxLevel]
      }
      const { positionLevel, tenure, educationalBackground } = personMsg
      if (positionLevel < filterPositionLevel) {
        continue
      }
      if (tenure < filterTenure) {
        continue
      }
      const { excellentTimes, beingCompetentTimes, basicBeingCompetentTimes, incompetentTimes } = annual
      if (excellentTimes < filterExcellentTimes) {
        continue
      }
      if (beingCompetentTimes < filterBeingCompetentTimes) {
        continue
      }
      if (basicBeingCompetentTimes < filterBasicBeingCompetentTimes) {
        continue
      }
      if (incompetentTimes < filterIncompetentTimes) {
        continue
      }
      res.annual = `${excellentTimes}次优秀 ${beingCompetentTimes}次称职 ${basicBeingCompetentTimes}次基本称职 ${incompetentTimes}次不称职`
      res.positionLevel = positionLevel
      res.tenure = tenure + '年'
      res.educationalBackground = educationalBackground
    }

    all.push(res)
  }

  if (err) return ctx.err("操作失败", err);
  ctx.suc("查询成功", all);
});

router.post('/getPersonalEvaluateList', async ctx => {
  const data = ctx.request.body;
  const filteredObj = Object.fromEntries(
    Object.entries(data).filter(([key, value]) => value !== '')
  );

  // 构建过滤条件
  let where = {
    user_id: data.userId
  };
  if (filteredObj.department) {
    where.department = filteredObj.department;
  }
  if (filteredObj.position) {
    where.position = filteredObj.position;
  }

  // 使用过滤条件查询
  const [err, allHistory] = await to(
    historyModel.findAll({
      where, // 使用过滤条件
      raw: true
    })
  );
  const all = []
  for (let i = 0; i < allHistory.length; i++) {
    const { name, department, position, subDepartment, finishTime, user_id, spendTime } = allHistory[i]
    const res = {
      ...allHistory[i]
    }
    const [err1, personInfo] = await to(personInfoModel.findOne({
      where: {
        userId: user_id
      }
    }))
    if (personInfo) {
      const { personMsg, annual, professional } = personInfo
      if (professional?.length) {
        const levelMap = {
          '一级': 4,
          '二级': 3,
          '三级': 2,
          '四级': 1,
          '五级': 0,
        }
        const reverseLevelMap = ['五级', '四级', '三级', '二级', '一级']
        const levelArr = professional.map(item => levelMap[item.level])
        const maxLevel = Math.max(...levelArr)
        res.professional = reverseLevelMap[maxLevel]
      }
      const { positionLevel, tenure, educationalBackground } = personMsg
      const { excellentTimes, beingCompetentTimes, basicBeingCompetentTimes, incompetentTimes } = annual
      res.annual = `${excellentTimes}次优秀 ${beingCompetentTimes}次称职 ${basicBeingCompetentTimes}次基本称职 ${incompetentTimes}次不称职`
      res.positionLevel = positionLevel
      res.tenure = tenure + '年'
      res.educationalBackground = educationalBackground
    }

    all.push(res)
  }

  if (err) return ctx.err("操作失败", err);
  ctx.suc("查询成功", all);
});

router.post('/deleteEvaluate', async ctx => {
  const data = ctx.request.body;

  // 构建过滤条件
  let where = {
    id: data.id
  };

  // 使用过滤条件查询
  const [err, allHistory] = await to(
    historyModel.destroy({
      where, // 使用过滤条件
      raw: true
    })
  );

  if (err) return ctx.err("操作失败", err);
  ctx.suc("删除成功", { success: true });
});

router.post('/getMatchedUsers', async ctx => {
  const { corrFunc, sortOption } = ctx.request.body;

  // 使用过滤条件查询
  const [err, allHistory] = await to(
    historyModel.findAll({
      raw: true
    })
  );

  function getMatchScores(scoresUniform, requirementsUniform) {
    scoresUniform = scoresUniform.map(item => Number(item) / 20)
    function smoothData(data) {
      const smoothedData = [];

      for (let i = 0; i < data.length; i++) {
        if (i === 0) {
          smoothedData.push((data[i] + data[i + 1]) / 2);
        } else if (i === data.length - 1) {
          smoothedData.push((data[i - 1] + data[i]) / 2);
        } else {
          smoothedData.push((data[i - 1] + data[i] + data[i + 1]) / 3);
        }
      }

      return smoothedData;
    }

    function calculateMatchingPercentage(testerScores, jobRequirements) {
      let distance = 0;
      for (let i = 0; i < testerScores.length; i++) {
        distance += Math.pow(testerScores[i] - jobRequirements[i], 2);
      }
      distance = Math.sqrt(distance);

      const maxDistance = Math.sqrt(testerScores.length * (5.0 ** 2));
      const matchingPercentage = (1 - (distance / maxDistance)) * 100;

      return matchingPercentage;
    }

    const smoothedTesterScoresUniform = smoothData(scoresUniform);
    const smoothedJobRequirementsUniform = smoothData(requirementsUniform);

    const matchingPercentageUniform = calculateMatchingPercentage(smoothedTesterScoresUniform, smoothedJobRequirementsUniform);
    return matchingPercentageUniform.toFixed(2)
  }

  function pushArr(competencyObj) {
    const scores = []

    for (let i = 0; i < competencyOrder.length; i++) {
      scores.push(competencyObj[competencyOrder[i]])
    }
    return scores
  }

  const users = []
  for (let i = 0; i < allHistory.length; i++) {
    const { competencyObj, name, user_id, department, subDepartment, position, finishTime, reportTruth, spendTime } = allHistory[i]
    const scores = pushArr(competencyObj)
    const matchScore = getMatchScores(scores, matchingDegreeMap[corrFunc])
    const [err1, user] = await to(
      userModel.findOne({
        where: {
          id: user_id
        }
      })
    );
    users.push({
      match: matchScore + '%',
      name,
      phone: user.dataValues.phone,
      department,
      subDepartment,
      position,
      finishTime,
      reportTruth,
      spendTime
    })
  }
  if (sortOption === '降序') {
    users.sort((a, b) => {
      return parseFloat(b.matchScore) - parseFloat(a.matchScore);
    });
  } else {
    users.sort((a, b) => {
      return parseFloat(a.matchScore) - parseFloat(b.matchScore);
    });
  }
  if (err) return ctx.err("操作失败", err);
  ctx.suc("查询成功", users);
});

module.exports = router.routes() 