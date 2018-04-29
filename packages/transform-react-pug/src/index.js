const common = require('common-prefix');
const parsePug = require('./parse-pug');
const Context = require('./context');
const visitExpression = require('./visitors').visitExpression;
const getInterpolatedTemplate = require('./utils/interpolation')
  .getInterpolatedTemplate;
const setBabelTypes = require('./babel-types').setBabelTypes;

module.exports = function(babel) {
  const {types: t} = babel;

  setBabelTypes(t);

  function isReactPugReference(node) {
    // TODO: do this better
    return t.isIdentifier(node, {name: 'pug'});
  }

  return {
    visitor: {
      TaggedTemplateExpression(path) {
        const {node} = path;
        const {quasis, expressions} = node.quasi;

        if (isReactPugReference(node.tag) && quasis.length >= 1) {
          let template, interpolationRef;

          if (expressions.length) {
            const interpolatedTpl = getInterpolatedTemplate(
              quasis,
              expressions,
            );
            template = interpolatedTpl.template;
            interpolationRef = interpolatedTpl.interpolationRef;
          } else {
            template = quasis[0].value.raw;
          }

          let src = template.split('\n');

          const minIndent = common(
            src
              .filter(line => line.trim() !== '')
              .map(line => /^[ \t]*/.exec(line)[0]),
          );

          src = src.map(line => line.substr(minIndent.length)).join('\n');

          const ast = parsePug(src);
          const context = Context.create(this.file, path, interpolationRef);
          const transformed = ast.nodes.map(node =>
            visitExpression(node, context),
          );
          const expression =
            transformed.length === 1
              ? transformed[0]
              : t.arrayExpression(transformed);

          context.variablesToDeclare.forEach(id => {
            path.scope.push({kind: 'let', id});
          });

          path.replaceWith(expression);
        }
      },
    },
  };
};
