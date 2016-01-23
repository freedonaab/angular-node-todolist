"use strict";

const express = require('express');
const TodoListService = require('../services/todolist-service');

class TodoListController {

    constructor() {
        this.router = express.Router();
        this.service = new TodoListService();
        this.initMappings();
    }

    initMappings() {
        this.router.get('/', this.query.bind(this));
        this.router.get('/:id', this.get.bind(this));
        this.router.post('/', this.create.bind(this));
        this.router.put('/:id', this.update.bind(this));
        this.router.post('/:id/complete', this.complete.bind(this));
        this.router.post('/complete', this.completeAll.bind(this));
        this.router.delete('/:id', this.remove.bind(this));
        this.router.delete('/', this.removeAll.bind(this));
    }

    getRouter() {
        return this.router;
    }

    query(req, res) {
        const items = this.service.query();
        res.send(items);
    }

    get(req, res) {
        const task = this.service.get(req.params.id);
        res.send(task);
    }

    create(req, res) {
        const task = this.service.create(req.body);
        res.send(task);
    }

    update(req, res) {
        req.body.id = req.params.id;
        const updatedTask = this.service.update(req.body);
        res.send(updatedTask);
    }

    complete(req, res) {
        const updatedTask = this.service.complete(req.params.id);
        res.send(updatedTask);
    }

    completeAll(req, res) {
        this.service.completeAll();
        res.send();
    }

    remove(req, res) {
        this.service.remove(req.params.id);
        res.send();
    }

    removeAll(req, res) {
        this.service.removeAll();
        res.send();
    }
}

module.exports = new TodoListController();
