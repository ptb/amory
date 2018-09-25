/**
 * @param {string} propertyName
 *   Camel-case identifier specifying a stylistic CSS feature to change.
 *
 * @returns {string} property-name
 *   Kebab-case identifier specifying a stylistic CSS feature to change.
 */
export default (propertyName) =>
  propertyName
    .replace (/[A-Z]/g, "-$&")
    .toLowerCase ()
    .replace (/^ms-/, "-ms-")
