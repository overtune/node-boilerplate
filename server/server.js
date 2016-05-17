/**
 * Module dependencies.
 */
var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var pug = require('pug');



/**
 * Variables
 */
var settings = JSON.parse(fs.readFileSync(path.resolve('./settings/settings.json'), 'utf8'));
var viewsFolder = path.resolve('./public/views');



/**
 * Initiation function
 */
exports.init = function () {
	'use strict';

	/**
	 * Express configuration with handlebars.
	 */
	app.set('view engine', 'pug');
	app.set('views', viewsFolder);
	app.use('/assets', express.static(path.resolve('./public/assets'), { etag: false, maxage: 0 }));



	/**
	 * App routes
	 */
	var data = {};
	data._devLiveReload = '<script>document.write(\'<script src="http://\' + (location.host || \'localhost\').split(\':\')[0] +\':35729/livereload.js?snipver=1"></\' + \'script>\')</script>';
	app.get('/', function (req, res) {
		res.render('index', data);
	});



	/**
	 * Start the server
	 */
	app.listen(settings.port, settings.domain, function () {
		console.log('Server running at http://' + settings.domain + ':' + settings.port);
	});
};