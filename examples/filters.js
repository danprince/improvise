var Raconteur = require('../raconteur');

var rc = Raconteur.create({
  main: 'Hello {{name|uppercase}} {{color|uppercase}}. This is {{magic|magical}}!',
  color: ['blue', 'red', 'gold', 'yellow'],
  name: ['nick', 'tom', 'cathy', 'frank'],
  magic: ['amazing', 'wonderful', 'brilliant']
});

rc.addFilters({
  uppercase: function(str) {
    return str[0].toUpperCase() + str.slice(1);
  }
});

rc.addFilter('reverse', function(str) {
  return str.split('').reverse().join('');
});

rc.addFilter('magical', function(str) {
  // ignore incoming str
  return rc.process('absolutely {{magic}}');
});

console.log(rc.tell('main'));
