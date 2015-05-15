var symbols = module.exports = {
  "open": "{{",
  "close": "}}"
};

symbols.__set__ = function(name, symbol) {
  symbols[name] = symbol;
};
