/* eslint-disable max-len */

export default (value) => {
  const regex = /(?:((?:element|isolate-override|plaintext))|((?:calc|cross-fade|filter|grab(?:bing)?|image-set|sticky|zoom-(?:in|out)))|((?:fill(?:-available)?|fit-content|isolate|(?:max|min)-content|stretch))|((?:pixelated)))/

  return value.match (regex)
}
