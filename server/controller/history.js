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
    HistoryModel.findAll({
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

module.exports = router.routes() 