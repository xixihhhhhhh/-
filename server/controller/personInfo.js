const Router = require("@koa/router")
const {
  default: to
} = require("await-to-js")
const router = new Router()
const personInfoModel = require("../model/PersonInfo")
const userModel = require("../model/User")
const answerModel = require("../model/Answer")

router.post('/setPersonMsg', async ctx => {
  let data = ctx.request.body
  const { userId, personMsg, career, work, borrow, rewards, professional, annual } = data
  const [err, PersonInfo] = await to(
    personInfoModel.findOne({
      raw: true,
      where: {
        userId
      }
    })
  );
  if (PersonInfo) {
    userModel.update({ isProfileCompleted: true }, {
      where: {
        id: userId
      },
      raw: true
    })
    personInfoModel.update({ personMsg, career, work, borrow, rewards, professional, annual }, {
      where: {
        userId
      },
      raw: true
    })
    ctx.suc("修改成功", { success: true });
  } else {
    const [err1] = await to(
      personInfoModel.create({
        ...data
      })
    )
    userModel.update({ isProfileCompleted: true }, {
      where: {
        id: userId
      },
      raw: true
    })
    if (err1) {
      ctx.err("设置失败", { success: false });
      console.log('err', err1);
    } else {
      console.log('添加成功');
      ctx.suc("设置成功", { success: true });
    }
  }
})

router.post('/getPersonMsg', async ctx => {
  let data = ctx.request.body
  const { userId } = data
  const [err, personInfo] = await to(
    personInfoModel.findOne({
      where: {
        userId
      }
    })
  )
  if (err) {
    ctx.err("添加失败", err);
    console.log('err', err);
  } else {
    ctx.suc("添加成功", personInfo);
  }
})

router.post('/getPersonHasSetPassQues', async ctx => {
  let data = ctx.request.body
  const { userId } = data
  console.log("🚀 ~ userId:", userId)
  const [err, userInfo] = await to(
    userModel.findOne({
      where: {
        id: userId
      }
    })
  )
  if (err) {
    ctx.err("查询失败！", err)
  }
  const phone = userInfo.dataValues.phone
  const [err1, answerInfo] = await to(
    answerModel.findOne({
      where: {
        phone
      }
    })
  )
  if (err1) {
    ctx.err("查询失败！", err)
  }
  if (answerInfo) {
    ctx.suc("查询成功!", { success: true });
  } else {
    ctx.suc("查询成功!", { success: false });
  }
})

module.exports = router.routes()
