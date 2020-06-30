// 在这里进行tags和paths的分类
module.exports = function(tags, paths, aliasObj) {
  const result = {}
  for (const item of tags) {
    const name = item.name
    let aliasName = ''
    // 对照别名hash表 有别名的用别名
    if (aliasObj[item.name]) {
      aliasName = aliasObj[item.name]
    } else {
      aliasName = item.name
    }
    result[aliasName] = {
      description: item.description,
      tagName: []
    }
    for (const key in paths) {
      let methond = ''
      if (paths[key].get) {
        methond = 'get'
      } else {
        methond = 'post'
      }
      if (paths[key][methond] && paths[key][methond].tags[0] === name) {
        result[aliasName].tagName.push({
          path: key,
          methond,
          summary: paths[key][methond].summary
        })
      }
    }
  }
  return result
}
