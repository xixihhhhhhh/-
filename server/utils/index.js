async function checkExistingField(model, field, value) {
  const array = await model.findAll({
    where: {
      [field]: value
    },
    raw: true
  });

  if (array.length > 0) {
    return true;
  }

  return false;
}

function handleResult(ctx, err, successMessage, successData) {
  if (err) {
    ctx.err("操作失败", err);
    console.log('err', err);
  } else {
    console.log('成功');
    ctx.suc(successMessage, successData);
  }
}

// 使用动态导入引入 ES 模块
import('pet-breed-names').then(catBreeds => {
  // 获取十个猫的品种英文名称
  const catBreedsEnglish = catBreeds.catBreeds.en.slice(0, 50);
  name = catBreedsEnglish[Math.floor(Math.random() * catBreedsEnglish.length)];
}).catch(err => {
  console.error(err);
});
const axios = require('axios');

let name
async function getImgUrl() {
  const res = await axios.get(
    'https://api.api-ninjas.com/v1/cats?name=' + name,
    {
      headers: { 'X-Api-Key': '2aF+uJZK8sNzm7Wh16vTkg==tPXwgXR0eemCsvI8' },
    });
  if (res.data.length > 0) {
    return res.data[0].image_link
  } else {
    return ''
  }
}

function timeDifference(createdTimeStr) {
  const createdTime = new Date(createdTimeStr);
  const now = new Date();
  const delta = now - createdTime; // 差值是以毫秒为单位的

  // 计算差值的分钟、小时、天数、周数、月数和年数
  const minutes = Math.floor(delta / 60000);
  const hours = Math.floor(delta / 3600000);
  const days = Math.floor(delta / 86400000);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (minutes < 5) {
    return "刚刚";
  } else if (minutes < 60) {
    return "一小时前";
  } else if (hours < 24) {
    return `${hours}小时前`;
  } else if (days < 2) {
    return "一天前";
  } else if (days < 7) {
    return `${days}天前`;
  } else if (weeks < 2) {
    return "一周前";
  } else if (weeks < 4) {
    return `${weeks}周前`;
  } else if (months < 2) {
    return "一月前";
  } else if (months < 12) {
    return `${months}月前`;
  } else if (years < 2) {
    return "一年前";
  } else {
    return `${years}年前`;
  }
}

function isUserCreatedThisMonth(creationTimeStr) {
  const creationTime = new Date(creationTimeStr);
  const now = new Date();

  // 获取创建时间和当前时间的年份和月份
  const creationYear = creationTime.getFullYear();
  const creationMonth = creationTime.getMonth(); // 注意: getMonth() 返回的月份是从0开始的，0代表1月，11代表12月
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  // 判断用户是否是在当前月份创建的
  return creationYear === currentYear && creationMonth === currentMonth;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

module.exports = { checkExistingField, handleResult, getImgUrl, timeDifference, isUserCreatedThisMonth, shuffleArray }