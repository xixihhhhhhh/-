const { DataTypes } = require("sequelize")
const db = require("../database")

const evaluateList = db.define(
  "evaluateList",//数据库的表名
  {
    //设置表的属性
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      notNull: true,
      autoIncrement: true
    },
    userId: DataTypes.INTEGER,
    evaluateList: DataTypes.JSON,
  },
  {
    timestamps: true,
    createdAt: "create_time",
  }
)

module.exports = evaluateList
