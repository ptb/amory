//

const {getCurrentLocation} = require('../babel-types');

function addLocToAst(_ast, line = getCurrentLocation().start.line) {
  const ast = _ast;
  if (ast.loc) {
    ast.loc = {
      start: {line: line + ast.loc.start.line - 1, column: 0},
      end: {line: line + ast.loc.end.line - 1, column: 0},
    };
    Object.keys(ast).forEach(key => {
      if (Array.isArray(ast[key])) {
        ast[key].forEach(n => addLocToAst(n, line));
      } else if (ast[key] && typeof ast[key] === 'object') {
        addLocToAst(ast[key], line);
      }
    });
  }
}
module.exports = addLocToAst;
