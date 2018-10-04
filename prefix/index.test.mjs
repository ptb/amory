import test from "ava"

import index from "./index.mjs"

test ("1", (t) => {
  const actual = index ({
    "animationName": "ae",
    "flexDirection": "column-reverse"
  })
  const expect = {
    "-webkit-animation-name": "ae",
    "-webkit-box-direction": "reverse",
    "-webkit-box-orient": "vertical",
    "-webkit-flex-direction": "column-reverse",
    "animation-name": "ae",
    "flex-direction": "column-reverse"
  }

  t.deepEqual (actual, expect)
})

test ("2", (t) => {
  const actual = index ({
    "alignItems": "flex-end",
    "backgroundImage":
      "repeating-radial-gradient (to bottom right, red, yellow)",
    "display": "inline-flex",
    "flexDirection": "row",
    "flexGrow": 1,
    "maskBorderSlice": "7 12 14 5"
  })
  const expect = {
    "-webkit-align-items": "flex-end",
    "-webkit-box-align": "end",
    "-webkit-box-direction": "normal",
    "-webkit-box-flex": 1,
    "-webkit-box-orient": "horizontal",
    "-webkit-flex-direction": "row",
    "-webkit-flex-grow": 1,
    "-webkit-mask-border-slice": "7 12 14 5",
    "align-items": "flex-end",
    "background-image": [
      "-webkit-repeating-radial-gradient (to bottom right, red, yellow)",
      "repeating-radial-gradient (to bottom right, red, yellow)"
    ],
    "display": ["-webkit-inline-box", "-webkit-inline-flex", "inline-flex"],
    "flex-direction": "row",
    "flex-grow": 1,
    "mask-border-slice": "7 12 14 5"
  }

  t.deepEqual (actual, expect)
})

test ("3", (t) => {
  const actual = index ({
    "alignContent": "flex-start",
    "alignItems": "flex-end",
    "alignSelf": "center",
    "flex": "0 1 auto",
    "flexBasis": "auto",
    "flexDirection": "row",
    "flexFlow": "column-reverse wrap-reverse",
    "flexGrow": 1,
    "flexShrink": 2,
    "flexWrap": "wrap",
    "justifyContent": "space-around",
    "order": 2
  })
  const expect = {
    "-webkit-align-content": "flex-start",
    "-webkit-align-items": "flex-end",
    "-webkit-align-self": "center",
    "-webkit-box-align": "end",
    "-webkit-box-direction": "normal",
    "-webkit-box-flex": 1,
    "-webkit-box-lines": "multiple",
    "-webkit-box-orient": "horizontal",
    "-webkit-box-pack": "justify",
    "-webkit-flex": "0 1 auto",
    "-webkit-flex-basis": "auto",
    "-webkit-flex-direction": "row",
    "-webkit-flex-flow": "column-reverse wrap-reverse",
    "-webkit-flex-grow": 1,
    "-webkit-flex-shrink": 2,
    "-webkit-flex-wrap": "wrap",
    "-webkit-justify-content": "space-around",
    "-webkit-order": 2,
    "align-content": "flex-start",
    "align-items": "flex-end",
    "align-self": "center",
    "flex": "0 1 auto",
    "flex-basis": "auto",
    "flex-direction": "row",
    "flex-flow": "column-reverse wrap-reverse",
    "flex-grow": 1,
    "flex-shrink": 2,
    "flex-wrap": "wrap",
    "justify-content": "space-around",
    "order": 2
  }

  t.deepEqual (actual, expect)
})

test ("4", (t) => {
  const actual = index ({
    "boxSizing": "content-box",
    "textAlignLast": "right"
  })
  const expect = {
    "-moz-box-sizing": "content-box",
    "-moz-text-align-last": "right",
    "box-sizing": "content-box",
    "text-align-last": "right"
  }

  t.deepEqual (actual, expect)
})

test ("5", (t) => {
  const actual = index ({
    "tabSize": "10px"
  })
  const expect = {
    "-moz-tab-size": "10px",
    "-o-tab-size": "10px",
    "tab-size": "10px"
  }

  t.deepEqual (actual, expect)
})

