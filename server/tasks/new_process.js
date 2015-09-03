angular.module('noname').run(AddTeachTaskTask);

var conversation = [
  {
    target : 'parameters',
    type : [Object],
    text : 'Enter parameters for the process. Enter "done" when finished.',
    properties : [
      {
        name : 'name',
        type : String,
        text : 'What is the name of the parameter?'
      },
      {
        name : 'question',
        type : String,
        text : 'What is the question of the parameter?'
      }
    ]
  },
  {
    target : 'results',
    type : [Object],
    text : 'Enter the results of the process. Enter "done" when finished.',
    properties : [
      {
        name : 'name',
        type : String,
        text : 'What is the name of the result?'
      },
      {
        name : 'description',
        type : String,
        text : 'Describe this result.'
      }
    ]
  },
  {
    target : 'body',
    type : String,
    text : 'What would you like this process to do?',
    repeat : true, // This defines if this part of the conversation is going to repeat itself until the end condition
    repeatText: 'What would you like it to do next?',
    endText : 'done', // TODO: this could be an end condition, or a function that gets that text entered and returns a boolean
    handlerType : 'regex', // TODO: think about defining the handler type maybe better?
                           // A regex handler type would start a certain conversation based of matching a regex by order
    regex : [
      {
        match : 'connect XXXXXX to YYYYYY',
        conversation : {

        }
      }
    ]
  }
];

function AddTeachTaskTask(Tasks) {
  var task = {
    name: 'teach task',
    description : 'Add a new process',
    parameters : [],
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
        messageHandler = handleParameterName;

        return deferred.promise;
      }

      function handleParameterName(text) {
        parameter.name = text;
        ConversationHistory.addComputerMessage('Enter the question of the parameter:');
        messageHandler = handleParameterQuestion;
      }

      function handleParameterQuestion(text) {
        parameter.question = text;
        deferred.resolve(parameter);
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