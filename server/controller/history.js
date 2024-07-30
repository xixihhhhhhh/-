const Router = require("@koa/router")
const {
  default: to
} = require("await-to-js")
const router = new Router
const historyModel = require("../model/EvaluateHistory");
const { handleResult } = require("../utils");

router.post('/add', async ctx => {
  const data = ctx.request.body

  const [err] = await to(
    historyModel.create({
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

module.exports = router.routes() 