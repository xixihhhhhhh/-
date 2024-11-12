const { DataTypes } = require("sequelize")
const db = require("../database")

const Answer = db.define(
  "answer",//数据库的表名
  {
    //设置表的属性
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      notNull: true,
      autoIncrement: true
    },
    phone: DataTypes.STRING,
    question1: DataTypes.STRING,
    question2: DataTypes.STRING,
    question3: DataTypes.STRING,
    answer1: DataTypes.STRING,
    answer2: DataTypes.STRING,
    answer3: DataTypes.STRING,
  },
  {
    timestamps: true,
    createdAt: "create_time",
    updatedAt: "update_time",
  }
)

module.exports = Answer
