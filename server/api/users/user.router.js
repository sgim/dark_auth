'use strict';

var router = require('express').Router(),
	_ = require('lodash');

var HttpError = require('../../utils/HttpError');
var User = require('./user.model');

router.param('id', function (req, res, next, id) {
	User.findById(id).exec()
	.then(function (user) {
		if (!user) throw HttpError(404);
		req.requestedUser = user;
		next();
	})
	.then(null, next);
});

router.get('/', function (req, res, next) {
	// if(!req.user || !req.user.isAdmin) return res.sendStatus(404);
	User.find({})
	.select((req.user && req.user.isAdmin) ? "":"name photo phone email")
	.then(function (users) {
		res.json(users);
	})
	.then(null, next);
});

router.post('/', function (req, res, next) {
	User.create(req.body)
	.then(function (user) {
		user.isAdmin = false;
		return user.save();
		// res.status(201).json(user);
	})
	.then(user => res.status(201).json(user))
	.then(null, next);
});

router.get('/:id', function (req, res, next) {
	req.requestedUser.getStories()
	.then(function (stories) {
		var obj = req.requestedUser.toObject();
		obj.stories = stories;
		res.json(obj);
	})
	.then(null, next);
});

router.put('/:id', function (req, res, next) {
	if(!req.user || (req.user._id !== req.requestedUser._id) || (!req.user.isAdmin && req.body.isAdmin)) return res.sendStatus(403);
	_.extend(req.requestedUser, req.body);
	req.requestedUser.save()
	.then(function (user) {
		res.json(user);
	})
	.then(null, next);
});

router.delete('/:id', function (req, res, next) {
	if(!req.user || (req.user._id !== req.requestedUser._id && !req.user.isAdmin)) return res.sendStatus(403);
	req.requestedUser.remove()
	.then(function () {
		req.user._id === req.requestedUser._id && req.logout();
		res.status(204).end();
	})
	.then(null, next);
});

module.exports = router;