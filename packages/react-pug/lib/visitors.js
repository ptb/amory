"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.visitExpressions = visitExpressions;
exports.visitExpression = visitExpression;
exports.visitJsxExpressions = visitJsxExpressions;
exports.visitJsx = visitJsx;

//
const t = require('./babel-types');

const setCurrentLocation = require('./babel-types').setCurrentLocation;

const visitors = require('./visitors.generated.js');

function visitExpressions(nodes, context) {
  const result = [];
  nodes.forEach((node, i) => {
    if (node.type === 'Block') {
      result.push(...visitExpressions(node.nodes, context));
    } else {
      result.push(visitExpression(node, context));
    }
  });
  return result;
}

function visitExpression(node, context) {
  const line = node.line + context.getBaseLine();
  setCurrentLocation({
    start: {
      line,
      column: 0
    },
    end: {
      line,
      column: 0
    }
  });
  const v = visitors[node.type];

  if (!v) {
    throw new Error(node.type + ' is not yet supported');
  }

  return v.expression(node, context);
}

function visitJsxExpressions(nodes, context) {
  const result = [];
  nodes.forEach((node, i) => {
    if (node.type === 'Block') {
      result.push(...visitJsxExpressions(node.nodes, context));
    } else {
      result.push(visitJsx(node, context));
    }
  });
  return result;
}

function visitJsx(node, context) {
  const line = node.line + context.getBaseLine();
  setCurrentLocation({
    start: {
      line,
      column: 0
    },
    end: {
      line,
      column: 0
    }
  });
  const v = visitors[node.type];

  if (!v) {
    throw new Error(node.type + ' is not yet supported');
  }

  return v.jsx ? v.jsx(node, context) : t.jSXExpressionContainer(v.expression(node, context));
}