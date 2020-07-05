const path = require('path')
const process = require('process')
const astEscodegen = require('../../ast/escodegen')
const astParseModule = require('../../ast/esprima')
const astTraverse = require('../../ast/estraverse')
const { 
  programBodyTemplate,
  exportsVarTemplate,
  exportObjectTemplate,
  keyValueTemplate,
  keyValuerequireTemplate,
  importTemplate,
  es6ExportTemplate,
  templateStrTemplate
} = require('../../ast/template') 
const hump = require('./hump')
const read = require('../../file/read')
const write = require('../../file/write')
const cwdDir = process.cwd()
const configDir = path.join(cwdDir, 'src/config')

function readDataToVueCofig() {
  const keyValuerequireAst = keyValuerequireTemplate('proxy', './proxy.config.js')
  read(path.join(cwdDir, 'vue.config.js')).then(res => {
    const vueConfigAst = astParseModule(res)
    astTraverse(vueConfigAst, {
      leave(node, partNode) {
        if (node.name === 'devServer') {
          partNode.value.properties = [keyValuerequireAst]
        }
      }
    })
    write(astEscodegen(vueConfigAst), cwdDir, 'vue.config.js')
  })
}

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
  async setRestUrlFile({serverName, paths}) {
    const name = hump(serverName)
    let body = []
    // 引入config.js
    const importAst = importTemplate([name], './config.js')
    body[0] = importAst
    const pathsObjAst = keyValueTemplate(formatPaths(paths))
  
    const exportDefaultAst = es6ExportTemplate(pathsObjAst)
    const program = programBodyTemplate(body)
    astTraverse(program, {
      leave(node) {
        if (node.sourceType === 'module') {
          node.body = [...body, exportDefaultAst]
        }
      }
    })
    astTraverse(program, {
      leave(node) {
        if (node.type === 'Property') { 
          if (node.value.type !== 'ObjectExpression') {
            const oldValue = node.value.value
            node.value = templateStrTemplate(name, oldValue)
          }
        }
      }
    })
    write(astEscodegen(program), configDir, `${name}.js`)
  },
  // 服务代理配置文件
  async setProxyConfigFile({serverUrl, serverName}) {
    let proxy = {}
    let body = []
    let mark = false
    // 获取文件已有内容并转为ast
    try {
      const fileData = await read(path.join(cwdDir, 'proxy.config.js'))
      const AST = astParseModule(fileData)
      mark = fileData === '' ? false : true
      body = AST.body
    } catch (error) {
      
    }
    const keyName = `/${serverName}`
    proxy[keyName] = {
      target: `http://${serverUrl}/${serverName}`,
      changeOrgin: true,
    }
    let kvAst = keyValueTemplate(proxy)
    const program = programBodyTemplate(body)
    let isExists = false
    astTraverse(program, {
      enter() {},
      leave(node) {
        if (node.type === 'AssignmentExpression') {
          isExists = true
          let index = node.right.properties.findIndex(item => item.key.value === keyName)
          if (index !== -1) {
            node.right.properties[index] = kvAst[index]
          } else {
            node.right.properties.push(...kvAst)
          }
        }
        if (node.sourceType === 'module') {
          if (!isExists) {
            node.body = [...body, exportObjectTemplate(kvAst)]
          }
        }
      }
    })
    write(astEscodegen(program), cwdDir, 'proxy.config.js').then(res => {
      if (res === 'success' && !mark) {
        readDataToVueCofig()
      }
    })
  },
  // 请求方法文件
  async setServiceFile() {}
}



// 格式化paths
function formatPaths(paths, name) {
  let result = {}
  for (const key in paths) {
    let path = paths[key]
    let obj = {}
    for (const tag of path.tagName) {
      const pathArr = tag.path.split('/')
      pathKey = pathArr[pathArr.length - 1]
      obj[pathKey] = tag.path
    }
    result[hump(key)] = obj
  }
  return result
}