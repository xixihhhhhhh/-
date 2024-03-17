const { DataTypes } = require("sequelize")
const db = require("../database")

const Comment = db.define(
    "comment",//数据库的表名
    {
        //设置表的属性
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            notNull: true,
            autoIncrement: true
        },
        name: DataTypes.STRING,
        content: DataTypes.STRING,
        avatar: DataTypes.STRING,
    },
    {
        timestamps: true,
        createdAt: "create_time",
        updatedAt: "update_time",
    }
)

module.exports = Comment
