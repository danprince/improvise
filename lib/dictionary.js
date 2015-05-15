var chalk = require('chalk'),
    util = require('util');

var Template = require('./template');

module.exports = Dictionary;

function Dictionary(json) {
  var dictionary = translate(json);

  function translate(obj) {
    var dict = {};

    Object.keys(obj).forEach(function(key) {
      // preserve arrays
      if(obj[key] instanceof Array) {
        dict[key] = [];
      }

      if(typeof obj[key] === 'object') {
        dict[key] = translate(obj[key]);
      } else {
        dict[key] = callable(Template(obj[key]));
      }
    });

    return dict;
  }

  function callable(template) {
    return template.map(function(part) {
      if(typeof part === 'object') {
        return lookup(part);
      } else {
        return render(part);
      }
    });
  }

  function lookup(part) {
    return function __lookup__() {
      var reference = dictionary[part.name];

      if(typeof reference === 'object') {
        var template = Dictionary.randomProperty(reference);
        return evaluate(template);
      } else if(typeof reference === 'function') {
        return reference();
      } else {
        return reference;
      }
    };
  }

  function render(string) {
    return function __render__() {
      return string;
    };
  }

  function evaluate(template) {
    var tpl = template.map(function(fn) {
      return fn();
    });
    return tpl;
  }

  return dictionary;
}

Dictionary.randomProperty = function(object) {
  var keys = Object.keys(object),
      index = Math.floor(keys.length * Math.random());

  return object[index];
};
