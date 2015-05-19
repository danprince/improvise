var Raconteur = require('../raconteur');

var rc = Raconteur.create({
  main: 'Raconteur stands for {{r}} {{a}} {{c}} {{o}} {{n}} {{t}} {{e}} {{u}} {{r2}}.',
  r: ['ranting', 'rabid', 'rapid'],
  a: ['antelopes', 'aphids', 'anteaters', 'astronauts'],
  c: ['carrying', 'closing', 'calling'],
  o: ['on', 'over'],
  n: ['needy', 'nasty', 'naughty'],
  t: ['terapins', 'turtles', 'tornados', 'tapdancers'],
  e: ['eating', 'exorcising'],
  u: ['underfed', 'untreated', 'unworthy'],
  r2: ['rabbits', 'rats', 'reptiles']
});

console.log(rc.tell('main'));
