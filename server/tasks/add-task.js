angular.module('noname').run(AddTask);

function AddTask(Tasks) {
  var task = {
    name: 'add',
    description : 'add numbers',
    parameters : [
      {
        name : 'numbers',
        question : 'Which numbers would you like to add?',
        type : Array // TODO: handle types of parameters for tasks
      }
    ],
    errors : [], /**
                    TODO: think about defining errors that tasks may emit, and how they should be handled.
                    TODO: how should errors not caused by the inner working of the task be treated?
                  **/
    results : [
      {
        name : 'sum',
        type : Number,
        description : 'The sum of all given numbers'
      }
    ], // TODO: think about defining the results that a task may give, how to differentiate between them
    dependencies : [],
    body : (function (env, params, results) {
      var numbers = params.numbers.split(',');
      results.sum = numbers.reduce(function(num, sum) {
        return Number(sum) + Number(num);
      }, 0);
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