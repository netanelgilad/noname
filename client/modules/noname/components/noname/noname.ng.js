angular.module('noname')
  .directive('noNameApp', function() {
    return {
      restrict : 'EA',
      templateUrl : 'client/modules/noname/components/noname/noname.ng.html',
      bindToController : true,
      controllerAs : 'vm',
      controller : function() {
      }
    };
  });
