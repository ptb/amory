/**
 * @param {string} fontFamily
 *   Name specifying the font-family name for font-family name matching.
 * @param {string} declarations
 *   Collection of property name and property value pairs.
 *
 * @returns {string} at-rule
 *   Font rules which include the font-family name and other font properties.
 */
export default (fontFamily, declarations) =>
  `@font-face{font-family:${fontFamily};${declarations}}`
