const fs = require('fs')

function writeFile(data, path, fileName) {
  return new Promise((reslove, reject) => {
    // 首先创建目录
    if (fs.existsSync(path)) {
      fs.writeFile(`${path}/${fileName}`, data, err => {
        if (err) {
          reject('fail')
          throw err
        }
        reslove('success')
      })
    } else {
      fs.mkdir(path, { recursive: true }, err => {
        if (err) throw err
        fs.writeFile(`${path}/${fileName}`, data, err => {
          if (err) {
            reject('fail')
            throw err
          }
          reslove('success')
        })
      })   
    }
    
  })
}
module.exports = writeFile