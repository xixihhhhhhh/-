/*config.js*/

//全局配置文件
const config = {
    baseUrl: '',//配置的域名
    port: 3001,//api访问的端口
    tokenSecret: "CXH",//token的加密
    wsPort: 3100,//WebSocket的端口号

    //数据库相关的配置
    db: {
        database: "talent",//数据库名称
        username: 'root',//mysql用户名
        password: '123456',//mysql密码
        port: '3306',//mysql端口号
        host: 'localhost',//服务器ip
    },
}
//导出一整个模块
module.exports = config
