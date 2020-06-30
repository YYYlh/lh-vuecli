const fs = require('fs')
function readFile(path) {
  return new Promise((reslove, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        reject('fail')
      } else {
        reslove(data.toString())
      }
    })
  })
}

module.exports = readFile