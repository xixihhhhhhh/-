const { DataTypes } = require("sequelize")
const db = require("../database")

const chatFriend = db.define(
  "history",//数据库的表名
  {
    //设置表的属性
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      notNull: true,
      autoIncrement: true
    },
    user_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    department: DataTypes.STRING,
    subDepartment: DataTypes.STRING,
    position: DataTypes.STRING,
    finishTime: DataTypes.STRING,
    echartOptions: DataTypes.JSON,
  },
  {
    timestamps: true,
    createdAt: "create_time",
  }
)

module.exports = chatFriend
