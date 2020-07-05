const path = require('path')
const fs = require('fs')
const { vueFile, routeConfig } = require('./template')
const write = require('../file/write')
const process = require('process')
const pwdDir = process.cwd()
const viewsDir = path.join(pwdDir, '/src/views')
const componentsDir = path.join(pwdDir, '/src/components')
const log = require('../console_log/index')

module.exports = function(type, name) {

    const tempalteStr = vueFile(name)
    const stategry = {
        view: { pathUrl: path.join(viewsDir, name), dir: viewsDir },
        v: { pathUrl: path.join(viewsDir, name), dir: viewsDir },
        component: { pathUrl: path.join(componentsDir, name), dir: componentsDir },
        c: { pathUrl: path.join(componentsDir, name), dir: componentsDir }
    }
    const check = stategry[type]
    if (fs.existsSync(path.join(check.dir, name))) {
        log('error', 'red', `${name}已存在`)
    } else {
        write(tempalteStr, check.pathUrl, 'index.vue').then(res => {
            log('success', 'green', `创建完毕`)
            if (type === 'view' || type === 'v') {
                console.log(routeConfig(name));
            }   
        })
    }
}