const Koa = require('koa')
const app = new Koa()
const config = require('./utils/config')
const router = require("./server/router")
//新增
const response = require("./server/middleware/response")
const bodyParser = require('koa-bodyparser')
const cors = require("koa2-cors")
const http = require('http');
app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (ctx.method == 'OPTIONS') {
        ctx.body = 200;
    } else {
        await next();
    }
});
// 解决跨域

app.use(cors())
//引入koa-bodyparser
app.use(bodyParser())
app.use(response())
app.use(router)
//监听端口号
app.listen(config.port, () => {
    console.log(`listening on ${config.port}`);
})

const importGlobal = require("./utils")
importGlobal()