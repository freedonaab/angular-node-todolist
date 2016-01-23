const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//controllers
const todolistCtrl = require('./app/controllers/todolist-controller');

app.get('/ping', function (req, res) {
    res.send('pong!');
});

app.use(bodyParser.json());
app.use('/todo', todolistCtrl.getRouter());

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

module.exports = app;



