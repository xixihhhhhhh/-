const fs = require('fs');
const lib = fs.readdirSync(__dirname + '/model');
var models = {}
for (let item of lib) {
    let model = item.replace('.js', '')
    models[model] = require('./model/' + item)
    console.log(item);
}

const association = () => { }

module.exports = association