test ("6", (t) => {
  const actual = index ({
    "imageRendering": "crisp-edges",
    "overscrollBehavior": "auto contain",
    "textSpacing": 0
  })
  const expect = {
    "-ms-image-rendering": "crisp-edges",
    "-ms-overscroll-behavior": "auto contain",
    "-ms-text-spacing": 0,
    "image-rendering": "crisp-edges",
    "overscroll-behavior": "auto contain",
    "text-spacing": 0
  }

  t.deepEqual (actual, expect)
})

test ("7", (t) => {
  const actual = index ({
    "objectFit": "cover",
    "objectPosition": "right top"
  })
  const expect = {
    "-o-object-fit": "cover",
    "-o-object-position": "right top",
    "object-fit": "cover",
    "object-position": "right top"
  }

  t.deepEqual (actual, expect)
})

test ("8", (t) => {
  const actual = index ({
    "animation": 0,
    "animationDelay": 0,
    "animationDirection": 0,
    "animationDuration": 0,
    "animationFillMode": 0,
    "animationIterationCount": 0,
    "animationName": 0,
    "animationPlayState": 0,
    "animationTimingFunction": 0,
    "backdropFilter": 0,
    "backfaceVisibility": 0,
    "backgroundClip": 0,
    "borderBlockEnd": 0,
    "borderBlockStart": 0,
    "boxDecorationBreak": 0,
    "breakAfter": 0,
    "breakBefore": 0,
    "breakInside": 0,
    "clipPath": 0,
    "colorAdjust": 0,
    "filter": 0,
    "fontKerning": 0,
    "marginBlockEnd": 0,
    "marginBlockStart": 0,
    "mask": 0,
    "maskBorder": 0,
    "maskBorderOutset": 0,
    "maskBorderRepeat": 0,
    "maskBorderSlice": 0,
    "maskBorderSource": 0,
    "maskBorderWidth": 0,
    "maskClip": 0,
    "maskComposite": 0,
    "maskImage": 0,
    "maskOrigin": 0,
    "maskPosition": 0,
    "maskRepeat": 0,
    "maskSize": 0,
    "paddingBlockEnd": 0,
    "paddingBlockStart": 0,
    "perspective": 0,
    "perspectiveOrigin": 0,
    "shapeImageThreshold": 0,
    "shapeMargin": 0,
    "shapeOutside": 0,
    "textDecorationSkip": 0,
    "textEmphasis": 0,
    "textEmphasisColor": 0,
    "textEmphasisPosition": 0,
    "textEmphasisStyle": 0,
    "transform": 0,
    "transformOrigin": 0,
    "transformStyle": 0,
    "transition": 0,
    "transitionDelay": 0,
    "transitionDuration": 0,
    "transitionProperty": 0,
    "transitionTimingFunction": 0
  })
  const expect = {
    "-webkit-animation": 0,
    "-webkit-animation-delay": 0,
    "-webkit-animation-direction": 0,
    "-webkit-animation-duration": 0,
    "-webkit-animation-fill-mode": 0,
    "-webkit-animation-iteration-count": 0,
    "-webkit-animation-name": 0,
    "-webkit-animation-play-state": 0,
    "-webkit-animation-timing-function": 0,
    "-webkit-backdrop-filter": 0,
    "-webkit-backface-visibility": 0,
    "-webkit-background-clip": 0,
    "-webkit-border-block-end": 0,
    "-webkit-border-block-start": 0,
    "-webkit-box-decoration-break": 0,
    "-webkit-break-after": 0,
    "-webkit-break-before": 0,
    "-webkit-break-inside": 0,
    "-webkit-clip-path": 0,
    "-webkit-color-adjust": 0,
    "-webkit-filter": 0,
    "-webkit-font-kerning": 0,
    "-webkit-margin-block-end": 0,
    "-webkit-margin-block-start": 0,
    "-webkit-mask": 0,
    "-webkit-mask-border": 0,
    "-webkit-mask-border-outset": 0,
    "-webkit-mask-border-repeat": 0,
    "-webkit-mask-border-slice": 0,
    "-webkit-mask-border-source": 0,
    "-webkit-mask-border-width": 0,
    "-webkit-mask-clip": 0,
    "-webkit-mask-composite": 0,
    "-webkit-mask-image": 0,
    "-webkit-mask-origin": 0,
    "-webkit-mask-position": 0,
    "-webkit-mask-repeat": 0,
    "-webkit-mask-size": 0,
    "-webkit-padding-block-end": 0,
    "-webkit-padding-block-start": 0,
    "-webkit-perspective": 0,
    "-webkit-perspective-origin": 0,
    "-webkit-shape-image-threshold": 0,
    "-webkit-shape-margin": 0,
    "-webkit-shape-outside": 0,
    "-webkit-text-decoration-skip": 0,
    "-webkit-text-emphasis-color": 0,
    "-webkit-text-emphasis-position": 0,
    "-webkit-text-emphasis-style": 0,
    "-webkit-transform": 0,
    "-webkit-transform-origin": 0,
    "-webkit-transform-style": 0,
    "-webkit-transition": 0,
    "-webkit-transition-delay": 0,
    "-webkit-transition-duration": 0,
    "-webkit-transition-property": 0,
    "-webkit-transition-timing-function": 0,
    "animation": 0,
    "animation-delay": 0,
    "animation-direction": 0,
    "animation-duration": 0,
    "animation-fill-mode": 0,
    "animation-iteration-count": 0,
    "animation-name": 0,
    "animation-play-state": 0,
    "animation-timing-function": 0,
    "backdrop-filter": 0,
    "backface-visibility": 0,
    "background-clip": 0,
    "border-block-end": 0,
    "border-block-start": 0,
    "box-decoration-break": 0,
    "break-after": 0,
    "break-before": 0,
    "break-inside": 0,
    "clip-path": 0,
    "color-adjust": 0,
    "filter": 0,
    "font-kerning": 0,
    "margin-block-end": 0,
    "margin-block-start": 0,
    "mask": 0,
    "mask-border": 0,
    "mask-border-outset": 0,
    "mask-border-repeat": 0,
    "mask-border-slice": 0,
    "mask-border-source": 0,
    "mask-border-width": 0,
    "mask-clip": 0,
    "mask-composite": 0,
    "mask-image": 0,
    "mask-origin": 0,
    "mask-position": 0,
    "mask-repeat": 0,
    "mask-size": 0,
    "padding-block-end": 0,
    "padding-block-start": 0,
    "perspective": 0,
    "perspective-origin": 0,
    "shape-image-threshold": 0,
    "shape-margin": 0,
    "shape-outside": 0,
    "text-decoration-skip": 0,
    "text-emphasis": 0,
    "text-emphasis-color": 0,
    "text-emphasis-position": 0,
    "text-emphasis-style": 0,
    "transform": 0,
    "transform-origin": 0,
    "transform-style": 0,
    "transition": 0,
    "transition-delay": 0,
    "transition-duration": 0,
    "transition-property": 0,
    "transition-timing-function": 0
  }

  t.deepEqual (actual, expect)
})

