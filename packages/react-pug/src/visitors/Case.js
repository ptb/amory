//

const parseExpression = require('../utils/parse-expression');

const t = require('../babel-types');
const {visitExpressions} = require('../visitors');

function convertCases(nodes, context, needle) {
  if (nodes.length === 0) {
    return t.identifier('undefined');
  }
  const node = nodes[0];
  const consequent = context.staticBlock(childContext => {
    const children = visitExpressions(node.block.nodes, childContext);
    if (children.length === 1) {
      return children[0];
    }
    if (children.length === 0) {
      return t.identifier('undefined');
    }
    return t.arrayExpression(children);
  });
  if (node.expr === 'default') {
    return consequent;
  }
  const test = t.binaryExpression(
    '===',
    needle,
    parseExpression(node.expr, context),
  );
  const alternate = convertCases(nodes.slice(1), context, needle);
  return t.conditionalExpression(test, consequent, alternate);
}

const ConditionalVisitor = {
  expression(node, context) {
    const needle = parseExpression(node.expr, context);
    const id =
      t.asIdentifier(needle) ||
      context.declareVariable(
        'const',
        context.generateUidIdentifier('case_variable').name,
      ).id;
    const cases = convertCases(node.block.nodes, context, id);
    if (!t.isIdentifier(needle)) {
      return t.sequenceExpression([
        t.assignmentExpression('=', id, needle),
        cases,
      ]);
    }
    return cases;
  },
};
module.exports = ConditionalVisitor;
