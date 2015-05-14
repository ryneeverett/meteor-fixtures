/* global Fixtures:true */
/* global FixturesDummyCollection:true */

FixturesDummyCollection = new Mongo.Collection('FixturesDummyCollection');

Fixtures = this.Fixtures = function() {
  'use strict';

  console.warn(db);
  var db = FixturesDummyCollection.rawDatabase();

  function execute (cmd) {
    Npm.require('child_process').exec(cmd, function (error, stdout, stderr) {
      console.log(stdout + stderr);
      if (!!error) {
        throw error;
      }
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

    if (!('path' in args)) {
      args.path =  false;
    }

    args.mirror = ['fixtures', args.name, args.db].join('-');

    return args;
  }

  return {
    loadFixtures: function (passedArgs) {
      var args = defaultArgs(passedArgs);

      if (args.path) {
        var path = [args.path, args.name, args.db].join('/');

        execute(
          'mongorestore -h 127.0.0.1:3001 --db ' + args.mirror + ' ' + path);
      }

      db.copyDatabase(args.mirror, args.db);
    },
    saveFixtures: function (passedArgs) {
      var args = defaultArgs(passedArgs);

      if (args.path) {
        var path = [args.path, args.name].join('/');

        Npm.require('fs').lstat(path + '/' + args.db, function(error) {
          if (!!error && error.code === 'ENOENT') {
            // If lstat throws an ENOENT error then the path doesn't exist.
            execute(
              'mongodump -h 127.0.0.1:3001 --db ' + args.mirror +
              ' -o ' + path);
          } else {
            throw 'Path already exists! Remove fixtures before saving.';
          }
        });
      }

      db.copyDatabase(args.db, args.mirror);
    }
  };
}();
