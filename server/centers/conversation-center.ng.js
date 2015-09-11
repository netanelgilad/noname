angular.module('noname').service('ConversationCenter', ConversationCenter);

function ConversationCenter(ConversationHistory, $q, AppLogger, Tasks, $injector, Processes, ProcessRunner) {
  this.init = init;
  this.startConversation = startConversation;
  this.askQuestion = askQuestion;
  this.registerUserInputHandler = registerUserInputHandler;

  ///////////////////

  var logger = new AppLogger(ConversationCenter);
  var userInputHandlers = [];
  var inputHandlersIds = 0;

  ///////////////////

  function init() {
    logger.debug('Initialising...');

    var initial = true;
    ConversationHistory.find({
      author : 'User'
    }).observe({
      added : function (newMessage) {
        if (!initial) {
          angular.forEach(userInputHandlers, function(handler) {
            handler.cb(newMessage.text);
          });
        }
      }
    });
    initial = false;

    this.askQuestion('What task would you like to execute?').then(function(answer) {
      logger.debug('Got message:', answer);

      var wantedProcess = Processes.findOne({ name : answer.toLowerCase() });

      if (angular.isDefined(wantedProcess)) {
        logger.debug('Creating new run task conversation for task:', wantedProcess.name);
        ProcessRunner.run(wantedProcess);
      }
      else {
        var wantedTask = Tasks.findOne({name : answer.toLowerCase() });

        if (angular.isDefined(wantedTask)) {
          wantedTask.run();
        }
        else {
          logger.debug('Could not find task:', answer);
          ConversationHistory.addComputerMessage('No task called: "' + answer + '" :(.');
        }
      }
    });

    logger.info('Initialised.');
  }

  function registerUserInputHandler(cb) {
    var handlerId = inputHandlersIds++;
    userInputHandlers.push({
      id : handlerId,
      cb : cb
    });

    return function() {
      userInputHandlers.splice(_.indexOf(userInputHandlers, { id: handlerId, cb : cb }), 1);
    };
  }

  function askQuestion(question) {
    var deferred = $q.defer();

    ConversationHistory.insert({
      author : 'Computer',
      text: question
    });

    var deregister = this.registerUserInputHandler(function(answer) {
      deregister();
      deferred.resolve(answer);
    });

    return deferred.promise;
  }

  function startConversation(conversationDescriptor, existingConversationResult) {
    var self =  this;

    if (conversationDescriptor.type === 'subConversations') {
      var conversationResult = {};

      if (conversationDescriptor.initiliazer) {
        conversationResult = conversationDescriptor.initiliazer();
      }

      return conversationDescriptor.subConversations.reduce(function(promise, subConversation) {
        return promise.then(function() {
          return self.startConversation(subConversation, conversationResult);
        });
      }, $q.when(conversationResult)).then(function() {
        if (!angular.isUndefined(conversationDescriptor.handler)) {
          var injectables = {};
          if (conversationDescriptor.injectables) {
            angular.forEach(conversationDescriptor.injectables, function (injectable) {
              injectables[injectable] = $injector.get(injectable);
            });
          }

          conversationDescriptor.handler(conversationResult, existingConversationResult, injectables);
        }
      })
    }
    else if (conversationDescriptor.type === 'question') {
      return self.askQuestion(conversationDescriptor.computerMessage).then(function(answer) {
        var injectables = {};
        if (conversationDescriptor.injectables) {
          angular.forEach(conversationDescriptor.injectables, function (injectable) {
            injectables[injectable] = $injector.get(injectable);
          });
        }

        conversationDescriptor.handler(answer, existingConversationResult, injectables);
      });
    }
    else if (conversationDescriptor.type === 'options') {
      function runSingleConversation(computerMessage) {
        return self.askQuestion(computerMessage).then(function(answer) {
          var wantedOption = _.findWhere(conversationDescriptor.options, { match : answer });

          var userInteractionFinished = $q.when([]);

          if (!wantedOption && answer !== conversationDescriptor.endUserMessage) { // TODO: handle the wanted option could not be found
            ConversationHistory.insert({
              author : 'Computer',
              text : 'The option you wanted does not exist'
            });
          }
          else {
            userInteractionFinished = self.startConversation(wantedOption.conversation, existingConversationResult);
          }

          userInteractionFinished.then(function() {
            if (conversationDescriptor.repeat === true && answer !== conversationDescriptor.endUserMessage) {
              runSingleConversation(conversationDescriptor.repeatComputerMessage);
            }
          })
        });
      }

      runSingleConversation(conversationDescriptor.computerMessage);
    }
    else if (conversationDescriptor.type === 'computerMessage') {
      var injectables = {};
      if (conversationDescriptor.injectables) {
        angular.forEach(conversationDescriptor.injectables, function (injectable) {
          injectables[injectable] = $injector.get(injectable);
        });
      }

      ConversationHistory.insert({
        author : 'Computer',
        text : conversationDescriptor.computerMessage(existingConversationResult, injectables)
      });

      console.log('current process: ' + existingConversationResult);

      return $q.when([]);
    }
    else { // TODO: handle unknown type
      throw new Error("Unknown conversation type " + conversationDescriptor.type + ".");
    }
  }
}