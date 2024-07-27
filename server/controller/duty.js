const Router = require("@koa/router")
const {
  default: to
} = require("await-to-js")
const router = new Router
const DutyModel = require("../model/Duty");
const { handleResult } = require("../utils");

router.post('/add', async ctx => {
  const data = ctx.request.body

  const [err] = await to(
    DutyModel.create({
      ...data
    })
  );
  handleResult(ctx, err, "添加成功", { success: true })
})

router.post('/get', async ctx => {
  const [err, allDutys] = await to(
    DutyModel.findAll({
      raw: true
    })
  );

  if (err) return ctx.err("操作失败", err);
  ctx.suc("查询成功", allDutys);
});


module.exports = router.routes() 