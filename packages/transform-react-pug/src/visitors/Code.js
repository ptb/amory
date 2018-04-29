//

const parseExpression = require('../utils/parse-expression');
const parseStatement = require('../utils/parse-statement');

const t = require('../babel-types');

function visitBufferedCode(node, context) {
  return parseExpression(node.val, context);
}

function declareProperty(kind, prop, context) {
  switch (prop.type) {
    case 'RestProperty':
      return {...prop, argument: declareLVal(kind, prop.argument, context)};
    case 'ObjectProperty':
      return {
        ...prop,
        value: prop.value && declareLVal(kind, prop.value, context),
      };
    default:
      throw new Error('Unexpected Property Type, ' + prop.type);
  }
}
function declareLVal(kind, val, context) {
  switch (val.type) {
    case 'ArrayPattern':
      return {
        ...val,
        elements: val.elements.map(el => declareLVal(kind, el, context)),
      };
    case 'Identifier':
      return context.declareVariable(kind, val.name).id;
    case 'ObjectPattern':
      return {
        ...val,
        properties: val.properties.map(p => declareProperty(kind, p, context)),
      };
    case 'RestElement':
      return {...val, argument: declareLVal(kind, val.argument, context)};
    default:
      throw new Error('Unexpected Left Value Type, ' + val.type);
  }
}
function visitUnbufferedCode(node, context) {
  // TODO: hoist and rename `const` and `let` variables
  const statement = parseStatement(node.val, context);
  const variableDeclaration = t.asVariableDeclaration(statement);
  if (variableDeclaration) {
    const kind = variableDeclaration.kind;
    const expressions = [];
    for (const declaration of variableDeclaration.declarations) {
      const lval = declareLVal(kind, declaration.id, context);
      expressions.push(
        t.assignmentExpression(
          '=',
          lval,
          declaration.init || t.identifier('undefined'),
        ),
      );
    }
    expressions.push(t.identifier('undefined'));
    return t.sequenceExpression(expressions);
  }
  if (t.isExpressionStatement(statement)) {
    return t.sequenceExpression([
      statement.expression,
      t.identifier('undefined'),
    ]);
  }
  return t.callExpression(
    t.arrowFunctionExpression([], t.blockStatement([statement])),
    [],
  );
}

const CodeVisitor = {
  expression(node, context) {
    if (node.buffer && !node.mustEscape) {
      throw new Error('Unescaped, buffered code is not supported in react-pug');
    }
    if (node.buffer) {
      return visitBufferedCode(node, context);
    } else {
      return visitUnbufferedCode(node, context);
    }
  },
};

module.exports = CodeVisitor;
