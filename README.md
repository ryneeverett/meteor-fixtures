A Meteor package for setting the database to a consistent state in test.

Installation
============

**1. Add this package to your application.**

```sh
meteor add ryne:fixtures
```

**2. Install [mongo-tools](https://github.com/mongodb/mongo-tools) on your system. This is probably bundled with the mongodb package in most distributions.**

**3. Add the functions to your server-only Meteor methods.**

```js
if (Meteor.isServer) {
  typeof Fixtures !== 'undefined' && Meteor.methods(Fixtures);
}
```

**Optional: Git ignore fixtures**

You might not want to track database dumps for the sake of VCS performance.

```sh
echo 'tests/fixtures/' > .gitignore
```

Example Usage
=============

Saving Fixtures
---------------

Once you have your database in the desired state:

```sh
meteor shell
> Fixtures.saveFixtures();
```

Applying Fixtures
-----------------

```js
beforeEach(function(done) {
  Meteor.call('loadFixtures', function() {
    // Wait for aynchronous IO to complete before running test cases.
    setTimeout(function() {
      done();
    }, 50);
  });
});
```

Reference
=========

```js
Fixtures.saveFixtures({
  *db*: (default: `<MONGO_URL database>`), a string name of the database to save,
  *name*: (default: `'default'`), a string name of the fixtures
});
```

```js
Fixtures.loadFixtures({
  *db*: (default: `<MONGO_URL database>`), a string name of the database to load,
  *name*: (default: `'default'`), a string name of the fixtures
});
```
