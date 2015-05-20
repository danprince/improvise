var symbols = module.exports = {
  "open": "{{",
  "close": "}}",
  "filter": "|"
};

symbols.__set__ = function(name, symbol) {
  symbols[name] = symbol;
};

