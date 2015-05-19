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

