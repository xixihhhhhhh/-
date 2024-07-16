const Router = require("@koa/router")//引入koa-router
const router = new Router()

//引入路由,以后每有一个controller就加多一个路由
//用户获取token等路由
router.use('/user', require("./controller/user"))
router.use('/friend', require("./controller/friend"))
router.use('/question', require("./controller/questions"))
router.use('/comment', require("./controller/comment"))
router.use('/evaluateLists', require("./controller/evaluateList"))

router.use('', require("./controller/chat"))
module.exports = router.routes()
