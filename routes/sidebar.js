const Router = require('express').Router();

Router.get('/', function(req, res) {
    Router.render('sidebar');
});