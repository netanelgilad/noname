angular.module('noname').run(AddTeachTaskTask);

function AddTeachTaskTask(Tasks) {
  var task = {
    name: 'teach task',
    description : 'Teach computer a new task',
    parameters : [
      {
        name : 'name',
        question : 'What is the task name?'
      },
      {
        name : 'description',
        question : 'Describe what the task does.'
      }
    ],
    errors : [],
    results : [],
    // TODO: think about injectables
    dependencies : [
      'ConversationCenter'
    ],
    body : (function (env, params, results, ConversationCenter, ConversationHistory, $q) {
      console.log('Running teach task with args:', arguments);

      ///////////////////

      var messageHandler;

      ConversationCenter.startConversation({
        start : function start() {
          ConversationHistory.addComputerMessage('Enter "done" when finished with adding parameters.');

        },
        handleMessage : function handleMessage(text) {
          messageHandler.handleMessage(text);
        }
      });

      //////////////////

      function getParametersForTask() {
        var deferred = $q.defer();

        var currentParameter = 0;
        var expects = 'name';
        var parameters = [];
        var messageHandler = function(text) {
          if (text.toLowerCase() === 'done') {
            deferred.resolve(parameters);
          }
          else {
            getParameter()
          }
        };

        return deferred.promise;
      }

      function getParameter() {
        var deferred = $q.defer();
        var parameter = {};

        ConversationHistory.addComputerMessage('Enter a name of a parameter:');
        messageHandler = function(text) {
          parameter.name = text;
          ConversationHistory.addComputerMessage('Enter the question of the parameter:');
          messageHandler = function(text) {
            parameter.question = text;
            deferred.resolve(parameter);
          }
        };

        return deferred.promise;
      }

    }).toString().match(/function[^{]+\{([\s\S]*)\}$/)[1]
  };

  var teachTask = Tasks.findOne({name : task.name});

  if (angular.isUndefined(teachTask)) {
    Tasks.insert(task);
  }
  else {
    Tasks.remove({name : task.name});
    Tasks.insert(task);
  }
}