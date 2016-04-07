'use strict';

var express = require('express'),
	router = express.Router(),
	path = require('path');

var rootPath = path.join(__dirname, '..', '..')
var publicPath = path.join(rootPath, 'public');

var browserPath = path.join(rootPath, 'browser');

var bowserPath = path.join(rootPath, 'bower_components');

router.use(express.static(publicPath));

router.use("/browser", express.static(browserPath));

router.use("/bower_components", express.static(bowserPath));


module.exports = router;