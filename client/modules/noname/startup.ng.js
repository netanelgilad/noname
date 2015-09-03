angular.module('noname').run(StartBackgroundServices);

function StartBackgroundServices(SpeechCenter) {
  SpeechCenter.init();
}