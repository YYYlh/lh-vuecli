const path = require('path')
const template = require('./template')
const write = require('../file/write')
const process = require('process')
const pwdDir = process.cwd()
const viewsDir = path.join(pwdDir, '/src/views')
const componentsDir = path.join(pwdDir, '/src/components')
module.exports = function(type, name) {
    const tempalteStr = template(name)
    if (type === 'view' || type === 'v') {
        const pathUrl = path.join(viewsDir, `${name}`)
        write(tempalteStr, pathUrl, 'index.vue')
    } else if (type === 'component' || type === 'c') {
        const pathUrl = path.join(componentsDir, `${name}`)
        write(tempalteStr, pathUrl, 'index.vue')
    } else if (type === '') {
        write(tempalteStr, pwdDir, `${name}.vue`)
    }
}