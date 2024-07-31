const { DataTypes } = require("sequelize")
const db = require("../database")

const User = db.define(
    "user",//数据库的表名
    {
        //设置表的属性
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            notNull: true,
            autoIncrement: true
        },
        name: DataTypes.STRING,
        password: DataTypes.INTEGER,
        email: DataTypes.STRING,
        sex: DataTypes.BOOLEAN,
        roles: DataTypes.STRING,
        avatar: DataTypes.STRING,
        hasUnFinish: DataTypes.BOOLEAN,
        firstWenJuanAnswer: DataTypes.JSON,
        secondWenJuanQuestion: DataTypes.JSON,
        corrFunc: DataTypes.STRING,
        canTest: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    },
    {
        timestamps: true,
        createdAt: "createTime",
        updatedAt: "updateTime",
    }
)

module.exports = User