const astEscodegen= require('../ast/escodegen')
const { importTemplate, programBodyTemplate } = require('../ast/template')
let aaa = importTemplate(['a'], './index.js')
let ast = programBodyTemplate([aaa])
console.log(astEscodegen(ast));
