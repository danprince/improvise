var symbols = module.exports = {
  "open": "{{",
  "close": "}}",
  "pipe": "|"
};

symbols.__set__ = function(name, symbol) {
  symbols[name] = symbol;
};

