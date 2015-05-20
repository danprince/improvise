var Dictionary = require('./lib/dictionary'),
    Template = require('./lib/template'),
    symbols = require('./lib/symbols');

module.exports = Improvise;

/**
 * @name Improvise
 * @type {function}
 * @param {object} json
 * @description
 * The wrapper object which combines both the dictionary and the
 * templates to create a usable interface for creating dictionaries
 * and evaluating properties from them.
 */
function Improvise(json) {
  var dictionary = Dictionary(json);

  function improvise(name) {
    return evaluate(dictionary[name]);
  }

  function evaluate(callableList) {
    return callableList.map(function(fn) {
      return fn.call();
    })
    .join('');
  }

  // alias function to property
  improvise.create = improvise;

  // alias for symbol setting
  improvise.__setSyntax__ = symbols.__set__;

  // process a raw string
  improvise.eval = function process(string) {
    var callableTemplate = dictionary.__callable__(Template(string));
    return evaluate(callableTemplate);
  };

  // add a new filter
  improvise.addFilter = function(name, filter) {
    dictionary.__addFilter__(name, filter);
    return improvise;
  };

  // add an object of filters
  improvise.addFilters = function(filters) {
    Object.keys(filters).forEach(function(name) {
      improvise.addFilter(name, filters[name]);
    });
    return improvise;
  };

  // allow runtime extension
  improvise.extend = function(json) {
    dictionary.__extend__(json);
    return improvise;
  };

  return improvise;
}

/**
 * @name Improvise.grammar
 * @type {function}
 * @param {object} json
 * @description
 * An alias for the constructor style Improvise function.
 */
Improvise.grammar = function() {
  return Improvise.apply(null, arguments);
};

// browser shim
if(typeof window === 'object') {
  window.Improvise = Improvise;
}

