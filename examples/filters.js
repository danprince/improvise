var improvise = require('../improvise');

var improv = improvise.grammar({
  main: 'Hello {{name|uppercase}} {{color|uppercase}}. This is {{magic|magical}}!',
  color: ['blue', 'red', 'gold', 'yellow'],
  name: ['nick', 'tom', 'cathy', 'frank'],
  magic: ['amazing', 'wonderful', 'brilliant']
})

.addFilters({
  uppercase: function(str) {
    return str[0].toUpperCase() + str.slice(1);
  }
})

.addFilter('reverse', function(str) {
  return str.split('').reverse().join('');
})

.addFilter('magical', function(str) {
  // ignore incoming str
  return improv.eval('absolutely {{magic}}');
});

console.log(improv('main'));

