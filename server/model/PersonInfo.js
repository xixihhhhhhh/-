const { DataTypes } = require("sequelize")
const db = require("../database")

const PersonInfo = db.define(
    "personInfo",//数据库的表名
    {
        //设置表的属性
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            notNull: true,
            autoIncrement: true
        },
        userId: DataTypes.INTEGER,
        personMsg: DataTypes.JSON,
        career: DataTypes.JSON,
        work: DataTypes.JSON,
        borrow: DataTypes.JSON,
        rewards: DataTypes.JSON,
        professional: DataTypes.JSON,
        annual: DataTypes.JSON,
    },
    {
        timestamps: true,
        createdAt: "create_time",
        updatedAt: "update_time",
    }
)

module.exports = PersonInfo
