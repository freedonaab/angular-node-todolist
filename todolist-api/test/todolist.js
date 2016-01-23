/*global describe:false, it:false, beforeEach:false, afterEach:false*/
'use strict';

const request = require('supertest');
const should = require('should');
const app = require('../index');
const async = require('async');
const _ = require('lodash');

const query = (fn) => request(app).get('/todo').expect(200).end(fn);
const create = (task, fn) => request(app).post('/todo').send(task).expect(200).end(fn);
const get = (id, fn) => request(app).get(`/todo/${id}`).expect(200).end(fn);
const update = (task, fn) => request(app).put(`/todo/${task.id}`).send(task).expect(200).end(fn);
const complete = (id, fn) => request(app).post(`/todo/${id}/complete`).send().expect(200).end(fn);
const completeAll = (fn) => request(app).post('/todo/complete').send().expect(200).end(fn);
const remove = (id, fn) => request(app).delete(`/todo/${id}`).expect(200).end(fn);
const removeAll = (fn) => request(app).delete('/todo').expect(200).end(fn);

describe('Todolist', () => {

    afterEach(removeAll);


    it('GET / should return empty list', (done) =>
        query((err, res) => {
            res.body.should.be.instanceof(Array).and.have.lengthOf(0);
            done();
        })
    );

    it('POST / should create a task', (done) =>
        create({ name: 'acheter du pain' }, (err, res) => {
            res.body.should.have.property('name', 'acheter du pain');
            res.body.should.have.property('id');
            done();
        })
    );

    it('POST / should create a task and appear when querying', (done) =>
        async.waterfall([
            (next) => create({ name: 'faire la vaiselle' }, next),
            (_, next) => query((err, res) => {
                res.body.should.have.lengthOf(1);
                next();
            })
        ], done)
    );

    it('GET /:id should return the corresponding task', (done) =>
        async.waterfall([
            (next) => create({ name: 'acheter le bread' }, next),
            (res, next) => get(res.body.id, (err, res) => {
                res.body.should.have.property('name', 'acheter le bread');
                next();
            })
        ], done)
    );

    it('PUT /:id should update the corresponding task', (done) =>
        async.waterfall([
            (next) => create({ name: 'aller voir mamie' }, next),
            (res, next) => {
                const task = res.body;
                task.name = 'aller voir papy';
                update(task, (err, res) => {
                    res.body.should.have.property('name', 'aller voir papy');
                    next();
                })
            }
        ], done)
    );

    it('POST /:id/complete should mark the corresponding task as complete', (done) =>
            async.waterfall([
                (next) => create({ name: 'braquer une banque' }, next),
                (res, next) => complete(res.body.id, (err, res) => {
                    res.body.should.have.property('completed', true);
                    next();
                })
            ], done)
    );

    it('POST /complete should mark all tasks as complete', (done) =>
            async.waterfall([
                (next) => create({ name: 'pousser mémé dans les orties' }, next),
                (res, next) => create({ name: '???' }, next),
                (res, next) => create({ name: 'profit' }, next),
                (res, next) => completeAll(next),
                (res, next) => {
                    _.each(res.body, (task) => task.should.have.property('completed', true));
                    next();
                }
            ], done)
    );

    it('DELETE /:id should delete the corresponding task', (done) =>
            async.waterfall([
                (next) => create({ name: 'prendre rdv avec le dealer ' }, next),
                (res, next) => remove(res.body.id, next),
                (res, next) => query((err, res) => {
                    res.body.should.have.lengthOf(0);
                    next();
                })
            ], done)
    );

    it('DELETE / should delete all tasks', (done) =>
            async.waterfall([
                (next) => create({ name: 'aller voir bob' }, next),
                (res, next) => create({ name: 'aller voir jean' }, next),
                (res, next) => create({ name: 'aller voir didier' }, next),
                (res, next) => removeAll(next),
                (res, next) => query((err, res) => {
                    res.body.should.have.lengthOf(0);
                    next();
                })
            ], done)
    );

});
