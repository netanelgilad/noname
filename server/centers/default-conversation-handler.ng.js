angular.module('noname').factory('DefaultConversationHandler', DefaultConversationHandler);

function DefaultConversationHandler(Tasks, RunTaskConversationHandler, AppLogger, ConversationHistory) {
  var currentTaskConversationHandler;
  var logger = new AppLogger(DefaultConversationHandler);

  function DefaultConversation() {}

  DefaultConversation.prototype.start = function start() {
    ConversationHistory.addComputerMessage('Type a name of a task to execute it.');
  };

  DefaultConversation.prototype.handleMessage = function handleMessage(text) {
    logger.debug('Got message:', text);
    if (angular.isDefined(currentTaskConversationHandler)) {
      return currentTaskConversationHandler.handleMessage(text);
    }

    var wantedTask = Tasks.findOne({ name : text.toLowerCase() });
    if (angular.isDefined(wantedTask)) {
      logger.debug('Creating new run task conversation for task:', wantedTask.name);
      currentTaskConversationHandler = new RunTaskConversationHandler(wantedTask);
      currentTaskConversationHandler.start();
    }
    else {
      logger.debug('Could not find task:', text);
      ConversationHistory.addComputerMessage('No task called: "' + text + '" :(.');
    }
  };

  return DefaultConversation;
}