test ("9", (t) => {
  const actual = index ({
    "appearance": 0,
    "borderInlineEnd": 0,
    "borderInlineStart": 0,
    "columnCount": 0,
    "columnFill": 0,
    "columnGap": 0,
    "columnRule": 0,
    "columnRuleColor": 0,
    "columnRuleStyle": 0,
    "columnRuleWidth": 0,
    "columns": 0,
    "columnSpan": 0,
    "columnWidth": 0,
    "fontFeatureSettings": 0,
    "fontLanguageOverride": 0,
    "fontVariantLigatures": 0,
    "marginInlineEnd": 0,
    "marginInlineStart": 0,
    "paddingInlineEnd": 0,
    "paddingInlineStart": 0,
    "textDecoration": 0,
    "textDecorationColor": 0,
    "textDecorationLine": 0,
    "textDecorationStyle": 0
  })
  const expect = {
    "-moz-appearance": 0,
    "-moz-border-inline-end": 0,
    "-moz-border-inline-start": 0,
    "-moz-column-count": 0,
    "-moz-column-fill": 0,
    "-moz-column-gap": 0,
    "-moz-column-rule": 0,
    "-moz-column-rule-color": 0,
    "-moz-column-rule-style": 0,
    "-moz-column-rule-width": 0,
    "-moz-column-span": 0,
    "-moz-column-width": 0,
    "-moz-columns": 0,
    "-moz-font-feature-settings": 0,
    "-moz-font-language-override": 0,
    "-moz-font-variant-ligatures": 0,
    "-moz-margin-inline-end": 0,
    "-moz-margin-inline-start": 0,
    "-moz-padding-inline-end": 0,
    "-moz-padding-inline-start": 0,
    "-moz-text-decoration": 0,
    "-moz-text-decoration-color": 0,
    "-moz-text-decoration-line": 0,
    "-moz-text-decoration-style": 0,
    "-webkit-appearance": 0,
    "-webkit-border-inline-end": 0,
    "-webkit-border-inline-start": 0,
    "-webkit-column-count": 0,
    "-webkit-column-fill": 0,
    "-webkit-column-gap": 0,
    "-webkit-column-rule": 0,
    "-webkit-column-rule-color": 0,
    "-webkit-column-rule-style": 0,
    "-webkit-column-rule-width": 0,
    "-webkit-column-span": 0,
    "-webkit-column-width": 0,
    "-webkit-columns": 0,
    "-webkit-font-feature-settings": 0,
    "-webkit-font-language-override": 0,
    "-webkit-font-variant-ligatures": 0,
    "-webkit-margin-inline-end": 0,
    "-webkit-margin-inline-start": 0,
    "-webkit-padding-inline-end": 0,
    "-webkit-padding-inline-start": 0,
    "-webkit-text-decoration": 0,
    "-webkit-text-decoration-color": 0,
    "-webkit-text-decoration-line": 0,
    "-webkit-text-decoration-style": 0,
    "appearance": 0,
    "border-inline-end": 0,
    "border-inline-start": 0,
    "column-count": 0,
    "column-fill": 0,
    "column-gap": 0,
    "column-rule": 0,
    "column-rule-color": 0,
    "column-rule-style": 0,
    "column-rule-width": 0,
    "column-span": 0,
    "column-width": 0,
    "columns": 0,
    "font-feature-settings": 0,
    "font-language-override": 0,
    "font-variant-ligatures": 0,
    "margin-inline-end": 0,
    "margin-inline-start": 0,
    "padding-inline-end": 0,
    "padding-inline-start": 0,
    "text-decoration": 0,
    "text-decoration-color": 0,
    "text-decoration-line": 0,
    "text-decoration-style": 0
  }

  t.deepEqual (actual, expect)
})

