/**
 * @param {string} selector
 *   Pattern that matches against elements or nodes in an XML document.
 * @param {string} [pseudo=""]
 *   Keyword added to a selector that specifies a special state of an element.
 *
 * @returns {string} selector
 *   Pattern that matches against elements or nodes in an XML document.
 */
export default (selector, pseudo = "") => `.${selector}${pseudo}`
