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


const { Server } = require('socket.io');
const chatList = [];
const server = http.createServer(app.callback());
const io = new Server(server, {
    serveClient: false,
    cors: {
        origin: '*', // from the screenshot you provided
        methods: ['GET', 'POST'],
    },
});

const chatModel = require("./server/model/Chat")
io.on('connection', (socket) => {
    // 传进来的socket变量为当前本次链接，而io是全局链接
    socket.emit('fresh-message', chatList);
    socket.on('send-message', (user_id, toUser_id, message, name) => {
        chatModel.create({
            user_id,
            toUser_id,
            message,
            name
        })
        chatList.push({
            name,
            user_id,
            message,
        });
        console.log(chatList)
        io.emit('fresh-message', chatList);
    });
});
io.listen(3002);


const importGlobal = require("./utils")
importGlobal()