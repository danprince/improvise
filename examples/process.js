var Raconteur = require('../raconteur');

var rc = Raconteur.create({
  language: [
    'Javascript',
    'Ruby',
    'Python',
    'Perl',
    'Haskell',
    'Java',
    'C',
    'Rust',
    'Brainfuck',
    'Go'
  ],
  beverage: [
    'redbull',
    'liquid soap',
    'coffee',
    'water',
    'hand sanitizer',
    'green tea',
    'ginger beer',
    'medicine',
    'cola'
  ],
  snack: [
    'smoked salmon bagels',
    'inkjet cartridges',
    'quinoa',
    'pickle sandwiches',
    'coriander soup',
    'batteries',
    'doritos'
  ]
});

var joke = rc.process('I am a {{language}} programmer, therefore I only drink {{beverage}} and eat {{snack}}.');

console.log(joke);

