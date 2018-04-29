//

const he = require('he');

module.exports = function(input) {
  return he.decode(input);
};
