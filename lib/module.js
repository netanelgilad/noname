var dependencies = ['angular-meteor', 'appLogger'];

if (Meteor.isClient) {
  dependencies.push('ngMaterial');
}

angular.module('noname', dependencies);