test ("10", (t) => {
  const actual = index ({
    "hyphens": 0,
    "textSizeAdjust": 0,
    "userSelect": 0
  })
  const expect = {
    "-moz-hyphens": 0,
    "-moz-text-size-adjust": 0,
    "-moz-user-select": 0,
    "-ms-hyphens": 0,
    "-ms-text-size-adjust": 0,
    "-ms-user-select": 0,
    "-webkit-hyphens": 0,
    "-webkit-text-size-adjust": 0,
    "-webkit-user-select": 0,
    "hyphens": 0,
    "text-size-adjust": 0,
    "user-select": 0
  }

  t.deepEqual (actual, expect)
})

test ("11", (t) => {
  const actual = index ({
    "flowFrom": 0,
    "flowInto": 0,
    "regionFragment": 0,
    "scrollSnapCoordinate": 0,
    "scrollSnapDestination": 0,
    "scrollSnapPointsX": 0,
    "scrollSnapPointsY": 0,
    "scrollSnapType": 0,
    "writingMode": 0
  })
  const expect = {
    "-ms-flow-from": 0,
    "-ms-flow-into": 0,
    "-ms-region-fragment": 0,
    "-ms-scroll-snap-coordinate": 0,
    "-ms-scroll-snap-destination": 0,
    "-ms-scroll-snap-points-x": 0,
    "-ms-scroll-snap-points-y": 0,
    "-ms-scroll-snap-type": 0,
    "-ms-writing-mode": 0,
    "-webkit-flow-from": 0,
    "-webkit-flow-into": 0,
    "-webkit-region-fragment": 0,
    "-webkit-scroll-snap-coordinate": 0,
    "-webkit-scroll-snap-destination": 0,
    "-webkit-scroll-snap-points-x": 0,
    "-webkit-scroll-snap-points-y": 0,
    "-webkit-scroll-snap-type": 0,
    "-webkit-writing-mode": 0,
    "flow-from": 0,
    "flow-into": 0,
    "region-fragment": 0,
    "scroll-snap-coordinate": 0,
    "scroll-snap-destination": 0,
    "scroll-snap-points-x": 0,
    "scroll-snap-points-y": 0,
    "scroll-snap-type": 0,
    "writing-mode": 0
  }

  t.deepEqual (actual, expect)
})

