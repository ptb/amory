# gatsby-plugin-styletron

A [Gatsby](https://github.com/gatsbyjs/gatsby) plugin for
[styletron](https://github.com/rtsao/styletron) with built-in server-side
rendering support.

## Install

`npm install --dev gatsby-plugin-styletron`

## How to use

Edit `gatsby-config.js`

```javascript
module.exports = {
  plugins: [
    {
      resolve: "gatsby-plugin-styletron",
      options: {
        // You can pass options to Styletron.
        prefix: "_",
      },
    },
  ],
};
```

This can be used as described by [styletron-react](https://github.com/rtsao/styletron/tree/master/packages/styletron-react) such as:

```javascript
import React from "react"
import {styled, withStyle} from "styletron-react"

const RedAnchor = styled("a", {color: "red"})
const FancyAnchor = withStyle(RedAnchor, {fontFamily: "cursive"})

export default () => (
  <FancyAnchor>Hi!</FancyAnchor>
)
```

Or, using the `css` convenience function:

```javascript
import React from "react"
import styletron from "gatsby-plugin-styletron"

const styles = {
  fontFamily: "cursive",
  color: "blue"
}

export default (props) => {
  const css = styletron().css
  return (
    <div className={css ({backgroundColor: "#fcc", ...styles})}>Hi!</div>
  )
}
```

Or, crazy flexible combinations:

```javascript
import React from "react"
import {styled, withStyle} from "styletron-react"
import styletron from "gatsby-plugin-styletron"

const fancyStyles = {
  fontSize: '36px',
  '@media (max-width: 768px)': {
    fontSize: '24px'
  },
  ':hover': {
    backgroundColor: 'papayawhip'
  }
}

const divStyles = {
  border: "1px dashed #333"
}

const RedAnchor = styled("a", {color: "red"})
const FancyAnchor = withStyle(RedAnchor, {fontFamily: "cursive"})

export default () => {
  const css = styletron().css
  return (
    <div className={css ({backgroundColor: "#cff", ...divStyles})}>
      <FancyAnchor className={css (fancyStyles)}>Hi!</FancyAnchor>
      <div className={css (fancyStyles)}>Cool huh?</div>
    </div>
  )
}
```
