var ChatBot = require('chatbot')


var sampleConversation = [
  "Hi",
  "My name is Fry",
  "Where is China?",
  "What is the population of China?",
  "Bye"
];


var duckduckgoEngine = function () {

  // patterns that the engine can resolve
  var capabilities = [
    "Ask what something is like 'What is DNA'?",
    "Ask where something is like 'Where is China'?",
    "Ask about a person like 'Who is Bill Gates'?",
    "Say a movie/person/location name like 'Braveheart' to get information about that entity",
    "Say a something like 'simpsons characters' to get information about that phrase",
  ];

  return {
    react: function (query) {
      // $.ajax({
      //   type: 'GET',
      //   url: 'http://api.duckduckgo.com/?format=json&pretty=1&q=' + encodeURIComponent(query),
      //   dataType: 'jsonp'
      // }).done(function (data) {

      //   ChatBot.addChatEntry(data, "bot");
      // });
      return ChatBot.addChatEntry({ text: 'Big ass text', query: query }, "bot");
    },
    getCapabilities: function () {
      return capabilities;
    },
    getSuggestUrl: function () {
      return null;
    }
  }
}

var config = {
  botName: 'Duck Duck Go Bot',
  // inputs: '#humanInput',
  inputCapabilityListing: true,
  engines: [duckduckgoEngine()]
};


ChatBot.init(config);
ChatBot.setBotName("Duck Duck Go Bot");
ChatBot.addPattern("^hi$", "response", "Howdy, friend", undefined, "Say 'Hi' to be greeted back.");
ChatBot.addPattern("^bye$", "response", "See you later buddy", undefined, "Say 'Bye' to end the conversation.");
ChatBot.addPattern("(?:my name is|I'm|I am) (.*)", "response", "hi $1, thanks for talking to me today", function (matches) {
  ChatBot.setHumanName(matches[1]);
}, "Say 'My name is [your name]' or 'I am [name]' to be called that by the bot");
ChatBot.addPattern("(what is the )?meaning of life", "response", "42", undefined, "Say 'What is the meaning of life' to get the answer.");
ChatBot.addPattern("compute ([0-9]+) plus ([0-9]+)", "response", undefined, function (matches) {
  return ChatBot.addChatEntry("That would be " + (1 * matches[1] + 1 * matches[2]) + ".", "bot");
}, "Say 'compute [number] plus [number]' to make the bot your math monkey");


/**
 * Serviço que responde a URI _/test/hello_
 * @param {Object} params - Objeto com os parâmetros enviados na requisição.
 * @param {http.Request} request - Wrapper da classe HttpServletRequest do Java.
 * @param {http.Response} response - Wrapper da classe HttpServletResponse do Java.
 */
function hello(params, request, response) {
  ChatBot.addChatEntry(params.text, params.name)
  print('')
  print(params.text)
  print('')
  response.json(ChatBot.react(params.text))
  // response.write('Hello World!')
}

exports = {
  hello: hello
}
