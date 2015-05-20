var app = {};

app.bootstrap = function() {
  var sandboxes = document.getElementsByClassName('sandbox');
  console.log('bootstrap');

  [].forEach.call(sandboxes, app.createSandbox);
};

app.createSandbox = function(parent) {
  var textarea = parent.getElementsByTagName('textarea')[0],
      sandbox = Sandbox(textarea);

  parent.appendChild(sandbox.label);
};

window.addEventListener('load', app.bootstrap);

function Sandbox(textarea) {
  var sandbox = {};

  sandbox.label = document.createElement('label');
  sandbox.label.setAttribute('class', 'output');
  sandbox.label.addEventListener('click', evaluate);

  textarea.addEventListener('input', evaluate);
  sandbox.textarea = textarea;
  resize();
  evaluate();

  function resize() {
    var scrollHeight = textarea.scrollHeight;

    console.log(scrollHeight, Sandbox.MIN_HEIGHT);
    if(scrollHeight > Sandbox.MAX_HEIGHT) {
      height = Sandbox.MAX_HEIGHT;
    } else if(scrollHeight < Sandbox.MIN_HEIGHT) {
      height = Sandbox.MIN_HEIGHT;
    } else {
      height = scrollHeight;
    }

    textarea.style.height = height + 'px';
  }

  function evaluate() {
    var src = textarea.value,
        console = Sandbox.consoleProxy(sandbox.label);

    // clear the output first
    sandbox.label.innerText = '';

    try {
      /* jshint ignore:start */
      eval(src);
      /* jshint ignore:end */
    } catch(err) {
      console.error(err);
    }
  }

  return sandbox;
}

Sandbox.MAX_HEIGHT = 500;
Sandbox.MIN_HEIGHT = 50;

Sandbox.consoleProxy = function(element) {
  return {
    log: function(message) {
      message = [].join.call(arguments, ' ');
      element.innerText += (message + '\n');
      element.setAttribute('disabled', false);
      console.log.apply(console, arguments);
    },
    error: function(message) {
      element.setAttribute('disabled', true);
      element.innerText = message;
    }
  };
};


