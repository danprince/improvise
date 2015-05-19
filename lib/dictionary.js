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

