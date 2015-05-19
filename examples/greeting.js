var Raconteur = require('../raconteur');

var rc = Raconteur.create({
  greeting: 'Raconteur, tells the {{adjective}} stories!',
  adjective: [
    'best',
    'brilliant',
    'most {{adjective}}'
  ]
});

console.log(rc.tell('greeting'));
