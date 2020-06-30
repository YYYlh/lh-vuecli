const fs = require('fs')
function readFile(path) {
  console.log(path);
  return new Promise((reslove, reject) => {
    fs.readFile(path, (err, data) => {
      console.log('err: ', err);
      
      if (err) {
        reject('fail')
      } else {
        reslove(data.toString())
      }
    })
  })
}

module.exports = readFile