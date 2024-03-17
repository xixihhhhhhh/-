/*auth.js*/
const jwt = require("jsonwebtoken")//引入jwt
const config = require('../../utils/config')

var auth = {
    createToken(userId) {
        //根据userId生成token,设定规则
        //时间戳的过期时间单位都为秒
        const payload = {
            userId,
            //获取当前时间
            time: Math.round(new Date() / 1000),
            //过期时间
            timeout: 60 * 60
        }
        // expiresIn过期时间,单位为秒
        //jwt.sign('规则','加密名字','过期时间','箭头函数')
        const token = jwt.sign(payload, config.tokenSecret, { expiresIn: 60 * 60 })
        return token
    },
    verifyToken(allowUrl) {
        return async (ctx, next) => {
            if (
                allowUrl.indexOf(ctx.request.url) == -1 &&
                ctx.request.url.split("/")[1] != "doc"
            ) {
                if (!ctx.request.header.token) {
                    ctx.body = { code: 110, message: "token无效" }
                    return
                }
                try {
                    const token = ctx.request.header.token
                    const payload = jwt.verify(
                        token,
                        config.tokenSecret
                    )
                    if (
                        payload.time + payload.timeout <
                        new Date().getTime()
                    ) {
                        ctx.body = { code: 111, message: "token过期" }
                        return
                    }

                    ctx.request.header.userId = payload.userId
                    await next()
                } catch (err) {
                    ctx.body = {
                        code: 110,
                        message: "token无效",
                        err: err.toString(),
                    }
                    return
                }
            } else {
                await next()
            }
        }
    },
}
module.exports = auth
