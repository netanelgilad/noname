angular.module('noname').run(StartCenters);

function StartCenters(ConversationCenter, AppLogger) {
  var logger = new AppLogger(StartCenters);
  logger.info('Starting logic centers');
  ConversationCenter.init();
}