(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Template = require('./template');

module.exports = Dictionary;

/**
 * @name Dictionary
 * @type {Dictionary}
 * @description
 * Takes a JSON grammar representing a dictionary and uses Template
 * to turn it into a set of compiled functions, ready to generate
 * texts.
 */
function Dictionary(json) {
  var dictionary = translate(json);

  // expose the callable method
  dictionary.__callable__ = callable;
  // store filters
  dictionary.__filters__ = {};

  // add a new filter
  dictionary.__addFilter__ = function(name, fn) {
    dictionary.__filters__[name] = fn;
  };

  // allow extending the dictionary at runtime
  dictionary.__extend__ = function(json) {
    var extension = translate(json);
    Object.keys(extension).forEach(function(key) {
      dictionary[key] = extension[key];
    });
  };

  /**
   * @name translate
   * @param {object} obj
   * @description
   * Recursively turns a dictionary object into a set of compiled
   * templates, wrapped in functions.
   */
  function translate(obj) {
    var dict = {};

    Object.keys(obj).forEach(function(key) {
      if(typeof obj[key] === 'object') {
        dict[key] = translate(obj[key]);
      } else {
        dict[key] = callable(Template(obj[key]));
      }
    });

    return dict;
  }

  /**
   * @name callable
   * @param {template} template
   * @return {array}
   * @description
   * Turns a template returned from the Template function
   * into a function that will perform either a text rendering
   * or a dictionary lookup.
   *
   * Returns array of callable template functions.
   */
  function callable(template) {
    return template.map(function(part) {
      var call = null;

      if(typeof part === 'object') {
        call = lookup(part);
      } else {
        call = render(part);
      }

      // useful to see when debugging
      call.__raw__ = part;

      return call;
    });
  }

  /**
   * @name lookup
   * @param {obj} part
   * @return {function}
   * @description
   * Takes a template part (an object with a name property) and
   * returns a function which will perform a dictionary lookup for
   * that name.
   */
  function lookup(part) {
    return function __lookup__() {
      if(!(dictionary.hasOwnProperty(part.name))) {
        throw new ReferenceError(part.name + ' does not exist in dictionary');
      }

      var reference = dictionary[part.name],
          template = null;

      // array => template
      if(reference instanceof Array) {
        return evaluate(reference, part.filters);
      // object => random choice
      } else if(typeof reference === 'object') {
        return evaluate(Dictionary.randomProperty(reference), part.filters);
      } else {
        return reference;
      }
    };
  }

  /**
   * @name render
   * @param {string} part
   * @return {function}
   * @description
   * Returns a function which will return a string provided as a
   * parameter.
   */
  function render(string) {
    return function __render__() {
      return string;
    };
  }

  /**
   * @name evaluate
   * @param {template} template
   * @return {array}
   * @description
   * Evaluates a template and returns the result.
   */
  function evaluate(template, filters) {
    if(typeof template === 'function') {
      return template();
    }

    filters = filters || [];
    var output = template.map(function(fn) {
      return fn();
    }).join('');

    if(filters.length <= 0) {
      return output;
    } else {
      return filters.reduce(function(value, filterName) {
        var filter = dictionary.__filters__[filterName];
        return filter(value);
      }, output);
    }
  }

  return dictionary;
}

/**
 * @name Dictionary.randomProperty
 * @description
 * Returns a random value, given an object. This behaviour is used
 * to create the random key selection for lookups.
 */
Dictionary.randomProperty = function(object) {
  var keys = Object.keys(object),
      index = Math.floor(keys.length * Math.random());

  return object[index];
};


},{"./template":3}],2:[function(require,module,exports){
var symbols = module.exports = {
  "open": "{{",
  "close": "}}",
  "pipe": "|"
};

symbols.__set__ = function(name, symbol) {
  symbols[name] = symbol;
};

},{}],3:[function(require,module,exports){
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

  var pattern = [ '(', symbols.open, '[\\|\\w]+', symbols.close, ')' ],
      regex = new RegExp(pattern.join(''), 'g'),
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
      expr = raw.split(symbols.pipe);

  tag.name = expr[0];
  tag.filters = expr.slice(1);
  return tag;
};


},{"./symbols":2}],4:[function(require,module,exports){
var Dictionary = require('./lib/dictionary'),
    Template = require('./lib/template');

module.exports = Raconteur;

/**
 * @name Raconteur
 * @type {function}
 * @param {object} json
 * @description
 * The wrapper object which combines both the dictionary and the
 * templates to create a usable interface for creating dictionaries
 * and evaluating properties from them.
 */
function Raconteur(json) {
  var raconteur = {},
      dictionary = Dictionary(json);

  function evaluate(callableList) {
    return callableList.map(function(fn) {
      return fn.call();
    })
    .join('');
  }

  // process a raw string
  raconteur.process = function process(string) {
    var callableTemplate = dictionary.__callable__(Template(string));
    return evaluate(callableTemplate);
  };

  // evaluate a dictionary key
  raconteur.tell = function tell(name) {
    return evaluate(dictionary[name]);
  };

  // add a new filter
  raconteur.addFilter = function(name, filter) {
    dictionary.__addFilter__(name, filter);
    return raconteur;
  };

  // add an object of filters
  raconteur.addFilters = function(filters) {
    Object.keys(filters).forEach(function(name) {
      raconteur.addFilter(name, filters[name]);
    });
    return raconteur;
  };

  // allow runtime extension
  raconteur.extend = function(json) {
    dictionary.__extend__(json);
    return raconteur;
  };

  return raconteur;
}

/**
 * @name Raconteur.create
 * @type {function}
 * @param {object} json
 * @description
 * An alias for the constructor style Raconteur function.
 */
Raconteur.create = function() {
  return Raconteur.apply(null, arguments);
};

// browser shim
if(window) {
  window.Raconteur = Raconteur;
}


},{"./lib/dictionary":1,"./lib/template":3}]},{},[4]);
