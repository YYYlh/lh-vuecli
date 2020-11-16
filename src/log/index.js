const chalk = require('chalk')
const logSymbols = require('log-symbols')

function log(text) {
    console.log(text)
}
log.success = function(text) {
    console.log(logSymbols.success, chalk.green(text))
}
log.warning = function(text) {
    console.log(logSymbols.warning, chalk.yellow(text))
}
log.error = function(text) {
    console.log(logSymbols.error, chalk.red(text))
}

// log('hello')
// log.success('success')
// log.warning('warning')
// log.error('error')

module.exports = log