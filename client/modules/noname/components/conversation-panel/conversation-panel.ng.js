angular.module('noname').directive('conversationPanel', conversationPanel);

function conversationPanel() {
  return  {
    restrict : 'EA',
    templateUrl : 'client/modules/noname/components/conversation-panel/conversation-panel.ng.html',
    bindToController : true,
    controllerAs : 'vm',
    controller : function(ConversationHistory, $meteor) {
      this.messages = $meteor.collection(ConversationHistory, false);
      this.addUserMessage = addUserMessage;

      ///////////////////

      this.userInput = '';

      ///////////////////

      function addUserMessage() {
        if (this.userInput !== '') {
          ConversationHistory.addUserMessage(this.userInput);
          this.userInput = '';
        }
      }
    },
    link : function(scope, element, attrs, ctrl) {
      var isScrolled = false;

      var listElem = element.find('md-list');
      listElem.on('scroll', function() {
        isScrolled = true;

        var listDomElem = element.find('md-list')[0];
        if (listDomElem.scrollTop == (listDomElem.scrollHeight - listDomElem.offsetHeight)) {
          isScrolled = false;
        }
      });

      scope.$watchCollection(function() {
        return ctrl.messages
      }, function() {
        if (!isScrolled) {
          var elem = element.find('md-list')[0];
          elem.scrollTop = elem.scrollHeight;
          isScrolled = false;
        }
      });
    }
  };
}
