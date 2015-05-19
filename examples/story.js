var Raconteur = require('../raconteur');

var rc = Raconteur.create({
  story: '{{sky}}\n{{today}}\n{{observation}}\n{{history}}',
  sky: 'The sky was {{color}} and the air was {{temperature}}.',
  today: 'It was just another {{day}} in {{place}}.',
  history: 'And the rest, as they say, was history.',
  observation: [
    'You always knew it would end up this way.',
    'From the moment you had arrived here, you had {{adjective}} it.',
    'This would be your last day in the city.'
  ],
  adjective: [
    'loved',
    'liked',
    'been afraid of',
    'feared'
  ],
  day: [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ],
  place: [
    'London', 'San Francisco', 'Helsinki', 'Paris', 'Amsterdam'
  ],
  color: [
    'red',
    'clear',
    'blue',
    'orange',
    'pink',
    'dark',
    'grey'
  ],
  temperature: [
    'warm',
    'damp',
    'cool',
    'hot',
    'humid',
    'freezing',
    'dry'
  ]
});

var story = rc.tell('story');
console.log(story);

