const path = require('path')
const { spawn } = require('child_process')
const process = require('process')

const cwdPath = process.cwd()

module.exports = function (projectName, callback) {
    const ls = spawn('npm', ['i'], {
        cwd: path.join(cwdPath, projectName),
        shell: true
    })

    ls.stdout.on('data', (data) => {
        console.log(data.toString());
    });

    ls.stderr.on('data', (data) => {
        console.log(data.toString());
        callback(data)
    })

    ls.on('close', (code) => {
        callback('success')
    })
}