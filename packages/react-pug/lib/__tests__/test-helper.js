"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.testCompileError = testCompileError;
exports.testRuntimeError = testRuntimeError;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _server = _interopRequireDefault(require("react-dom/server"));

var _reactTestRenderer = _interopRequireDefault(require("react-test-renderer"));

var _babelCore = require("babel-core");

var _ = _interopRequireDefault(require("../"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function testCompileError(filename) {
  test('Expect an error to be thrown', () => {
    try {
      (0, _babelCore.transformFileSync)(filename, {
        babelrc: false,
        plugins: [_.default]
      });
    } catch (ex) {
      expect(ex.message).toMatchSnapshot('');
      return;
    }

    throw new Error('Expected an exception');
  });
}

function testRuntimeError(filename) {
  test('Expect an error to be thrown', () => {
    try {
      const src = (0, _babelCore.transformFileSync)(filename, {
        babelrc: false,
        plugins: [_.default, require('babel-plugin-transform-react-jsx')]
      }).code;
      const m = {
        exports: {}
      };
      Function('React,module', src)(_react.default, m);
    } catch (ex) {
      expect(ex.message).toMatchSnapshot('');
      return;
    }

    throw new Error('Expected an exception');
  });
}

var _default = filename => {
  test('JavaScript output', () => {
    expect((0, _babelCore.transformFileSync)(filename, {
      babelrc: false,
      plugins: [_.default]
    }).code).toMatchSnapshot('transformed source code');
  });
  test('html output', () => {
    const src = (0, _babelCore.transformFileSync)(filename, {
      babelrc: false,
      plugins: [_.default, require('babel-plugin-transform-react-jsx')]
    }).code;
    const m = {
      exports: {}
    };
    Function('React,module', src)(_react.default, m);
    expect(_reactTestRenderer.default.create(m.exports).toJSON()).toMatchSnapshot('generated html');
  });
  test('static html output', () => {
    const src = (0, _babelCore.transformFileSync)(filename, {
      babelrc: false,
      plugins: [_.default, require('babel-plugin-transform-react-jsx')]
    }).code;
    const m = {
      exports: {}
    };
    Function('React,module', src)(_react.default, m);
    expect(_server.default.renderToStaticMarkup(m.exports)).toMatchSnapshot('static html');
  });
};

exports.default = _default;