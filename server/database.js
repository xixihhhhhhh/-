const { Sequelize } = require("sequelize")
const config = require("../utils/config")
const to = require('../utils/to')

module.exports = db = new Sequelize(
    config.db.database,
    config.db.username,
    config.db.password,
    {
        host: config.db.host,
        dialect: "mysql",
        timezone: "+08:00",
        dialectOptions: {
            dateStrings: true,
            typeCast: true,
        },
        define: {
            freezeTableName: true, //Model名与表名相同
        },
        logging: false,
    }
)
async function sync() {
    console.log("正在同步模型")
    const [err, res] = await to(db.sync({ alter: true }))
    if (err) {
        console.log(err)
    }

    const association = require("./association")
    association()
    console.log("同步模型完成")
}
sync()
