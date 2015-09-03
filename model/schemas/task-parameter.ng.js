angular.module('noname').factory('TaskParameterSchema', TaskParameterSchema);

function TaskParameterSchema() {
  return new SimpleSchema({
    name : {
      type : String,
      label : 'Name'
    },
    question : {
      type : String,
      label : 'Question'
    }
  });
}