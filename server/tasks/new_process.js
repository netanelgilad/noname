angular.module('noname').run(AddTeachTaskTask);

function AddTeachTaskTask(Tasks) {
  var task = {
    name: 'teach process',
    description : 'Add a new process',
    parameters : [],
    errors : [],
    results : [],
    // TODO: think about injectables
    dependencies : [
      'ConversationCenter',
      'Node',
      'Process'
    ],
    body : (function (env, params, results, ConversationCenter, Node, Process) {
      var conversation;
      conversation = {
        type: 'subConversations',
        initiliazer: function () {
          return new Process();
        },
        subConversations: [
          {
            type: 'question',
            computerMessage: 'Please describe what the new process does.',
            handler: function (answer, process) {
              process.setDescription(answer);
              return process;
            }
          },
          {
            type: 'question',
            computerMessage: 'Give a short and simple name to the task.',
            handler: function (answer, process) {
              process.setName(answer);
              return process;
            }
          },
          {
            type: 'options', // TODO: think about defining the handler type maybe better?
                             // A regex handler type would start a certain conversation based of matching a regex by order
            computerMessage: 'What would you like this process to do?',
            repeat: true, // This defines if this part of the conversation is going to repeat itself until the end condition
            repeatComputerMessage: 'What would you like it to do next?',
            endUserMessage: 'done', // TODO: this could be an end condition, or a function that gets that text entered and returns a boolean
            options: [
              {
                match: 'execute a task',
                conversation: {
                  type: 'question',
                  computerMessage: 'What task would you like to execute?',
                  injectables: ['ConversationCenter', 'Tasks'],
                  handler: function (userResponse, processDefinition, injectables) {
                    var wantedTask = injectables['Tasks'].findOne({
                      name: userResponse
                    });

                    if (!wantedTask) { // TODO: handle the requested task was not found in the tasks db
                      throw new Error("The task you requested was not found");
                    }
                    else {
                      processDefinition.addNode(Node.createNodeFromTask(wantedTask));
                    }
                  }
                }
              },
              {
                match: 'add an input',
                conversation: {
                  type: 'subConversations',
                  initiliazer: function () {
                    return {}; // TODO: make this into a parameter class
                  },
                  subConversations: [
                    {
                      type: 'question',
                      computerMessage: 'What is the name of the parameter?',
                      handler: function (answer, parameter) {
                        parameter.name = answer;
                      }
                    },
                    {
                      type: 'question',
                      computerMessage: 'What is the question of the parameter?',
                      handler: function (answer, parameter) {
                        parameter.question = answer;
                      }
                    }
                  ],
                  injectables: ['InputNode'],
                  handler: function (parameter, process, injectables) {
                    var InputNode = injectables['InputNode'];
                    process.addNode(InputNode.create(parameter.name, parameter.question));
                  }
                }
              },
              {
                match: 'print process',
                conversation: {
                  type: 'computerMessage',
                  computerMessage: function (process) {
                    return JSON.stringify(process);
                  }
                }
              },
              {
                match : 'connect nodes',
                conversation : {
                  type : 'subConversations',
                  initiliazer : function() {
                    return {};
                  },
                  subConversations : [
                    {
                      type : 'question',
                      computerMessage : 'Which exit would you like to connect?',
                      handler : function(answer, memory) {
                        memory.exit = answer;
                      }
                    },
                    {
                      type : 'question',
                      computerMessage : 'Which entry would you like to connect?',
                      handler : function(answer, memory) {
                        memory.entry = answer;
                      }
                    }
                  ],
                  handler : function(memory, process) {
                    console.log('exit: ' + memory.exit + ' entry: ' + memory.entry);
                    var exitNode = process.findExit(memory.exit);
                    var entryNode = process.findEntry(memory.entry);
                    process.addConnection(exitNode.node, exitNode.exit, entryNode.node, entryNode.entry);
                  }
                }
              },
              {
                match : 'add a result',
                conversation : {
                  type : 'subConversations',
                  initiliazer : function() {
                    return {};
                  },
                  subConversations : [
                    {
                      type : 'question',
                      computerMessage : 'What is the name of the result?',
                      handler : function(answer, memory) {
                        memory.name = answer;
                      }
                    },
                    {
                      type : 'question',
                      computerMessage : 'Describe the result',
                      handler : function(answer, memory) {
                        memory.description = answer;
                      }
                    }
                  ],
                  injectables: ['Node'],
                  handler : function(memory, process, injectables) {
                    var Node = injectables['Node'];
                    process.addNode(new Node(memory.name, [memory.name], []));
                  }
                }
              },
              {
                match : 'save process',
                conversation : {
                  type : 'computerMessage',
                  injectables : ['Processes'],
                  handler : function(process, injectables) {
                    var Processes = injectables['Processes'];
                    Processes.insert(process);
                    return 'The process has been saved';
                  }
                }
              }
            ]
          }
        ]
      };

      ///////////////////

      ConversationCenter.startConversation(conversation);

      //////////////////

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