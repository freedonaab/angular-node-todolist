import angular from 'angular';

import TodoListService from './todolist/todolist-service.js';
import TodoListController from './todolist/todolist-controller.js';

angular.module('app', [])
    .service('TodoListService', TodoListService)
    .controller('TodoListController', TodoListController)
;

console.log('hello world');
