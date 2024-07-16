const Router = require("@koa/router")
const {
    default: to
} = require("await-to-js")
const router = new Router

router.post('/test', async ctx => {
    ctx.suc("decoded.data")
})

router.get('/test', async ctx => {
    ctx.suc("decoded.data")
})

router.options('/test', async ctx => {
    ctx.suc("decoded.data")
})

module.exports = router.routes()
