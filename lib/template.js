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

  var pattern = new RegExp(symbols.open + '[\\w]+' + symbols.close, 'g'),
      matches = string.match(pattern) || [],
      tagsRanges = matches.map(findRange).map(tag),
      ranges = [],
      start = 0;

  function tag(range) {
    range.tag = true;
    return range;
  }

  function findRange(match) {
    var index = string.indexOf(match);

    return {
      start: index,
      end: index + match.length
    };
  }

  // fill in the gaps between the tags
  tagsRanges.forEach(function(range) {
    ranges.push({
      start: start,
      end: range.start
    });

    ranges.push(range);
    start = range.end;
  });

  // fill in the final range
  ranges.push({
    start: ranges[ranges.length - 1].end,
    end: string.length
  });

  return {
    raw: string,
    ranges: ranges.filter(function(r) {
      return r.end - r.start > 0;
    })
  };
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

  var string = template.raw;
  return template.ranges.map(function(r) {
    if(r.tag) {
      return {
        lookup: Template.stripTags(string.slice(r.start, r.end))
      };
    } else {
      return {
        render: string.slice(r.start, r.end)
      };
    }
  });
};

