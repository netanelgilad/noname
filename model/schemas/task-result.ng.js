angular.module('noname').factory('TaskResultSchema', TaskResultSchema);

function TaskResultSchema() {
  return new SimpleSchema({
    name : {
      type : String,
      label : 'Name'
    },
    description : {
      type : String,
      label : 'Question'
    }
  });
}
