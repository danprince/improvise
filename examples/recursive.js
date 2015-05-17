var Raconteur = require('../raconteur');

var rc = Raconteur({
  main: 'Raconteur supports {{recursion}}.',
  recursion: [
    '{{recursion}}',
    'recursive definition',
    'recursively defined {{recursion}}'
  ]
});

for(var i = 0; i < 10; i++)
  console.log(rc.tell('main'));
