angular.module('noname').run(DefineTaskHelpers);

function DefineTaskHelpers(Tasks, $injector, $q) {
  Tasks.helpers({
    run : function(params) {
      var functionDefinition = ['env', 'params', 'results'];
      angular.forEach(this.dependencies, function(dep) {
        functionDefinition.push(dep);
      });
      functionDefinition.push(this.body);

      var func = Function.apply(null, functionDefinition);
      var results = {};

      var deferred = $q.defer();

      // TODO: should think more about how the env of the tasks should work
      var env= {
        return : function() {
          deferred.resolve(results);
        }
      };

      var funcArgs = [{}, params, results];
      angular.forEach(this.dependencies, function(dep) {
        funcArgs.push($injector.get(dep));
      });
      var result = func.apply(this, funcArgs);

      if (angular.isFunction(result.then)) {
        return result.then(function() {
          return results;
        });
      }
      else {
        return deferred.promise();
      }
    }
  });
}