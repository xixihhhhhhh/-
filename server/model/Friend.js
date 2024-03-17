const { DataTypes } = require("sequelize")
const db = require("../database")

const Friend = db.define(
    "friend",//数据库的表名
    {
        //设置表的属性
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            notNull: true,
            autoIncrement: true
        },
        user_id: DataTypes.INTEGER,
        friend_id: DataTypes.INTEGER,
        delete_flag: DataTypes.TINYINT,
        friend_name: DataTypes.STRING,
        friend_avatar_url: DataTypes.STRING,
    },
    {
        timestamps: true,
        createdAt: "create_time",
        updatedAt: "update_time",
    }
)

module.exports = Friend
