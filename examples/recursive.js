var Improvise = require('../improvise');

var improv = Improvise.grammar({
  main: 'Improvise supports {{recursion}}.',
  recursion: [
    '{{recursion}}',
    'recursive definition',
    'recursively defined {{recursion}}'
  ]
});

for(var i = 0; i < 10; i++)
  console.log(improv('main'));
