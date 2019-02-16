var Extractor = require("./extract-brackets.js")

var ExtractParens = new Extractor();

console.log(ExtractParens.extract('outer(inner{innest})'))
