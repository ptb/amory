"use strict";

var _babelCore = require("babel-core");

var _ = _interopRequireDefault(require("../"));

var _babelPluginTransformReactJsx = _interopRequireDefault(require("babel-plugin-transform-react-jsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const FILENAME = __dirname + '/html-entities.input.js';

const transform = (...plugins) => (0, _babelCore.transformFileSync)(FILENAME, {
  babelrc: false,
  compact: false,
  plugins: [_.default, ...plugins]
}).code;

test('JavaScript output', () => {
  const src = transform();
  expect(src).toMatchSnapshot('transformed source code');
});
test('JSX output', () => {
  const src = transform(_babelPluginTransformReactJsx.default);
  expect(src).toMatchSnapshot('generated JSX');
});