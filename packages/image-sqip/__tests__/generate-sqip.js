"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

const _require = require(`path`),
      resolve = _require.resolve;

const _require2 = require(`fs-extra`),
      exists = _require2.exists,
      readFile = _require2.readFile,
      writeFile = _require2.writeFile;

const sqip = require(`sqip`);

const generateSqip = require(`../generate-sqip.js`);

jest.mock(`sqip`, () => jest.fn(() => {
  return {
    final_svg: `<svg><!-- Mocked SQIP SVG --></svg>`
  };
}));
jest.mock(`fs-extra`, () => {
  return {
    exists: jest.fn(() => false),
    readFile: jest.fn(() => `<svg><!-- Cached SQIP SVG --></svg>`),
    writeFile: jest.fn()
  };
});
afterEach(() => {
  sqip.mockClear();
  exists.mockClear();
  readFile.mockClear();
  writeFile.mockClear();
});
describe(`gatsby-transformer-sqip`,
/*#__PURE__*/
(0, _asyncToGenerator2.default)(function* () {
  const absolutePath = resolve(__dirname, `images`, `alisa-anton-166247-unsplash-400px.jpg`);
  const cacheDir = __dirname;
  describe(`generateSqip`, () => {
    it(`not cached`,
    /*#__PURE__*/
    (0, _asyncToGenerator2.default)(function* () {
      const cache = {
        get: jest.fn(),
        set: jest.fn()
      };
      const numberOfPrimitives = 5;
      const blur = 0;
      const mode = 3;
      const result = yield generateSqip({
        cache,
        cacheDir,
        absolutePath,
        numberOfPrimitives,
        blur,
        mode
      });
      expect(result).toMatchSnapshot();
      expect(sqip).toHaveBeenCalledTimes(1);
      const sqipArgs = sqip.mock.calls[0][0];
      expect(sqipArgs.filename).toMatch(absolutePath);
      delete sqipArgs.filename;
      expect(sqipArgs).toMatchSnapshot();
      expect(exists).toHaveBeenCalledTimes(1);
      expect(writeFile).toHaveBeenCalledTimes(1);
      expect(readFile).toHaveBeenCalledTimes(0);
    }));
    it(`cached`,
    /*#__PURE__*/
    (0, _asyncToGenerator2.default)(function* () {
      exists.mockImplementationOnce(() => true);
      const cache = {
        get: jest.fn(),
        set: jest.fn()
      };
      const numberOfPrimitives = 5;
      const blur = 0;
      const mode = 3;
      const result = yield generateSqip({
        cache,
        cacheDir,
        absolutePath,
        numberOfPrimitives,
        blur,
        mode
      });
      expect(result).toMatchSnapshot();
      expect(sqip).toHaveBeenCalledTimes(0);
      expect(exists).toHaveBeenCalledTimes(1);
      expect(writeFile).toHaveBeenCalledTimes(0);
      expect(readFile).toHaveBeenCalledTimes(1);
    }));
  });
}));