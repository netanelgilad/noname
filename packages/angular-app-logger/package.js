Package.describe({
  name: 'netanelgilad:angular-app-logger',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Application level logger with colors!',
  // URL to the Git repository containing the source code for this package.
  git: 'http://github.com/netanelgilad/angular-app-logger',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Npm.depends({
  'colors' : '1.1.0'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use('angular:angular@1.4.0', 'client', { weak : true});
  api.use('netanelgilad:angular-server@1.3.22', 'server', { weak : true});
  api.use('nooitaf:colors', 'server');

  api.addFiles([
    'angular-import.js',
    'angular-app-logger.js'
  ]);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('netanelgilad:angular-app-logger');
  api.addFiles('angular-app-logger-tests.js');
});
