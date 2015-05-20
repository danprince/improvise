var symbols = require('./symbols');

module.exports = Template;

/**
 * @name Template
 * @type {Template}
 * @description
 * Turns a string into a compiled template, ready to be
 * supplied with data for rendering.
 * "Hello {{name}}, what you think of the {{weather}}?"
 * ['Hello ', template('name'), ', what you think of the ', template('weather')]
 */
function Template(string) {
  if(typeof string != 'string') {
    throw new TypeError('Expected string, but got ' + typeof string);
  }

  return [string]
    .map(Template.parse)
    .map(Template.compile)
    .shift();
}

/**
 * @name Template.parse
 */
Template.parse = function(string) {
  if(typeof string != 'string') {
    throw new TypeError('Expected string, but got ' + typeof string);
  }

  var pattern = [ '(', symbols.open, '[\\', symbols.filter,
        '\\w]+', symbols.close, ')' ].join(''),
      regex = new RegExp(pattern, 'g'),
      splits = string.split(regex) || [];

  // deal with weird split behaviour
  return splits.filter(function(string) {
    return string.length > 0;
  });
};

/**
 * @name Template.stripTags
 * @description
 */
Template.stripTags = function(tag) {
  if(typeof tag != 'string') {
    throw new TypeError('Expected string, but got ' + typeof tag);
  }

  var startIndex = symbols.open.length,
      endIndex = tag.length - symbols.close.length;

  return tag.slice(startIndex, endIndex);
};

/**
 * @name Template.compile
 * @description
 */
Template.compile = function(template) {
  if(typeof template != 'object') {
    throw new TypeError('Expected object, but got ' + typeof template);
  }

  function isTag(string) {
    return string.slice(0, symbols.open.length) === symbols.open;
  }

  return template.map(function(part) {
    if(isTag(part)) {
      return Template.tag(part);
    } else {
      return part;
    }
  });
};

Template.tag = function(string) {
  var tag = {},
      raw = Template.stripTags(string),
      expr = raw.split(symbols.filter);

  tag.name = expr[0];
  tag.filters = expr.slice(1);
  return tag;
};

