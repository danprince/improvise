var chai = require('chai'),
    expect = chai.expect;

var Template = require('../lib/template');

describe('Template', function() {
  it('should be a function', function() {
    expect(Template).to.be.a('function');
  });

  describe('[constructor]', function() {
    var template = Template('Today is {{day}}');

    it('should return an array', function() {
      expect(template).to.be.an.instanceOf(Array);
    });

    it('should have two elements', function() {
      expect(template).to.have.length(2);
    });

    it('first element should be render text', function() {
      expect(template[0]).to.be.eql({
        render: 'Today is '
      });
    });

    it('second element should be lookup text', function() {
      expect(template[1]).to.be.eql({
        lookup: 'day'
      });
    });

    it('should throw an error when called with non strings', function() {
      expect(function() { Template({}); }).to.throw(TypeError);
      expect(function() { Template(null); }).to.throw(TypeError);
      expect(function() { Template(0); }).to.throw(TypeError);
      expect(function() { Template([]); }).to.throw(TypeError);
    });
  });

  describe('#parse', function() {
    var parsed = Template.parse('{{hello}},{{world}}');

    it('should be a function', function() {
      expect(Template.parse).to.be.a('function');
    });

    it('should return an object', function() {
      expect(parsed).to.be.an('object');
    });

    it('should have two properties', function() {
      expect(parsed).to.have.property('raw');
      expect(parsed).to.have.property('ranges');
    });

    it('should have correctly typed properties', function() {
      expect(parsed.raw).to.be.a('string');
      expect(parsed.ranges).to.be.an.instanceOf(Array);
    });

    it('should throw an error when called with non strings', function() {
      expect(function() { Template.parse({}); }).to.throw(TypeError);
      expect(function() { Template.parse(null); }).to.throw(TypeError);
      expect(function() { Template.parse(0); }).to.throw(TypeError);
      expect(function() { Template.parse([]); }).to.throw(TypeError);
    });
  });

  describe('#compile', function() {
    var parsed = Template.parse('{{hello}},{{world}}'),
        compiled = Template.compile(parsed);

    it('should be a function', function() {
      expect(Template.compile).to.be.a('function');
    });

    it('should return an array', function() {
      expect(compiled).to.be.an.instanceOf(Array);
    });

    it('should have 3 elements', function() {
      expect(compiled).to.have.length(3);
    });

    it('should throw an error when called with non objects', function() {
      expect(function() { Template.parse({}); }).to.throw(TypeError);
      expect(function() { Template.parse(''); }).to.throw(TypeError);
      expect(function() { Template.parse(0); }).to.throw(TypeError);
      expect(function() { Template.parse(null); }).to.throw(TypeError);
    });
  });

  describe('#stripTags', function() {
    var stripped = Template.stripTags('{{hello}}');

    it('should be a function', function() {
      expect(Template.stripTags).to.be.a('function');
    });

    it('should return a string', function() {
      expect(stripped).to.be.a('string');
    });

    it('should have removed the tag symbols', function() {
      expect(stripped).to.be.equal('hello');
    });

    it('should throw an error when called with non strings', function() {
      expect(function() { Template.stripTags({}); }).to.throw(TypeError);
      expect(function() { Template.stripTags(null); }).to.throw(TypeError);
      expect(function() { Template.stripTags(0); }).to.throw(TypeError);
      expect(function() { Template.stripTags([]); }).to.throw(TypeError);
    });
  });

});
