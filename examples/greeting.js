var Raconteur = require('../raconteur');

var rc = Raconteur({
  greeting: 'Raconteur, tells the {{adjective}} stories!',
  adjective: [
    'best',
    'brilliant',
    'most {{adjective}}'
  ]
});

console.log(rc.tell('greeting'));
