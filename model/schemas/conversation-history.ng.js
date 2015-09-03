angular.module('noname').factory('ConversationHistorySchema', ConversationHistorySchema);

function ConversationHistorySchema() {
  return new SimpleSchema({
    text : {
      type : String,
      label : 'Text'
    },
    author : {
      type : String,
      label : 'Author',
      allowedValues : ['User', 'Computer']
    },
    createdAt: {
      type: Number,
      autoValue: function() {
        if (this.isInsert) {
          return new Date().getTime();
        } else if (this.isUpsert) {
          return {$setOnInsert: new Date().getTime()};
        } else {
          this.unset();
        }
      }
    }
  });
}
