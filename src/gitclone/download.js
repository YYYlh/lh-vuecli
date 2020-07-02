const handlebars = require('handlebars')
const inquirer = require('inquirer')
const ora = require('ora')
const chalk = require('chalk')
const  logSymbols = require('log-symbols')
const fs = require('fs')
const npmInstall = require('./npm_install')
const log = require('../console_log/index')

const spainner = ora('初始化模板中......')
const downLoadUrl = 'http://github.com:YYYlh/lh-vuecli-template'
const downLoad = require('download-git-repo')
const { white } = require('chalk')
module.exports = function(projectName) {
    spainner.start() // 下载开始
    downLoad(downLoadUrl, projectName, { clone: true }, (err) => {
        if (err) {
            // 下载失败
            spainner.color = 'red'
            spainner.text = '模板初始化失败'
            spainner.fail()
            return
        }
        // 下载成功
        spainner.color = 'green'
        spainner.text = '模板初始化完成'
        spainner.succeed()
        inquirer.prompt([{
            type: 'input',
            name: 'author',
            message: '请输入作者名称'
        }, {
            type: 'input',
            name: 'description',
            message: '请输入项目简介'
        }]).then((answers) => {
            const packagePath = `${projectName}/package.json`
            const packageContent = fs.readFileSync(packagePath, 'utf-8')
            const packageResult = handlebars.compile(packageContent)({...answers, name: projectName})
            fs.writeFileSync(packagePath, packageResult)
            npmInstall(projectName, (res) => {
                if (res !== 'success') {
                    log('info', 'white', '别急昂！！')
                    return
                }
                log('info', 'blueBright', `cd ${projectName} 开始摸鱼吧`)
            })
        })
    })
}