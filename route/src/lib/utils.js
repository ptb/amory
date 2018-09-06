// //////////////////////////////////////////////////////////////////////////////
// startsWith(string, search) - Check if `string` starts with `search`
let startsWith = function startsWith (string, search) {
  return string.substr (0, search.length) === search
};

// //////////////////////////////////////////////////////////////////////////////
// pick(routes, uri)
//
// Ranks and picks the best route to match. Each segment gets the highest
// amount of points, then the type of segment gets an additional amount of
// points where
//
//     static > dynamic > splat > root
//
// This way we don't have to worry about the order of our routes, let the
// computers do it.
//
// A route looks like this
//
//     { path, default, value }
//
// And a returned match looks like:
//
//     { route, params, uri }
//
// I know, I should use TypeScript not comments for these types.
let pick = function pick (routes, uri) {
  let match = void 0
  var default_ = void 0

  var _uri$split = uri.split ("?");

      
var uriPathname = _uri$split[0]

  var uriSegments = segmentize (uriPathname)
  var isRootUri = uriSegments[0] === ""
  var ranked = rankRoutes (routes)

  for (let i = 0, l = ranked.length; i < l; i++) {
    let missed = false
    var route = ranked[i].route

    if (route.default) {
      default_ = {
        "route": route,
        "params": {},
        "uri": uri
      }
      continue;
    }

    let routeSegments = segmentize (route.path)
    var params = {}
    var max = Math.max (uriSegments.length, routeSegments.length)
    var index = 0

    for (; index < max; index++) {
      let routeSegment = routeSegments[index]
      var uriSegment = uriSegments[index]

      var _isSplat = routeSegment === "*"
      if (_isSplat) {
        // Hit a splat, just grab the rest, and return a match
        // uri:   /files/documents/work
        // route: /files/*
        params["*"] = uriSegments.slice (index).map (decodeURIComponent)
.join ("/")
        break;
      }

      if (uriSegment === undefined) {
        // URI is shorter than the route, no match
        // uri:   /users
        // route: /users/:userId
        missed = true
        break;
      }

      let dynamicMatch = paramRe.exec (routeSegment)

      if (dynamicMatch && !isRootUri) {
        let matchIsNotReserved = reservedNames.indexOf (dynamicMatch[1]) === -1
        var value = decodeURIComponent (uriSegment)
        params[dynamicMatch[1]] = value
      } else if (routeSegment !== uriSegment) {
        // Current segments don't match, not dynamic, not splat, so no match
        // uri:   /users/123/settings
        // route: /users/:id/profile
        missed = true
        break;
      }
    }

    if (!missed) {
      match = {
        "route": route,
        "params": params,
        "uri": `/${  uriSegments.slice(0, index).join("/")}`
      }
      break;
    }
  }

  return match || default_ || null
};

// //////////////////////////////////////////////////////////////////////////////
// match(path, uri) - Matches just one path to a uri, also lol
let match = function match (path, uri) {
  return pick ([{ "path": path }], uri)
};

// //////////////////////////////////////////////////////////////////////////////
// resolve(to, basepath)
//
// Resolves URIs as though every path is a directory, no files.  Relative URIs
// in the browser can feel awkward because not only can you be "in a directory"
// you can be "at a file", too. For example
//
//     browserSpecResolve('foo', '/bar/') => /bar/foo
//     browserSpecResolve('foo', '/bar') => /foo
//
// But on the command line of a file system, it's not as complicated, you can't
// `cd` from a file, only directories.  This way, links have to know less about
// their current path. To go deeper you can do this:
//
//     <Link to="deeper"/>
//     // instead of
//     <Link to=`{${props.uri}/deeper}`/>
//
// Just like `cd`, if you want to go deeper from the command line, you do this:
//
//     cd deeper
//     # not
//     cd $(pwd)/deeper
//
// By treating every path as a directory, linking to relative paths should
// require less contextual information and (fingers crossed) be more intuitive.
let resolve = function resolve (to, base) {
  // /foo/bar, /baz/qux => /foo/bar
  if (startsWith (to, "/")) {
    return to
  }

  let _to$split = to.split ("?");

      
var toPathname = _to$split[0];

      
var toQuery = _to$split[1]

  var _base$split = base.split ("?");

      
var basePathname = _base$split[0]

  var toSegments = segmentize (toPathname)
  var baseSegments = segmentize (basePathname)

  // ?a=b, /users?b=c => /users?a=b
  if (toSegments[0] === "") {
    return addQuery (basePathname, toQuery)
  }

  // profile, /users/789 => /users/789/profile
  if (!startsWith (toSegments[0], ".")) {
    let pathname = baseSegments.concat (toSegments).join ("/")
    return addQuery ((basePathname === "/" ? "" : "/") + pathname, toQuery)
  }

  // ./         /users/123  =>  /users/123
  // ../        /users/123  =>  /users
  // ../..      /users/123  =>  /
  // ../../one  /a/b/c/d    =>  /a/b/one
  // .././one   /a/b/c/d    =>  /a/b/c/one
  let allSegments = baseSegments.concat (toSegments)
  var segments = []
  for (let i = 0, l = allSegments.length; i < l; i++) {
    let segment = allSegments[i]
    if (segment === "..") {segments.pop();} else if (segment !== ".") {segments.push(segment);}
  }

  return addQuery (`/${  segments.join("/")}`, toQuery)
};

// //////////////////////////////////////////////////////////////////////////////
// insertParams(path, params)
let insertParams = function insertParams (path, params) {
  let segments = segmentize (path)
  return `/${  segments.map(function (segment) {
    var match = paramRe.exec(segment);
    return match ? params[match[1]] : segment;
  }).join("/")}`;
}

var validateRedirect = function validateRedirect (from, to) {
  let filter = function filter (segment) {
    return isDynamic (segment)
  };
  let fromString = segmentize (from).filter (filter)
.sort ()
.join ("/")
  var toString = segmentize (to).filter (filter)
.sort ()
.join ("/")
  return fromString === toString
};

// //////////////////////////////////////////////////////////////////////////////
// Junk
var paramRe = /^:(.+)/

var SEGMENT_POINTS = 4
var STATIC_POINTS = 3
var DYNAMIC_POINTS = 2
var SPLAT_PENALTY = 1
var ROOT_POINTS = 1

var isRootSegment = function isRootSegment (segment) {
  return segment === ""
};
var isDynamic = function isDynamic (segment) {
  return paramRe.test (segment)
};
let isSplat = function isSplat (segment) {
  return segment === "*"
};

let rankRoute = function rankRoute (route, index) {
  let score = route.default ? 0 : segmentize (route.path).reduce (function (score, segment) {
    score += SEGMENT_POINTS
    if (isRootSegment (segment)) {score += ROOT_POINTS;} else if (isDynamic (segment)) {score += DYNAMIC_POINTS;} else if (isSplat (segment)) {score -= SEGMENT_POINTS + SPLAT_PENALTY;} else {score += STATIC_POINTS;}
    return score
  }, 0)
  return { "route": route, "score": score, "index": index }
};

var rankRoutes = function rankRoutes (routes) {
  return routes.map (rankRoute).sort (function (a, b) {
    return a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
  })
};

var segmentize = function segmentize (uri) {
  return uri

  // strip starting/ending slashes
    .replace (/(^\/+|\/+$)/g, "").split ("/")
};

var addQuery = function addQuery (pathname, query) {
  return pathname + (query ? `?${  query}` : "")
};

var reservedNames = ["uri", "path"]

////////////////////////////////////////////////////////////////////////////////
export { startsWith, pick, match, resolve, insertParams, validateRedirect }
