#!/bin/sh
node_modules/.bin/cjs-to-es6 node_modules/fbjs/lib node_modules/object-assign node_modules/react/cjs node_modules/react-dom/cjs

sed -i "" -E "s/object-assign/object-assign\/index/g" node_modules/react/cjs/react.production.min.js
sed -i "" -E "s/ from '(.+)'/ from '..\/..\/\1.js'/g" node_modules/react/cjs/react.production.min.js

sed -i "" -E "s/ from 'react/ from 'react\/cjs\/react.production.min/g" node_modules/react-dom/cjs/react-dom.production.min.js
sed -i "" -E "s/object-assign/object-assign\/index/g" node_modules/react-dom/cjs/react-dom.production.min.js
sed -i "" -E "s/ from '(.+)'/ from '..\/..\/\1.js'/g" node_modules/react-dom/cjs/react-dom.production.min.js

sed -i "" -E "s/ from 'react/ from 'react\/cjs\/react.production.min/g" node_modules/react-dom/cjs/react-dom-server.browser.production.min.js
sed -i "" -E "s/object-assign/object-assign\/index/g" node_modules/react-dom/cjs/react-dom-server.browser.production.min.js
sed -i "" -E "s/ from '(.+)'/ from '..\/..\/\1.js'/g" node_modules/react-dom/cjs/react-dom-server.browser.production.min.js

for js in node_modules/fbjs/lib/*.js; do sed -i "" -E "s/process.env.NODE_ENV !== 'production'/false/g" "$js"; done

node_modules/.bin/rollup -c

cp react.mjs example/js/react.js
