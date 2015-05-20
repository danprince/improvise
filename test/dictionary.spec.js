var chai = require('chai'),
    expect = chai.expect;

var Dictionary = require('../lib/dictionary');

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

    it('should return an object', function() {
      expect(dictionary).to.be.an('object');
    });

    it('should have the correct properties', function() {
      expect(dictionary).to.have.property('shape');
      expect(dictionary).to.have.property('color');
    });

    it('should have the correct meta properties', function() {
      expect(dictionary).to.have.property('__callable__');
      expect(dictionary).to.have.property('__filters__');
      expect(dictionary).to.have.property('__addFilter__');
      expect(dictionary).to.have.property('__extend__');
    });

  });
});
