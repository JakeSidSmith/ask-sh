'use strict';

(function () {

  var path = require('path');
  var fs = require('fs');
  var childProcess = require('child_process');

  var exec = childProcess.exec;

  var UTF8 = 'utf8';
  var MATCHES_LINEBREAK = /\n+[\n\s]*/;
  var MATCHES_WHITESPACE = /\s+/;
  var MATCHES_COMMENT = /#\s*/;

  function selfStrippedWhitespace (value) {
    return value.replace(MATCHES_WHITESPACE, '');
  }

  function handleLines (lines) {
    if (!lines.length) {
      return;
    }

    var line = lines.shift();

    if (MATCHES_COMMENT.test(line)) {
      console.error('\n' + line.replace(MATCHES_COMMENT, ''));
      handleLines(lines);
    } else {
      process.stdin.resume();
      console.error('Do you want to run: ' + line + '? [y, n]');

      process.stdin.once('data', function (data) {
        process.stdin.pause();

        if (data.toString().trim() === 'y') {
          exec(line, function (error, stdout, stderr) {
            if (error) {
              console.error(error);
              return;
            }

            console.log(stdout);
            console.error(stderr);

            handleLines(lines);
          });
        } else {
          handleLines(lines);
        }
      });
    }
  }

  function runCommands (filePath) {
    fs.readFile(path.join(process.cwd(), filePath), UTF8, function (error, data) {
      if (error) {
        console.error(error);
        return;
      }

      var lines = data.split(MATCHES_LINEBREAK).filter(selfStrippedWhitespace);

      handleLines(lines);
    });
  }

  module.exports = runCommands;

})();
