/* index.js */
//全局方法入口
const fs = require('fs');
require('../server/database')

const utils = fs.readdirSync(__dirname);
utils.splice(utils.indexOf('index.js'), 1)

const importGlobal = () => {
    for (let item of utils) {
        let libName = item.replace('.js', '')
        global[libName] = require('./' + item)
    }
}


module.exports = importGlobal
