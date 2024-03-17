//response.js
// 返回值中间件
const response = () => {
    return async (ctx, next) => {
        ctx.empty = (arr) => {
            var isnull = []
            /**
             * POST请求就取body体，GET请求就取query,取出传参的数据并放进数组
             * arr参数为设置哪些非空的字段，然后两个数组比较，缺少哪些必填参数
             */
            const req =
                ctx.request.method == "POST"
                    ? ctx.request.body
                    : ctx.query
            for (let item of arr) {
                if (!req[item]) {
                    isnull.push(item)
                }
            }
            if (isnull.length) {
                ctx.body = {
                    code: -1,
                    message: "缺少参数" + isnull.join("、"),
                }
                return true
            }
            return false
        }
        ctx.suc = (message, result) => {
            ctx.body = { code: 200, message, result }
        }
        ctx.err = (message, err) => {
            ctx.body = {
                code: -1,
                message,
                err: err ? err.toString() : "",
            }
        }
        await next()
    }
}

module.exports = response
