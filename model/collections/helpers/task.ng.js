angular.module('noname').run(DefineTaskHelpers);

function DefineTaskHelpers(Tasks, $injector) {
  Tasks.helpers({
    run : function(params) {
      var functionDefinition = ['env', 'params', 'results', this.body];
      var func = Function.apply(null, functionDefinition);
      var results = {};
      var funcArgs = [{}, params, results];
      angular.forEach(this.dependencies, function(dep) {
        funcArgs.push($injector.get(dep));
      });
      func.apply(this, funcArgs);

      return results;
    }
  });
}