test ("12", (t) => {
  const actual = index ({
    "borderImage": 0
  })
  const expect = {
    "-o-border-image": 0,
    "-webkit-border-image": 0,
    "border-image": 0
  }

  t.deepEqual (actual, expect)
})

test ("13", (t) => {
  const actual = index ({
    "dummy1": "element",
    "dummy2": "isolate-override",
    "dummy3": "plaintext"
  })
  const expect = {
    "dummy1": ["-moz-element", "element"],
    "dummy2": ["-moz-isolate-override", "isolate-override"],
    "dummy3": ["-moz-plaintext", "plaintext"]
  }

  t.deepEqual (actual, expect)
})

test ("14", (t) => {
  const actual = index ({
    "dummy1": "calc",
    "dummy2": "cross-fade",
    "dummy3": "filter",
    "dummy4": "grab",
    "dummy5": "grabbing",
    "dummy6": "image-set",
    "dummy7": "sticky",
    "dummy8": "zoom-in",
    "dummy9": "zoom-out"
  })
  const expect = {
    "dummy1": ["-webkit-calc", "calc"],
    "dummy2": ["-webkit-cross-fade", "cross-fade"],
    "dummy3": ["-webkit-filter", "filter"],
    "dummy4": ["-webkit-grab", "grab"],
    "dummy5": ["-webkit-grabbing", "grabbing"],
    "dummy6": ["-webkit-image-set", "image-set"],
    "dummy7": ["-webkit-sticky", "sticky"],
    "dummy8": ["-webkit-zoom-in", "zoom-in"],
    "dummy9": ["-webkit-zoom-out", "zoom-out"]
  }

  t.deepEqual (actual, expect)
})

test ("15", (t) => {
  const actual = index ({
    "dummy1": "fill-available",
    "dummy2": "fill",
    "dummy3": "fit-content",
    "dummy4": "isolate",
    "dummy5": "max-content",
    "dummy6": "min-content",
    "dummy7": "stretch",
    "dummy8": "pixelated"
  })

  const expect = {
    "dummy1": [
      "-webkit-fill-available",
      "-moz-fill-available",
      "fill-available"
    ],
    "dummy2": ["-webkit-fill", "-moz-fill", "fill"],
    "dummy3": ["-webkit-fit-content", "-moz-fit-content", "fit-content"],
    "dummy4": ["-webkit-isolate", "-moz-isolate", "isolate"],
    "dummy5": ["-webkit-max-content", "-moz-max-content", "max-content"],
    "dummy6": ["-webkit-min-content", "-moz-min-content", "min-content"],
    "dummy7": ["-webkit-stretch", "-moz-stretch", "stretch"],
    "dummy8": [
      "-webkit-pixelated",
      "-moz-pixelated",
      "-o-pixelated",
      "pixelated"
    ]
  }

  t.deepEqual (actual, expect)
})
