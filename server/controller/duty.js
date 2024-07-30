const Router = require("@koa/router")
const {
  default: to
} = require("await-to-js")
const router = new Router
const dutyModel = require("../model/Duty");
const { handleResult } = require("../utils");

router.post('/addDuty', async ctx => {
  const data = ctx.request.body

  const [err] = await to(
    dutyModel.create(data)
  );
  handleResult(ctx, err, "添加成功", { success: true })
})

router.post('/getDuty', async ctx => {
  const data = ctx.request.body;
  // 构建过滤条件
  let where = {};
  if (data.department) {
    where.department = data.department;
  }
  if (data.position) {
    where.position = data.position;
  }

  const [err, allDutys] = await to(
    dutyModel.findAll({
      where,
      raw: true
    })
  );

  if (err) return ctx.err("操作失败", err);
  ctx.suc("查询成功", allDutys);
});

router.post('/deleteDuty', async ctx => {
  const data = ctx.request.body
  const { duty_id } = data

  const [err, allDutys] = await to(
    dutyModel.destroy({
      where: { id: duty_id },
      raw: true
    })
  );

  if (err) return ctx.err("操作失败", err);
  ctx.suc("删除成功", allDutys);
});

router.post('/updateDuty', async ctx => {
  const data = ctx.request.body
  const { department, subDepartment, position, corrFunc } = data
  console.log("🚀 ~ data:", data)

  const res = await dutyModel.update({ department, subDepartment, position, corrFunc }, {
    where: {
      id: data.id
    },
    raw: true
  })
  console.log("🚀 ~ res:", res)

  // if (err) return ctx.err("操作失败", err);
  ctx.suc("更新成功", {});
});

router.post('/getAllDepartmentAndPosition', async ctx => {
  const departmentSet = new Set()
  const positionSet = new Set()
  const [err, allDutys] = await to(
    dutyModel.findAll({
      raw: true
    })
  );
  for (let item of allDutys) {
    departmentSet.add(item.department)
    positionSet.add(item.position)
  }
  const departmentArr = [...departmentSet]
  const positionArr = [...positionSet]
  const departmentObj = departmentArr.map(item => {
    return { value: item }
  })
  const positionObj = positionArr.map(item => {
    return { value: item }
  })
  ctx.suc("查询成功", { allDepartment: departmentObj, allPosition: positionObj });
})

router.post('/getEvaluteFormData', async ctx => {
  const [err, allDutys] = await to(
    dutyModel.findAll({
      raw: true
    })
  );
  function convertSubdepartment(allDutys) {
    const result = {};
    for (const item of allDutys) {
      if (item.subDepartment) {
        if (result[item.department]) {
          if (result[item.department].every(subItem => subItem.label !== item.subDepartment)) {
            result[item.department].push({
              label: item.subDepartment,
              value: item.subDepartment
            })
          }
        } else {
          result[item.department] = []
          result[item.department].push({
            label: item.subDepartment,
            value: item.subDepartment
          })
        }
      }
    }
    return result;
  }
  const subDepartmentObj = convertSubdepartment(allDutys)
  function convertDepartment(allDutys) {
    const result = {};
    for (const item of allDutys) {
      if (result[item.department]) {
        const obj = {
          岗位名称: item.position,
          对应职能: item.corrFunc
        }
        result[item.department].push({
          label: item.position,
          value: JSON.stringify(obj)
        })
      } else {
        result[item.department] = []
        const obj = {
          岗位名称: item.position,
          对应职能: item.corrFunc
        }
        result[item.department].push({
          label: item.position,
          value: JSON.stringify(obj)
        })
      }
    }
    return result;
  }
  const departmentObj = convertDepartment(allDutys)
  function allDepartment(allDutys) {
    const departmentSet = new Set()
    for (let item of allDutys) {
      departmentSet.add(item.department)
    }
    const departmentArr = [...departmentSet]
    const departmentObjArr = departmentArr.map(item => {
      return { value: item, label: item }
    })
    return departmentObjArr
  }
  const departmentObjArr = allDepartment(allDutys)
  ctx.suc("查询成功", { subDepartmentObj, departmentObj, departmentObjArr });
})

module.exports = router.routes()
