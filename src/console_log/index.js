const chalk = require('chalk')
const  logSymbols = require('log-symbols')

module.exports = function(type, color, text) {
    console.log(logSymbols[type], chalk[color](text))
}