const path = require('path')
const fs = require('fs')

// 读取文件夹
module.exports = function (pathUrl) {
    return new Promise((reslove, reject) => {
        fs.readdir(pathUrl, (err, data) => {
            if (err) {
                throw err
            }
            const files = data
            let dirs = []
            for (const file of files) {
                const stat = fs.statSync(path.join(pathUrl, file))
                if (stat.isDirectory()) {
                    dirs.push(file)
                } 
            }
            reslove(dirs)
        })
    })
}