/*token.js*/
//用于接口进来检验token
const jwt = require('jsonwebtoken')

const verifyToken = async (ctx, next) => {
    let url = ctx.request.url.split('?')[0]
    //以下接口不校验token
    let url_config = [
        '/user/getToken',
    ]

    //检测是否在不校验接口列表中
    let changer = url_config.some((item) => {
        return item == url
    })

    if (changer) {
        //不检验token
        await next()
    } else {
        //检测token,当请求头携带token和userId时才通过
        let token = ctx.request.headers["authorization"]
        let userId = ctx.request.headers["userid"]
        if (token && userId) {
            let payload = jwt.verify(token, 'CHEN', async (err, decode) => {
                if (err) {
                    if (err.name == 'TokenExpiredError') {
                        ctx.body = {
                            code: decode,
                            message: 'token已过期'
                        }
                    } else if (err.name == 'JsonWebTokenError') {
                        ctx.body = {
                            code: decode,
                            message: '无效的token'
                        }
                    }
                } else {
                    if (decode.userId != userId) {
                        ctx.body = {
                            code: decode,
                            message: '用户ID不正确'
                        }
                    } else {
                        await next()
                    }
                    // await next()
                }
            })
        } else {
            ctx.body = {
                code: 1000,
                message: '登录信息已过期'
            }
        }
    }
}
module.exports = verifyToken
