angular.module('noname').factory('ConversationHistory', ConversationHistory);

function ConversationHistory(ConversationHistorySchema) {
  var collection = new Mongo.Collection('conversationHistory');
  collection.attachSchema(ConversationHistorySchema);
  collection.allow({
    insert : function() {
      return true;
    },
    update : function() {
      return true;
    },
    remove : function() {
      return true;
    }
  });

  collection.addComputerMessage = function(text) {
    collection.insert({
      text : text,
      author : 'Computer'
    });
  };

  collection.addUserMessage = function(text) {
    collection.insert({
      text : text,
      author : 'User'
    });
  };


  return collection;
}