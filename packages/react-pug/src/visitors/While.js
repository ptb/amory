//

const parseExpression = require('../utils/parse-expression');

const t = require('../babel-types');
const {visitExpressions} = require('../visitors');

function getWhileStatement(node, context, id) {
  const test = parseExpression(node.test, context);
  const {result: body, variables} = context.dynamicBlock(childContext => {
    return visitExpressions(node.block.nodes, context).map(exp =>
      t.expressionStatement(
        t.assignmentExpression(
          '=',
          t.memberExpression(
            id,
            t.memberExpression(id, t.identifier('length')),
            true,
          ),
          exp,
        ),
      ),
    );
  });
  if (variables.length) {
    body.unshift(
      t.variableDeclaration(
        'let',
        variables.map(id => t.variableDeclarator(id)),
      ),
    );
  }
  return t.whileStatement(test, t.blockStatement(body));
}
const WhileVisitor = {
  expression(node, context) {
    const id = context.generateUidIdentifier('pug_nodes');
    return t.callExpression(
      t.arrowFunctionExpression(
        [id],
        t.blockStatement([
          getWhileStatement(node, context, id),
          t.returnStatement(id),
        ]),
      ),
      [t.arrayExpression([])],
    );
  },
};

module.exports = WhileVisitor;
