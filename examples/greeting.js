var Improvise = require('../improvise');

var improv = Improvise.grammar({
  greeting: 'Improvise, tells the {{adjective}} stories!',
  adjective: [
    'best',
    'brilliant',
    'most {{adjective}}'
  ]
});

console.log(improv('greeting'));
