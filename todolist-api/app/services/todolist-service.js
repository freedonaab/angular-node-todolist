"use strict";
const _ = require('lodash');

/*
* Task:
* id: string
* name: string
* completed: boolean
* */

class TodoListService {

    constructor() {
        this.tasks = [];
    }

    query() {
        return this.tasks;
    }

    create(task) {
        this.tasks.push(task);
        task.completed = false;
        task.id = this.tasks.indexOf(task).toString();
        return task;
    }

    get(id) {
        return _.find(this.tasks, 'id', id) || null;
    }

    update(task) {
        if (!this.tasks[task.id]) return null;
        this.tasks[task.id] = task;
        return task;
    }

    complete(taskId) {
        const task = this.tasks[taskId];
        if (!task) return null;
        task.completed = true;
        return task;
    }

    completeAll() {
        _.each(this.tasks, (task) => task.completed = true);
    }

    remove(id) {
        this.tasks = _.filter(this.tasks, (task) => task.id != id);
    }

    removeAll() {
        this.tasks = [];
    }


}

module.exports = TodoListService;
