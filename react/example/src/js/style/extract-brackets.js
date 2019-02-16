/*
Copyright Brian Ninni 2016

Todo:

Add endIndex

	Tests, Readme
	Rename String Escape to more generic term
	Avoid escaped open/close characters should be an option disabled by default
	Should Regex symbols (/ and /) act as default 'string escape' chars?
	Open/close/escape chars can be regex or array of strings?
*/
//common string symbols
var defaultStringChars = ['"', "'", "`"],
  defaultStringObj = {
    open: defaultStringChars,
    close: defaultStringChars
  },
  //Common mates for statements
  Mates = {
    "(": ")",
    "[": "]",
    "<": ">",
    "{": "}",
    '"': '"',
    "'": "'",
    "/*": "*/",
    "<!--": "-->",
    "(*": "*)",
    "{-": "-}",
    "%{": "%}",
    "<#": "#>"
  },
  regexChars = [
    "^",
    "$",
    "[",
    "]",
    "{",
    "}",
    "(",
    ")",
    "\\",
    "/",
    ".",
    ",",
    "?",
    "-",
    "+",
    "*",
    "|"
  ];

//To extract everything inside the outer most brackets
function Extractor(open, close, stringChars) {
  var regex;

  if (typeof open !== "string")
    throw new TypeError("The 'open' argument must be a string");

  //if close isnt a string, then get a mate for it
  if (typeof close !== "string") close = getMate(open);

  stringChars = buildStringObj(stringChars);
  regex = buildRegex(open, close, stringChars.open);

  this.extract = function(str, count) {
    if (typeof count !== "number") count = 0;

    return new Extraction(open, close, stringChars, regex).init(str, count);
  };
}

function Extraction(open, close, stringChars, regex) {
  this.matches = [];
  this.tree = [];
  this.escaped = false;

  this.openChar = open;
  this.closeChar = close;
  this.stringChars = stringChars;
  this.regex = regex;

  this.sameChar = open === close;
}

Extraction.prototype.init = function(str, count) {
  var arr = str.split(this.regex),
    l = arr.length,
    i;
  this.count = count;
  this.index = 0;

  for (i = 0; i < l; i++) {
    if (this.handleStr(arr[i])) break;
    this.index += arr[i].length;
  }

  //if there is still a result, then there was an error
  if (this.result) {
    if (this.escaped)
      throw new Error("Unable to parse. Unclosed String detected");
    throw new Error("Unable to parse. Unclosed Bracket detected");
  }

  return this.matches;
};

Extraction.prototype.handleStr = function(str) {
  var index;

  if (this.escaped) {
    if (str === this.unescapeStr) this.escaped = false;
    return this.add(str);
  }

  if (str === this.openChar) return this.open();

  if (str === this.closeChar) return this.close();

  index = this.stringChars.open.indexOf(str);
  if (index > -1) {
    this.escaped = true;
    this.unescapeStr = this.stringChars.close[index];
  }
  return this.add(str);
};

Extraction.prototype.open = function() {
  //create a new result object
  var self = this;
  obj = {
    nest: [],
    simple: [],
    hasNest: false,
    str: "",
    index: [this.index]
  };

  //if there currently is a result:
  if (this.result) {
    //if the open and close characters are the same, then close
    if (this.sameChar) return this.close();

    //set hasNest to true
    this.result.hasNest = true;

    //add the new result object to the current nest
    this.result.nest.push(obj);

    //add the new simple result object to the current simple
    this.result.simple.push(obj.simple);

    //add the result to the tree
    this.tree.push(this.result);

    this.tree.forEach(function(branch, i) {
      //get the index of this for each parent
      obj.index.push(self.index - branch.index[0] - 1);

      //add the open char to all strings
      branch.str += self.openChar;
    });
  }
  //otherwise, save the obj as a new match
  else this.matches.push(obj);

  //set the result to be the new object
  this.result = obj;

  return false;
};

//to add text to the current result if there is one
Extraction.prototype.add = function(str) {
  var nest;

  if (str && this.result) {
    nest = this.result.nest;

    //if the last element is a string, then append
    if (typeof nest[nest.length - 1] === "string") {
      nest[nest.length - 1] += str;
      this.result.simple += str;
    }
    //otherwise, the new string
    else {
      nest.push(str);
      this.result.simple.push(str);
    }

    this.result.str += str;

    this.tree.forEach(function(obj) {
      obj.str += str;
    });
  }

  return false;
};

Extraction.prototype.close = function() {
  var self = this;

  this.tree.forEach(function(branch, i) {
    //add the close char to all strings
    branch.str += self.closeChar;
  });

  //set the result to be the last element in the tree
  this.result = popLast(this.tree);

  //return true if it reached the desired number of matches
  return !this.result && this.matches.length === this.count;
};

//to sort an array by length
function sortArrayByLength(a, b) {
  return b.length - a.length;
}

//to get the mate value of the given string
function getMate(str) {
  var keys, regex, match, count;

  if (str in Mates) return Mates[str];

  //check for repeating cases

  //get the keys in order of largest to smallest since the smaller ones are substrings of the larger ones
  keys = Object.keys(Mates)
    .sort(sortArrayByLength)
    .map(toRegex);
  regex = new RegExp("(" + keys.join("|") + ")", "g");
  match = str.match(regex);

  if (match) {
    count = str.length / match[0].length;
    if (count === match.length) return Mates[match[0]].repeat(count);
  }

  //if no common mate, then use the reverse of the str
  return reverse(str);
}

//to reverse a string
function reverse(str) {
  return str
    .split("")
    .reverse()
    .join("");
}

function toRegex(str) {
  return escapeChars(str, regexChars);
}

function escapeChars(str, arr) {
  var expression = arr.join("\\"),
    regex = new RegExp("[\\" + expression + "]", "g");

  return str.replace(regex, "\\$&");
}

function popLast(arr) {
  return arr.splice(arr.length - 1, 1)[0];
}

function getLast(arr) {
  return arr[arr.length - 1];
}

function addEscape(str) {
  return "\\\\" + str;
}

function buildStringObj(arr) {
  var ret = {
    open: [],
    close: []
  };

  if (typeof arr === "string") arr = [arr];
  else if (typeof arr !== "object" || arr.constructor !== Array)
    return defaultStringObj;

  arr.forEach(function(el) {
    if (typeof el === "string") {
      ret.open.push(el);
      ret.close.push(getMate(el));
    } else if (
      typeof el === "object" &&
      el.constructor === Array &&
      typeof el[0] === "string"
    ) {
      if (typeof el[1] === "string") {
        ret.open.push(el[0]);
        ret.close.push(el[1]);
      } else {
        ret.open.push(el);
        ret.close.push(getMate(el));
      }
    }
  });

  return ret;
}

function buildRegex(open, close, stringChars) {
  var regexNormal = [open, close]
      .concat(stringChars)
      .sort(sortArrayByLength)
      .map(toRegex),
    regexEscaped = regexNormal.map(addEscape),
    arr = regexEscaped.concat(regexNormal);

  return new RegExp("(" + arr.join("|") + ")", "g");
}

module.exports = Extractor;
