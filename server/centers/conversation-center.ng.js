angular.module('noname').service('ConversationCenter', ConversationCenter);

function ConversationCenter(ConversationHistory, DefaultConversationHandler, AppLogger) {
  this.init = init;

  ///////////////////

  var logger = new AppLogger(ConversationCenter);

  ///////////////////

  function init() {
    logger.debug('Initialising...');

    var defaultConversationHandler = new DefaultConversationHandler();
    defaultConversationHandler.start();

    var initial = true;
    ConversationHistory.find({
      author : 'User'
    }).observe({
      added : function (newMessage) {
        if (!initial) {
          defaultConversationHandler.handleMessage(newMessage.text);
        }
      }
    });
    initial = false;

    logger.info('Initialised.');
  }
}