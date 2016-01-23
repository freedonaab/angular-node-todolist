# angular-node-todolist

## Description
A simple todolist example project made with angular.js and node.js in es6. The project is seperated in three different modules:
* an env folder containing an example nginx conf that links the two other parts together
* a todolist-api folder containing an example API server made with node.js and ES6
* a todolist-web folder containing an example WEB App made with angular.js, ES6 and bootstrap

## List of technologies / librairies used
* node v5.0
* express v4.13
* async for asynchronous workflow
* lodash for utils
* mocha for api server unit test runner
* should.js for assertions
* supertest for integration tests
* angular v1.4.9
* bootstrap v3.3.6
* gulp for webapp building
* browserify & babel for es6 to es5/browser translation

## How to use
Run the api server
```
cd todolist-api && npm start
```
Optionally run the api server unit tests
```
cd todolist-api && npm test
```
Build the webapp
```
cd todolist-web && gulp default
```
Be sure to add `todolist` to your `/etc/hosts` file.
Go to `http://todolist` and enjoy !


## TODO
* add unit tests for web module (karma, angular-mocks)
* add delete all completed task feature
