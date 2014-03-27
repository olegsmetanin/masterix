"use strict";
var through = require('through2'),
	gutil = require('gulp-util'),
	_ = require('lodash'),
	path = require('path'),
	yassemble = require('./yassemble.js'),
	PluginError = gutil.PluginError,
	File = gutil.File;

module.exports = function (opts) {

	var options = _.extend({}, opts, {
	});

	options.files = [];

	var bufferFiles = function (page, enc, cb) {

		if (page.isNull()) return;
		if (page.isStream()) return this.emit('error', new PluginError('gulp-yassemble', 'Streaming not supported'));

		var fileDef = {
			base: page.base,
			name: path.relative(page.base,page.path)
		};

		options.files.push(fileDef);

		cb();
	};

	var endStream = function (cb) {

		var self = this;

				var resultPages = yassemble.generatePages(options.files, options);

				resultPages.forEach(function (page) {
					self.push(new File({
						path: page.dst,
						contents: new Buffer(page.content)
					}));
				});

				cb();

	};

	return through.obj(bufferFiles, endStream);

};