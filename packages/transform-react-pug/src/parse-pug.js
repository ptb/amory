const lex = require('pug-lexer');
const parse = require('pug-parser');
const filters = require('pug-filters');
const stripComments = require('pug-strip-comments');

module.exports = function(str) {
  return filters.handleFilters(
    parse(
      stripComments(lex(str), {stripUnbuffered: true, stripBuffered: true}),
    ),
  );
};
