const Router = require("@koa/router")
const {
  default: to
} = require("await-to-js")
const router = new Router()
const personInfoModel = require("../model/PersonInfo")
const userModel = require("../model/User")

router.post('/setPersonMsg', async ctx => {
  let data = ctx.request.body
  const { userId, personMsg, career, work, borrow, rewards, professional, annual } = data
  console.log("🚀 ~ userId:", userId)
  console.log("🚀 ~ annual:", annual)
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
      ctx.err("添加失败", { success: false });
      console.log('err', err1);
    } else {
      console.log('添加成功');
      ctx.suc("添加成功", { success: true });
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

module.exports = router.routes()
