'use strict';

Package.describe({
  name: 'ryne:fixtures',
  version: '0.0.1',
  summary: "Set your database to a consistent state in test.",
  git: 'https://github.com/ryneeverett/meteor-fixtures.git',
  documentation: 'README.md',
  debugOnly: true
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.addFiles('fixtures.js', 'server');
});
