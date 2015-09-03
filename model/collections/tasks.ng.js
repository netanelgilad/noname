angular.module('noname').factory('Tasks', Tasks);

function Tasks(TaskSchema) {
  var collection = new Mongo.Collection('tasks');
  collection.attachSchema(TaskSchema);
  return collection;
}
