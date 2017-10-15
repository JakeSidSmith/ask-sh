#! /usr/bin/env node

'use strict';

(function () {

  var jargs = require('jargs');
  var runCommands = require('./index');

  var collect = jargs.collect;
  var Help = jargs.Help;
  var Required = jargs.Required;
  var Program = jargs.Program;
  var Arg = jargs.Arg;

  collect(
    Help(
      'help',
      {
        alias: 'h',
        description: 'Display help and usage info'
      },
      Program(
        'install-shell',
        {
          description: 'CLI util for optionally running shell commands',
          usage: 'install-shell command',
          examples: [
            'install-shell install.sh'
          ],
          callback: function (tree) {
            runCommands(tree.args.command);
          }
        },
        Required(
          Arg(
            'command',
            {
              type: 'string',
              description: 'Path to the file to execute'
            }
          )
        )
      )
    )
  );

})();
