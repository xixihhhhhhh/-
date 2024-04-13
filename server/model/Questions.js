const { DataTypes } = require("sequelize")
const db = require("../database")

const Questions = db.define(
  "questions",//数据库的表名
  {
    //设置表的属性
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      notNull: true,
      autoIncrement: true
    },
    careerField: DataTypes.STRING,
    careerAdvantages: DataTypes.STRING,
    competency: DataTypes.STRING,
    quesData: DataTypes.JSON,
  },
  {
    timestamps: true,
    createdAt: "create_time",
    updatedAt: "update_time",
  }
)

module.exports = Questions
