angular.module('noname').factory('TaskSchema', TaskSchema);

function TaskSchema(TaskParameterSchema, TaskResultSchema) {
  return new SimpleSchema({
    name : {
      type : String,
      label : 'Name'
    },
    description : {
      type : String,
      label : 'Description'
    },
    parameters : {
      type : [TaskParameterSchema],
      label : 'Parameters'
    },
    errors : {
      type : [Object],
      label : 'Errors'
    },
    results : {
      type : [TaskResultSchema],
      label : 'Results'
    },
    dependencies : {
      type : [String],
      label : 'Dependencies'
    },
    body : {
      type : String,
      label : 'Body'
    }
  });
}