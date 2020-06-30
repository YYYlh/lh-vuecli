const path = require('path')
const process = require('process')
const astEscodegen = require('../../ast/escodegen')
const astParseModule = require('../../ast/esprima')
const astTraverse = require('../../ast/estraverse')
const { programBodyTemplate, exportsVarTemplate } = require('../../ast/template') 
const hump = require('./hump')
const read = require('../../file/read')
const write = require('../../file/write')
const pwdDir = process.cwd()
const configDir = path.join(pwdDir, 'config')

module.exports = {
  // baseUrl文件
  async setConfigFile({serverUrl, serverName}) {
    let body = [];
    // 获取文件已有内容并转为ast
    try {
      const fileData = await read(path.join(configDir, 'config.js'))
      const AST = astParseModule(fileData)
      body = AST.body
    } catch (error) {
      
    }
    const program = programBodyTemplate(body)
    // 看是否有变量名相同的如果有则用新的替换旧的
    // 1.拿到新的变量名
    const newVarName = hump(serverName)
    // 2. 在文件原来的数据中查找
    const value =  `http://${serverUrl}/${serverName}`
    let isExist = false
    astTraverse(program, {
      leave(node) {
        if (node.type === 'VariableDeclaration') {
          if (node.declarations[0].id.name === newVarName) {
            node.declarations[0].init.value = value
            node.declarations[0].init.raw = value
            isExist = true
          }
        }
        if (node.sourceType === 'module') {
          // 已经循环完毕
          if (!isExist) {
            node.body = [...body, exportsVarTemplate(newVarName, value)]
          }
        }
      },
    })
    // 写入config.js文件
    write(astEscodegen(program), configDir, 'config.js')
  },
  // 各个接口地址文件
  async setRestUrlFile() {},
  // 服务代理配置文件
  async setProxyConfigFile() {},
  // 请求方法文件
  async setServiceFile() {}
}