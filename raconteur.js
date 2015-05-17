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

  return raconteur;
}

