angular.module('appLogger', []).factory('AppLogger', AppLogger);

function AppLogger($log) {
  function Logger() {
    this.args = Array.prototype.slice.apply(arguments);
    this.prefix = _(this.args).map(function(func) { return func.name }).reduceRight(function(a, b) {
      return (a !== '') ? b + '::' + a : b;
    }, '');
  }

  Logger.prototype.log   = prepareLogFn( $log.log, 'INFO'.white);
  Logger.prototype.info  = prepareLogFn( $log.info, 'INFO'.white);
  Logger.prototype.warn  = prepareLogFn( $log.warn, 'WARN'.yellow);
  Logger.prototype.debug = prepareLogFn( $log.debug, 'DEBUG'.blue);
  Logger.prototype.error = prepareLogFn( $log.error, 'ERROR'.red);


  /////////////////

  function prepareLogFn( logFn, level ) {
    var enhancedLogFn = function ( )
    {
      var prefix = this.prefix;
      var caller = enhancedLogFn.caller.name;
      if (caller !== '' && !_.contains(this.args, enhancedLogFn.caller)) {
        prefix += '::' + caller;
      }
      prefix += ' ->';

      var args = Array.prototype.slice.call(arguments);
      args.unshift('[' + level + ']', prefix.magenta);

      logFn.apply( null,  args );
    };

    return enhancedLogFn;
  }

  return Logger;
}
