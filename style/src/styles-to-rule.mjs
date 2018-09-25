/**
 * @param {string} selector
 *   Pattern that matches against elements or nodes in an XML document.
 * @param {string} block
 *   Structure that groups declarations delimited by braces/curly brackets.
 *
 * @returns {string} ruleset
 *   Set of CSS rules which include the selector and declaration block.
 */
export default (selector, block) => `${selector}{${block}}`
