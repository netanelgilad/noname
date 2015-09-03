angular.module('noname').run(PublishConversationHistory);

function PublishConversationHistory(ConversationHistory) {
  Meteor.publish('conversationHistory', function() {
    return ConversationHistory.find({});
  });
}