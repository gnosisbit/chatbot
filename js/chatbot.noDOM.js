var ChatBot = function () {

  //// common vars
  // custom patterns and rewrites
  var patterns

  // the bot's name
  var botName

  // the human's name
  var humanName

  // a selector to all inputs the human can type to
  var inputs

  // the engines to use for answering queries that are not caught by simple patterns
  var engines

  // a callback for after a chat entry has been added
  var addChatEntryCallback

  // list all the predefined commands and the commands of each engine
  function updateCommandDescription() {
    var description = ''

    // first explain manually defined commands and then all by all used engines
    var descriptions = []

    var i, j;
    for (i = 0; i < patterns.length; i++) {
      if (patterns[i].description != undefined) {
        descriptions.push(patterns[i].description)
      }
    }

    for (i = 0; i < engines.length; i++) {
      var caps = engines[i].getCapabilities()
      for (j = 0; j < caps.length; j++) {
        descriptions.push(caps[j])
      }
    }
  }

  return {
    Engines: {
    },
    init: function (options) {
      var settings = Object.assign({
        // these are the defaults.
        botName: 'Bot',
        humanName: 'You',
        inputs: '',
        inputCapabilityListing: true,
        engines: [],
        patterns: [],
        addChatEntryCallback: function (_data, origin) {
          var data = typeof _data === 'string'
            ? { text: _data }
            : _data
          var ret = { origin: origin, data: data }
          console.log(ret)
          return ret
        }
      }, options)

      botName = settings.botName;
      humanName = settings.humanName;
      inputs = settings.inputs;
      // inputCapabilityListing = settings.inputCapabilityListing;
      engines = settings.engines;
      patterns = settings.patterns;
      addChatEntryCallback = settings.addChatEntryCallback;

      // update the command description
      updateCommandDescription();

      // listen to inputs on the defined fields
      // $(inputs).keyup(function (e) {
      //   if (e.keyCode == 13) {
      //     ChatBot.addChatEntry($(this).val(), "human")
      //     ChatBot.react($(this).val())
      //   }
      //   //console.log($(this).val());
      // });

    },
    setBotName: function (name) {
      botName = name;
    },
    setHumanName: function (name) {
      humanName = name;
    },
    getDescritions: function () {
      return descriptions;
    },
    addChatEntry: function addChatEntry(text, origin) {
      console.log('addChatEntry')
      if (addChatEntryCallback) {
        return addChatEntryCallback.call(this, text, origin);
      }
    },
    react: function react(text) {
      // check for custom patterns
      for (var i = 0; i < patterns.length; i++) {
        var pattern = patterns[i];
        var r = new RegExp(pattern.regexp, "i");
        var matches = text.match(r);

        //console.log(matches);
        if (matches) {
          switch (pattern.actionKey) {
            case 'rewrite':
              text = pattern.actionValue;
              for (var j = 1; j < matches.length; j++) {
                text = text.replace("$" + j, matches[j]);
              }
              //console.log("rewritten to " + text);
              if (pattern.callback) {
                pattern.callback.call(this, matches);
              }
              break;
            case 'response':
              // var response = text.replace(r, pattern.actionValue);
              var response = pattern.actionValue;
              if (response) {
                for (var j = 1; j < matches.length; j++) {
                  response = response.replace("$" + j, matches[j]);
                }
                return this.addChatEntry(response, "bot");
              }
              if (pattern.callback) {
                return pattern.callback.call(this, matches);
              }
              return;
          }
          break;
        }
      }

      for (var e = 0; e < engines.length; e++) {
        var engine = engines[e];
        return engine.react(text);
      }

    },
    addPatternObject: function (obj) {
      patterns.push(obj);
      updateCommandDescription();
    },
    addPattern: function (regexp, actionKey, actionValue, callback, description) {
      var obj = {
        regexp: regexp,
        actionKey: actionKey,
        actionValue: actionValue,
        description: description,
        callback: callback
      };
      this.addPatternObject(obj);
    }

  }
}()

exports = ChatBot
