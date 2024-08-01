const Router = require("@koa/router")
const {
  default: to
} = require("await-to-js")
const router = new Router
const historyModel = require("../model/EvaluateHistory");
const userModel = require("../model/User")
const { handleResult } = require("../utils");

router.post('/add', async ctx => {
  const data = ctx.request.body
  const { user_id } = data

  const [err1, user] = await to(
    userModel.findOne({
      where: {
        id: user_id
      }
    })
  );
  if (user.dataValues.canTest) {
    const [err2, res] = await to(
      userModel.update({ canTest: false }, {
        where: {
          id: user_id,
        },
        raw: true
      })
    );
    const [err] = await to(
      historyModel.create({
        ...data
      })
    );
  } else {
    await to(
      historyModel.update({ ...data }, {
        where: {
          user_id,
        },
        raw: true
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

  // 构建过滤条件
  let where = {};
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

  if (filteredObj.sortOrder !== '') {
    if (filteredObj.sortOrder === '升序') {
      allHistory.sort((a, b) => {
        return new Date(a.finishTime) - new Date(b.finishTime);
      });
    } else {
      allHistory.sort((a, b) => {
        return new Date(b.finishTime) - new Date(a.finishTime);
      });
    }
  }

  if (err) return ctx.err("操作失败", err);
  ctx.suc("查询成功", allHistory);
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

  if (filteredObj.sortOrder !== '') {
    if (filteredObj.sortOrder === '升序') {
      allHistory.sort((a, b) => {
        const dateA = new Date(a.finishTime);
        const dateB = new Date(b.finishTime);
        return dateA - dateB;
      });
    } else {
      allHistory.sort((a, b) => {
        const dateA = new Date(a.finishTime);
        const dateB = new Date(b.finishTime);
        return dateB - dateA;
      });
    }
  }

  if (err) return ctx.err("操作失败", err);
  ctx.suc("查询成功", allHistory);
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
  const result = {
    "行政办公": [
      4.693548387,
      4.5,
      4.516129032,
      4.677419355,
      3.822580645,
      4.322580645,
      4.112903226,
      4.5,
      4.370967742,
      4.290322581,
      4.774193548,
      4.774193548,
      4.370967742,
      4.419354839,
      4.290322581,
      4.596774194,
      4.274193548,
      4.258064516,
      4.774193548,
      4.693548387,
      4.387096774,
      4.661290323,
      4.35483871,
      3.935483871,
      4.596774194,
      3.967741935,
      4.032258065,
      4.467741935,
      4.516129032,
      4.5,
      4.209677419,
      4.709677419,
      4.370967742,
      4.161290323,
      4.596774194,
      4.306451613,
      4.483870968,
      3.967741935,
    ],
    "后勤（含物资管理）": [
      4.428571,
      4.285714,
      4.178571,
      4.607143,
      3.5,
      4.5,
      4.428571,
      4.285714,
      4.428571,
      3.964286,
      4.428571,
      4.535714,
      4.285714,
      4.321429,
      4.357143,
      4.25,
      4.071429,
      4,
      4.464286,
      4.428571,
      4.428571,
      4.428571,
      4.357143,
      4.214286,
      4.928571,
      4.142857,
      4.178571,
      4.357143,
      4.464286,
      4.321429,
      4.214286,
      4.428571,
      4.392857,
      4.214286,
      4.428571,
      4.142857,
      4.428571,
      3.964286,
    ],
    "工会、党群管理": [
      4.583333,
      4.833333,
      4.083333,
      4.583333,
      4.25,
      4.416667,
      4.333333,
      4.75,
      4.25,
      4.333333,
      5,
      4.75,
      4.5,
      4.75,
      4.583333,
      4.583333,
      4,
      4.166667,
      4.916667,
      5,
      4.416667,
      4.75,
      4.416667,
      3.666667,
      4.5,
      4.25,
      4.25,
      4.5,
      4.583333,
      4.75,
      4.333333,
      4.583333,
      4.833333,
      3.833333,
      4.5,
      4.416667,
      4.583333,
      4.416667,
    ],
    '信息化建设与管理': [
      4.5,
      4.75,
      4.75,
      4.75,
      4,
      4.625,
      4.25,
      4.75,
      4.75,
      4.625,
      4.875,
      4.875,
      4.5,
      4.75,
      4.125,
      4.625,
      4.75,
      4.75,
      4.875,
      4.75,
      4.75,
      4.625,
      4.625,
      3.625,
      4.625,
      4.625,
      4.5,
      4.5,
      4.75,
      4.75,
      4.75,
      4.5,
      4.625,
      4,
      4.75,
      4.625,
      4.875,
      4.75
    ],
    '财务管理': [
      4,
      5,
      4,
      5,
      2.5,
      3.5,
      3.75,
      4.5,
      4,
      4.5,
      4.75,
      5,
      4,
      5,
      4.25,
      4.75,
      4.25,
      4.5,
      4.75,
      5,
      4.25,
      4.5,
      3.75,
      4,
      4,
      4,
      3.75,
      4.5,
      4.75,
      5,
      3.75,
      4.5,
      4.25,
      4.25,
      4.75,
      4.5,
      5,
      4.25
    ],
    '人力资源管理': [
      4.45,
      4.55,
      4.3,
      4.7,
      3.2,
      4.05,
      4.1,
      4.55,
      4.15,
      4.4,
      4.8,
      4.9,
      4.5,
      4.4,
      4.2,
      4.55,
      4.25,
      4.35,
      4.85,
      4.8,
      4.3,
      4.75,
      4.15,
      3.95,
      4.35,
      4,
      4,
      4.35,
      4.55,
      4.5,
      4.1,
      4.65,
      4.65,
      3.7,
      4.7,
      4.55,
      4.4,
      4.15
    ],
    '整顿规范（流程）': [
      4.54,
      4.60,
      4.48,
      4.61,
      3.66,
      4.34,
      4.40,
      4.53,
      4.57,
      4.30,
      4.75,
      4.80,
      4.39,
      4.59,
      4.34,
      4.59,
      4.41,
      4.40,
      4.72,
      4.71,
      4.46,
      4.60,
      4.24,
      4.10,
      4.73,
      4.32,
      4.25,
      4.58,
      4.51,
      4.58,
      4.38,
      4.56,
      4.50,
      4.26,
      4.59,
      4.50,
      4.55,
      4.18
    ],
    '法律事务': [
      5,
      5,
      5,
      5,
      4.75,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      3.75,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      3,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      4.75,
      5,
      5,
      5,
      5
    ],
    '质量管理（产品）': [
      4.5,
      5,
      4.25,
      4.75,
      4.25,
      4.5,
      4.5,
      4.5,
      4.75,
      4.25,
      4.75,
      5,
      4.5,
      4.5,
      4.5,
      4.5,
      4.5,
      4.5,
      4.75,
      4.75,
      4.75,
      5,
      5,
      3.25,
      4.75,
      4.5,
      4.5,
      4.5,
      4.5,
      4.75,
      4,
      4.5,
      4.75,
      4,
      4.5,
      4.25,
      4.5,
      4.5
    ],
    '营销管理': [
      4.732142857,
      4.723214286,
      4.5625,
      4.745535714,
      3.897321429,
      4.508928571,
      4.388392857,
      4.696428571,
      4.526785714,
      4.571428571,
      4.84375,
      4.852678571,
      4.633928571,
      4.674107143,
      4.169642857,
      4.709821429,
      4.522321429,
      4.535714286,
      4.821428571,
      4.821428571,
      4.620535714,
      4.696428571,
      4.464285714,
      4.017857143,
      4.633928571,
      4.316964286,
      4.352678571,
      4.620535714,
      4.723214286,
      4.723214286,
      4.5,
      4.785714286,
      4.723214286,
      4.741071429,
      4.678571429,
      4.691964286,
      4.705357143,
      4.334821429
    ],
    '物流管理': [
      4.572917,
      4.546441,
      4.369792,
      4.515625,
      3.848958,
      4.416667,
      4.666667,
      4.472222,
      4.555556,
      4.458333,
      4.663194,
      4.65625,
      4.427083,
      4.613596,
      4.680556,
      4.65625,
      4.385417,
      4.458333,
      4.663194,
      4.684028,
      4.5625,
      4.609375,
      4.215278,
      4.697917,
      4.765625,
      4.114583,
      4.208333,
      4.295139,
      4.649306,
      4.609375,
      4.34375,
      4.602083,
      4.555556,
      4.302083,
      4.59375,
      4.447917,
      4.604167,
      4.236111
    ],
  }
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
    scores.push(competencyObj.flexible)
    scores.push(competencyObj.theory)
    scores.push(competencyObj.message)
    scores.push(competencyObj.policy)
    scores.push(competencyObj.writing)
    scores.push(competencyObj.holistic)
    scores.push(competencyObj.risk)
    scores.push(competencyObj.study)
    scores.push(competencyObj.find)
    scores.push(competencyObj.create)
    scores.push(competencyObj.dedication)
    scores.push(competencyObj.operationalSkills)
    scores.push(competencyObj.confidentiality)
    scores.push(competencyObj.unimpressed)
    scores.push(competencyObj.norms)
    scores.push(competencyObj.law)
    scores.push(competencyObj.dataAnalysis)
    scores.push(competencyObj.logicalAnalysis)
    scores.push(competencyObj.implementation)
    scores.push(competencyObj.patience)
    scores.push(competencyObj.hard)
    scores.push(competencyObj.time)
    scores.push(competencyObj.plan)
    scores.push(competencyObj.firm)
    scores.push(competencyObj.safe)
    scores.push(competencyObj.intimidate)
    scores.push(competencyObj.leadingOthers)
    scores.push(competencyObj.political)
    scores.push(competencyObj.organizational)
    scores.push(competencyObj.coordination)
    scores.push(competencyObj.rallying)
    scores.push(competencyObj.aggressive)
    scores.push(competencyObj.underPressure)
    scores.push(competencyObj.serviceMinded)
    scores.push(competencyObj.selfControl)
    scores.push(competencyObj.approachable)
    scores.push(competencyObj.teamwork)
    scores.push(competencyObj.employPeople)
    return scores
  }

  const users = []
  for (let i = 0; i < allHistory.length; i++) {
    const { competencyObj, name, user_id, department, subDepartment, position, finishTime, reportTruth } = allHistory[i]
    const scroes = pushArr(competencyObj)
    const mathcSocre = getMatchScores(scroes, result[corrFunc])
    const [err1, user] = await to(
      userModel.findOne({
        where: {
          id: user_id
        }
      })
    );
    users.push({
      match: mathcSocre + '%',
      name,
      email: user.dataValues.email,
      department,
      subDepartment,
      position,
      finishTime,
      reportTruth,
    })
  }
  if (sortOption === '降序') {
    users.sort((a, b) => {
      return parseFloat(b.mathcSocre) - parseFloat(a.mathcSocre);
    });
  } else {
    users.sort((a, b) => {
      return parseFloat(a.mathcSocre) - parseFloat(b.mathcSocre);
    });
  }
  if (err) return ctx.err("操作失败", err);
  ctx.suc("删除成功", users);
});

module.exports = router.routes() 