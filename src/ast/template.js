module.exports = {
  programBodyTemplate(body) {
    return {
      type: "Program",
      body: body,
      sourceType: "module",
    };
  },
  importTemplate(names, source) {
    if (Object.prototype.toString.call(names) !== "[object Array]") {
      return;
    }
    let specifiers = names.map((name) => ({
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
};
