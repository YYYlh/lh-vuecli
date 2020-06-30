const downLoadUrl = 'http://github.com:YYYlh/lh-vuecli-template'
const downLoad = require('download-git-repo')
module.exports = function(projectName, callback) {
    downLoad(downLoadUrl, projectName, { clone: true }, callback)
}