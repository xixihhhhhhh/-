const { DataTypes } = require("sequelize")
const db = require("../database")

const Duty = db.define(
    "duty",//数据库的表名
    {
        //设置表的属性
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            notNull: true,
            autoIncrement: true
        },
        department: DataTypes.STRING,
        subDepartment: DataTypes.STRING,
        position: DataTypes.STRING,
        corrFunc: DataTypes.STRING
    },
    {
        timestamps: true,
        createdAt: "create_time",
        updatedAt: "update_time",
    }
)

module.exports = Duty
