angular.module('noname').factory('RunTaskConversationHandler', RunTaskConversationHandler);

function RunTaskConversationHandler(AppLogger, $q, ConversationHistory) {
  var logger = new AppLogger(RunTaskConversationHandler);

  function RunTaskConversation(task) {
    this.task = task;
    this.currentParameter = 0;
    this.messageHandler = angular.noop;
    this.taskParams = {};
  }

  RunTaskConversation.prototype.start = function start() {
    logger.debug('Starting conversation for task:', this.task.name);
    var self = this;
    this.getParameters().then(function startTask(params) {
      logger.debug('Got task parameters. Running task...');
      var results = self.task.run(params);

      self.task.results.forEach(function(resultDef) {
        console.log(resultDef);
        ConversationHistory.addComputerMessage(resultDef.description + ': ' + results[resultDef.name]);
      });
    });
  };

  RunTaskConversation.prototype.handleMessage = function handleMessage(text) {
    this.messageHandler(text);
  };

  // TODO: handle time out in messages
  // TODO: handle messages that are not parameters (exit and such)
  RunTaskConversation.prototype.getParameters = function getParameters(deferred) {
    deferred = deferred || $q.defer();
    var self = this;
    this.getParameter(self.currentParameter).then(function(parameterValue) {
      self.taskParams[self.task.parameters[self.currentParameter].name] = parameterValue;

      if (++self.currentParameter < self.task.parameters.length) {
        self.getParameters(deferred);
      }
      else {
        deferred.resolve(self.taskParams);
      }
    });
    return deferred.promise;
  };

  RunTaskConversation.prototype.getParameter = function getParameter(num) {
    var deferred = $q.defer();
    ConversationHistory.addComputerMessage(this.task.parameters[num].question);
    this.messageHandler = function(text) {
      deferred.resolve(text);
    };

    return deferred.promise;
  };

  return RunTaskConversation;
}