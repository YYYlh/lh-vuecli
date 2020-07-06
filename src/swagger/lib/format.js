const classify = require('./classfiy')
const { log } = require('../../console_log/index')
// 别名映射表
const aliasObj = {}

module.exports = function(apiData, needTags) {
  const serverObj = {} // 保存服务信息
  serverObj.serverName = apiData.basePath.slice(1) // 服务名字
  serverObj.serverUrl = apiData.host // 服务地址
  // 拿到全部tags
  const tags = apiData.tags
  // 拿到所有接口地址paths
  const paths = apiData.paths
  let tempTags = []
  // 首先处理所需api数据
  if (!needTags) {
    tempTags = tags
  } else {
    // 首先判断用户是否有取别名
    let needTagStrs = []
    for (const item of needTags) {
      if (item.includes(':')) {
        //设置别名映射表
        const tag = item.split(':')
        needTagStrs.push(tag[0])
        aliasObj[tag[0]] = tag[1]
      } else {
        needTagStrs.push(item)
      }
    }
    // 判断用户输入所需tag是否存在
    for (const item of needTagStrs) {
      const result = tags.find((r) => r.name === item)
      if (!result) {
        log('error', 'red', `没有该${item}分类`)
        return false
      } else {
        tempTags.push(result)
      }
    }
  }
  serverObj.paths = classify(tempTags, paths, aliasObj)
  return serverObj
}
