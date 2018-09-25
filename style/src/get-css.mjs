import cache from "./cache.mjs"

/**
 * @param {boolean} [merged=false]
 *   Combine all rulesets into a single string or return an array.
 *
 * @returns {(string|array)} ruleset
 *   Set of CSS rules which include the selectors and declaration blocks.
 */
export default (merged = false) =>
  (merged
    ? Array.from (cache () ()).reduce (
      (styles, [media, rules]) =>
        styles.concat (
          media
            ? `@media ${media}{${Array.from (rules.values ())
              .map (({ rule }) => rule)
              .join ("")}}`
            : Array.from (rules.values ())
              .map (({ rule }) => rule)
              .join ("")
        ),
      []
    )
      .join ("")
    : Array.from (cache () ()).reduce (
      (styles, [media, rules]) => ({
        ... styles,
        [media]: Array.from (rules.values ())
          .map (({ rule }) => rule)
          .join ("")
      }),
      {}
    )
  )
