var Dictionary = require('./lib/dictionary'),
    Template = require('./lib/template');

module.exports = Raconteur;

function Raconteur(json) {
  var dictionary = Dictionary(json);

  function tell(name) {
    var story = dictionary[name].map(function(part) {
      return part();
    });

    return flatten(story).join('');
  }

  function flatten(array) {
    return [].concat.apply([], array);
  }

  return {
    tell: tell
  };
}


var rc = Raconteur({
  "story": "{{observation}}. \n{{action}}. \n\"{{call}}!\" called out someone on the ship. \n\"{{blessing}}. You're going to need it.\"",
  "observation": [
    "The sky was {{color}} and the air was {{temperature}}",
    "It was the {{adjective}} kind of weather",
    "{{number}} leagues lay ahead",
    "The {{weather}} {{verb}}ed at your {{feature}}",
    "It was time for sleeping, not watching",
    "The world was as {{color}} as it was {{temperature}}",
    "The smell of salt from the sea was heavy on the air"
  ],
  "action": [
    "You checked for your {{belonging}}",
    "You wondered what you were doing",
    "You wondered whether {{god}} was watching you",
    "You watched as the {{weather}} changed and the horizon came into view",
    "Not for the last time, you wondered whether you had lost your mind",
    "You rubbed the very notion of sleep, from out of your eyes"
  ],
  "call": [
    "We'll arrive before long, best get ready",
    "It's going to be a long time before we see you again",
    "Drop the anchor, we're going ashore",
    "Stow the sails and prepare the rowing boats"
  ],
  "blessing": [
    "May {{god}} watch over you"
  ],
  "adjective": [
    "quiet",
    "eeriest",
    "calmest",
    "strangest",
    "fiercest"
  ],
  "color": [
    "red",
    "blue",
    "grey",
    "green",
    "gold",
    "black",
    "turquoise"
  ],
  "temperature": [
    "cold",
    "warm",
    "hot",
    "icy",
    "blistering",
    "stinging"
  ],
  "number": [
    "Ten",
    "Five",
    "Twenty",
    "Twelve",
    "Three"
  ],
  "weather": [
    "wind",
    "rain",
    "cold",
    "mist",
    "cloud",
    "fog",
    "sea mist"
  ],
  "verb": [
    "howl",
    "tear",
    "claw",
    "mist",
    "scratch",
    "rip",
    "wait",
    "search"
  ],
  "feature": [
    "face",
    "eyes",
    "mouth",
    "brow",
    "hair"
  ],
  "belonging": [
    "cloak",
    "map",
    "dagger",
    "compass",
    "spyglass",
    "key"
  ],
  "god": [
    "Alatir",
    "Eligios",
    "Sarathis"
  ]
});

console.log(rc.tell('story'));

