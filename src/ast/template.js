const astEsprima = require('./esprima')
const astTraverse = require('./estraverse')

module.exports = {
  programBodyTemplate(body) {
    return {
      type: "Program",
      body: body,
      sourceType: "module",
    };
  },
  importTemplate(names, source) {
    let specifiers = [];
    if (Object.prototype.toString.call(names) === "[object Array]") {
      specifiers = names.map((name) => ({
        type: "ImportSpecifier",
        local: {
          type: "Identifier",
          name: name,
        },
        imported: {
          type: "Identifier",
          name: name,
        },
      }));
    } else if (typeof names === "string") {
      specifiers = [
        {
          type: "ImportDefaultSpecifier",
          local: {
            type: "Identifier",
            name: names,
          },
        },
      ];
    }
    return {
      type: "ImportDeclaration",
      specifiers: specifiers,
      source: {
        type: "Literal",
        value: source,
        raw: source,
      },
    };
  },
  // 请求方法模板
  exportsFuncTemplate(name, fetchFuncName, params, method, controllerName) {
    return {
      type: "ExportNamedDeclaration",
      declaration: {
        type: "VariableDeclaration",
        declarations: [
          {
            type: "VariableDeclarator",
            id: {
              type: "Identifier",
              name: name,
            },
            init: {
              type: "ArrowFunctionExpression",
              id: null,
              params: [
                {
                  type: "Identifier",
                  name: "params",
                },
              ],
              body: {
                type: "CallExpression",
                callee: {
                  type: "Identifier",
                  name: fetchFuncName,
                },
                arguments: [
                  {
                    type: "MemberExpression",
                    computed: false,
                    object: {
                      type: "MemberExpression",
                      computed: false,
                      object: {
                        type: "Identifier",
                        name: "RESTURL",
                      },
                      property: {
                        type: "Identifier",
                        name: controllerName,
                      },
                    },
                    property: {
                      type: "Identifier",
                      name: name,
                    },
                  },
                  {
                    type: "Identifier",
                    name: params,
                  },
                  {
                    type: "Literal",
                    value: method,
                    raw: method,
                  },
                ],
              },
              generator: false,
              expression: true,
              async: false,
            },
          },
        ],
        kind: "const",
      },
      specifiers: [],
      source: null,
    };
  },
  // 导出变量模板
  exportsVarTemplate(name, value) {
    return {
      type: "ExportNamedDeclaration",
      declaration: {
        type: "VariableDeclaration",
        declarations: [
          {
            type: "VariableDeclarator",
            id: {
              type: "Identifier",
              name,
            },
            init: {
              type: "Literal",
              value,
              raw: value,
            },
          },
        ],
        kind: "const",
      },
    };
  },
  // 导出对象模板
  exportObjectTemplate(obj) {
    return {
      "type": "ExpressionStatement",
      "expression": {
        "type": "AssignmentExpression",
        "operator": "=",
        "left": {
          "type": "MemberExpression",
          "computed": false,
          "object": {
            "type": "Identifier",
            "name": "module"
          },
          "property": {
            "type": "Identifier",
            "name": "exports"
          }
        },
        "right": {
          "type": "ObjectExpression",
          "properties": [
            obj
          ]
        }
      }
    }
  },
  // esmodule导出
  es6ExportTemplate(properties) {
    return {
      "type": "ExportDefaultDeclaration",
      "declaration": {
        "type": "ObjectExpression",
        "properties": properties
      }
    }
  },
  // key-value生成模板
  keyValueTemplate(obj) {
    const code = `let a = ${JSON.stringify(obj)}`
    let program = astEsprima(code)
    astTraverse(program, {
      leave(node) {
        if (node.type === 'Property') {
          // 判断有没有'/' ','
          if (node.key) {
            const value = node.key.value
            const reg = new RegExp("[`~!@#$^&*%()=|{}':;',\\[\\]<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]");
            if (reg.test(value)) {
            } else {
              node.key.type = 'Identifier'
              node.key.name = value
            }
          }
        }
      }
    })
    return program.body[0].declarations[0].init.properties
  },
  // require模板
  keyValuerequireTemplate(keyName, path) {
    return {
      "type": "Property",
      "key": {
        "type": "Identifier",
        "name": keyName
      },
      "computed": false,
      "value": {
        "type": "CallExpression",
        "callee": {
          "type": "Identifier",
          "name": "require"
        },
        "arguments": [
          {
            "type": "Literal",
            "value": path,
            "raw": `${path}`
          }
        ]
      },
      "kind": "init",
      "method": false,
      "shorthand": false
    }
  },
  // 模板字符串模板
  templateStrTemplate(vari, str) {
    return {
      "type": "TemplateLiteral",
      "quasis": [
        {
          "type": "TemplateElement",
          "value": {
            "raw": "",
            "cooked": ""
          },
          "tail": false
        },
        {
          "type": "TemplateElement",
          "value": {
            "raw": str,
            "cooked": str
          },
          "tail": true
        }
      ],
      "expressions": [
        {
          "type": "Identifier",
          "name": vari
        }
      ]
    }
  }
};
