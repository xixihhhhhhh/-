const { DataTypes } = require("sequelize")
const db = require("../database")

const chatFriend = db.define(
    "chat_friend",//数据库的表名
    {
        //设置表的属性
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            notNull: true,
            autoIncrement: true
        },
        name: DataTypes.STRING,
        user_id: DataTypes.INTEGER,
        toUser_id: DataTypes.INTEGER,
        message: DataTypes.STRING,
    },
    {
        timestamps: true,
        createdAt: "create_time",
    }
)

module.exports = chatFriend
