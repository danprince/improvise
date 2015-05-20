function Sandbox(textarea) {
  var sandbox = {};

  sandbox.label = document.createElement('label');
  sandbox.label.setAttribute('class', 'output');
  sandbox.label.addEventListener('click', evaluate);

  textarea.addEventListener('input', evaluate);
  sandbox.textarea = textarea;
  evaluate();

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

function bootstrap() {
  var sandboxes = document.getElementsByClassName('sandbox');

  [].forEach.call(sandboxes, createSandbox);
}

function createSandbox(parent) {
  var textarea = parent.getElementsByTagName('textarea')[0],
      sandbox = Sandbox(textarea);

  parent.appendChild(sandbox.label);
}

window.addEventListener('load', bootstrap);

