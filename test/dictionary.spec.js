var chai = require('chai'),
    expect = chai.expect;

var Dictionary = require('../lib/dictionary'),
    Template = require('../lib/template');

describe('Dictionary', function() {
  var json = {
    shape: ['triangle', 'circle', 'square'],
    color: ['red', 'green', 'blue']
  };

  it('should be a function', function() {
    expect(Dictionary).to.be.a('function');
  });

  describe('[constructor]', function() {
    var dictionary = Dictionary(json);
  });

  describe('#randomProperty', function() {

  });


});
