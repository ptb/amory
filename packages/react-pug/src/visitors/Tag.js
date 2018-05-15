//

const parseExpression = require('../utils/parse-expression');
const t = require('../babel-types');
const {visitJsx, visitJsxExpressions} = require('../visitors');
const getInterpolationRefs = require('../utils/interpolation')
  .getInterpolationRefs;

/**
 * Get children nodes from the node, passing the node's
 * context to the children and generating JSX values.
 * @param {Object} node - The node
 * @param {Context} context - The context to apply to the children
 * nodes
 * @returns {Array<JSXValue>}
 */
function getChildren(node, context) {
  return context.noKey(childContext =>
    (node.code ? [visitJsx(node.code, childContext)] : []).concat(
      visitJsxExpressions(node.block.nodes, childContext),
    ),
  );
}

/**
 * Iterate through the node's attributes and convert
 * them into JSX attributes.
 * @param {Object} node - The node
 * @param {Context} context - The context
 * @returns {Array<Attribute>}
 */
function getAttributes(node, context) {
  const classes = [];
  const attrs = node.attrs
    .map(({name, val, mustEscape}) => {
      if (/\.\.\./.test(name) && val === true) {
        return t.jSXSpreadAttribute(parseExpression(name.substr(3), context));
      }

      switch (name) {
        case 'for':
          name = 'htmlFor';
          break;
        case 'maxlength':
          name = 'maxLength';
          break;
        case 'class':
          name = 'className';
          break;
      }

      const expr = parseExpression(val === true ? 'true' : val, context);

      if (!mustEscape) {
        const canSkipEscaping =
          (name === 'className' || name === 'id') && t.isStringLiteral(expr);

        if (!canSkipEscaping) {
          throw context.error(
            'INVALID_EXPRESSION',
            'Unescaped attributes are not supported in react-pug',
          );
        }
      }

      if (expr == null) {
        return null;
      }

      if (name === 'className') {
        classes.push(expr);
        return null;
      }

      const jsxValue =
        t.asStringLiteral(expr) ||
        t.asJSXElement(expr) ||
        t.jSXExpressionContainer(expr);

      if (/\.\.\./.test(name)) {
        throw new Error('spread attributes must not have a value');
      }

      return t.jSXAttribute(t.jSXIdentifier(name), jsxValue);
    })
    .filter(Boolean);

  if (classes.length) {
    const value = classes.every(cls => t.isStringLiteral(cls))
      ? t.stringLiteral(classes.map(cls => cls.value).join(' '))
      : t.jSXExpressionContainer(
          t.callExpression(
            t.memberExpression(
              t.arrayExpression(classes),
              t.identifier('join'),
            ),
            [t.stringLiteral(' ')],
          ),
        );
    attrs.push(t.jSXAttribute(t.jSXIdentifier('className'), value));
  }

  return attrs;
}

/**
 * Retrieve attributes and children of the passed node.
 * @param {Object} node - The node
 * @param {Context} context - The context
 * @returns {Object} Contains the attributes and children
 * of the node.
 */
function getAttributesAndChildren(node, context) {
  const children = getChildren(node, context);

  if (node.attributeBlocks.length) {
    throw new Error('Attribute blocks are not yet supported in react-pug');
  }

  const attrs = getAttributes(node, context);
  context.key.handleAttributes(attrs);

  return {attrs, children};
}

/**
 * Generate a JSX element.
 * @param { string } name - The name of the JSX element
 * @param { Array<JSXAttribute|JSXSpreadAttribute> } attrs -
 * The attributes for the JSX element
 * @param { Array<JSXValue> } children - The children for
 * the JSX element
 * @returns { JSXElement } The JSX element.
 */
function buildJSXElement(name, attrs, children) {
  const tagName = t.jSXIdentifier(name);
  const noChildren = children.length === 0;

  const open = t.jSXOpeningElement(
    tagName,
    attrs, // Array<JSXAttribute | JSXSpreadAttribute>
    noChildren,
  );

  const close = noChildren ? null : t.jSXClosingElement(tagName);

  return t.jSXElement(open, close, children, noChildren);
}

/**
 * Check whether an interpolation exists, if so, check whether
 * the interpolation is a react component and return either
 * the component as a JSX element or the interpolation.
 * @param {string} name - The interpolation reference
 * @param {Context} context - The current context to retrieve
 * the interpolation from
 * @param {Array<JSXValue>} children - Whether the element has
 * attributes or children
 * @returns {?Object} The context's interpolation or a JSX element.
 */
function getInterpolationByContext(name, context, attrs, children) {
  if (!getInterpolationRefs(name)) {
    return null;
  }

  const interpolation = context.getInterpolationByRef(name);

  const isReactComponent =
    t.isIdentifier(interpolation) &&
    interpolation.name.charAt(0) === interpolation.name.charAt(0).toUpperCase();

  if (attrs.length || children.length) {
    if (isReactComponent) {
      return buildJSXElement(interpolation.name, attrs, children);
    } else {
      throw context.error(
        'INVALID_EXPRESSION',
        `Only components can have children and attributes`,
      );
    }
  }

  return interpolation;
}

const TagVisitor = {
  jsx(node, context) {
    const {attrs, children} = getAttributesAndChildren(node, context);
    const interpolation = getInterpolationByContext(
      node.name,
      context,
      attrs,
      children,
    );

    if (interpolation != null) {
      return (
        t.asJSXElement(interpolation) || t.jSXExpressionContainer(interpolation)
      );
    }

    return buildJSXElement(node.name, attrs, children);
  },
  expression(node, context) {
    const {attrs, children} = getAttributesAndChildren(node, context);
    const interpolation = getInterpolationByContext(
      node.name,
      context,
      attrs,
      children,
    );

    if (interpolation != null) {
      return interpolation;
    }

    return buildJSXElement(node.name, attrs, children);
  },
};

module.exports = TagVisitor;
