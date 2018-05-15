//

const parse = require('./parse');
const addLocToAst = require('./add-loc-to-ast');

module.exports = function parseStatement(src, context) {
  const val = parse(src, context);
  if (val.length !== 1) {
    const err = context.error(
      'INVALID_EXPRESSION',
      'There was an error parsing the expression "' + src + '".',
    );
    throw err;
  }
  addLocToAst(val[0]);
  return val[0];
};
