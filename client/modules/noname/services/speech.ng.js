angular.module('noname').service('SpeechCenter', SpeechCenter);

function SpeechCenter(ConversationHistory, $meteorSubscribe) {
  this.init = init;

  /////////////////////////

  function init() {
    $meteorSubscribe.subscribe('conversationHistory').then(function() {
      ConversationHistory.find({
        author : 'Computer'
      }, {
        sort : {
          createdAt : -1
        },
        limit : 1
      }).observe({
        addedAt : function(newMessage) {
          var lastMessage = ConversationHistory.findOne({}, {sort : {createdAt : -1}});
          if (angular.isDefined(lastMessage) && lastMessage.author === 'Computer') {
            speak(newMessage.text);
          }
        }
      });
    });
  }

  function speak(text, callback) {
    var u = new SpeechSynthesisUtterance();
    u.text = text;
    u.lang = 'en-US';
    var voices = speechSynthesis.getVoices();
    var derangedVoice = voices.filter(function (voice) {
      return voice.name == 'Deranged';
    })[0];
    u.voice = derangedVoice;

    u.onend = function () {
      if (callback) {
        callback();
      }
    };

    u.onerror = function (e) {
      if (callback) {
        callback(e);
      }
    };

    speechSynthesis.speak(u);
  }

  function setupSpeechRegocnition() {
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = function (e) {
      for (var i = e.resultIndex; i < e.results.length; ++i) {
        if (e.results[i].isFinal) {
          ConversationHistory.addUserMessage(e.results[i][0].transcript);
        }
      }
    };

    // start listening
    recognition.start();
  }
}