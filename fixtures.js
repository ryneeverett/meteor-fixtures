/* global Fixtures:true */

Fixtures = this.Fixtures = function() {
  'use strict';

  function execute (cmd) {
    Npm.require('child_process').exec(cmd, function (error, stdout, stderr) {
      !!error && console.warn(error);
      console.log(stdout + stderr);
    });
  }

  function defaultArgs(args) {
    if (typeof args === 'undefined') {
      args = {};
    }

    if (!('db' in args)) {
      args.db = process.env.MONGO_URL.match(/[^\/]*$/g)[0];
    }

    if (!('name' in args)) {
      args.name = 'default';
    }

    return args;
  }

  return {
    loadFixtures: function (passedArgs) {
      var args = defaultArgs(passedArgs),
          path = [
        process.env.PWD, 'tests/fixtures', args.name, args.db].join('/');

      execute('mongorestore -h 127.0.0.1:3001 --db ' + args.db + ' ' + path);
    },
    saveFixtures: function (args) {
      defaultArgs(args);

      var path = [process.env.PWD, 'tests/fixtures', args.name].join('/');

      Npm.require('fs').lstat(path + '/' + args.db, function(error) {
        if (!!error && error.code === 'ENOENT') {
          // If lstat throws an ENOENT error then the path doesn't exist.
          execute(
            'mongodump -h 127.0.0.1:3001 --db ' + args.db + ' -o ' + path);
        } else {
          console.warn(
            'Path already exists! Remove existing fixtures before saving.');
        }
      });
    }
  };
}();
