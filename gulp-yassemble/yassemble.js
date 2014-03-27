'use strict';

// Node.js
var fs = require('fs');

// node_modules
var yfm = require('assemble-yaml');
var _ = require('lodash');

var handlebars = require('handlebars');
var handlebars_helpers = null;

try {
	handlebars_helpers = require('handlebars-helpers');
} catch (ex) {
	console.log('WARNING: ', ex);
	console.log('To use handlebars-helpers run `npm install handlebars-helpers`');
}

// Register handlebars helpers from handlebars-helpers
if (handlebars_helpers && handlebars_helpers.register) {
	console.log('handlebars_helpers.register');
	handlebars_helpers.register(handlebars, {});
}

var Yassemble = module.exports = {};


Yassemble.generatePages = function (filesDef, opt) {

function fileList(path0) {

	var path = process.cwd()+'/'+path0,
		filenames =  fs.readdirSync(path),
		fullnames = filenames.map(function (str) {
			return path+str;
		});

	return fullnames;

}

var yassemble = {
	registerPartials: function (pattern) {
		var partials = fileList(pattern);
		partials.forEach(function (file) {
			try {
				var partial = fs.readFileSync(file,'utf8');

				var filename = file.split('\\').pop().split('/').pop();
				var partialName = filename.substr(0, filename.lastIndexOf('.'));

				handlebars.registerPartial(partialName, partial);

			} catch (ex) {
				console.log('Cant register partials: ', ex);
			}
		});
	}
};



function generatePages(filesDef, opt) {

	var options = opt;

	// Register partials
	yassemble.registerPartials(options.partials);

	var pages = [];

	filesDef.forEach(function (fileDef) {

		var res = yfm.extract(fileDef.base+fileDef.name);

		var context = res.context;

		var content = res.content;

		var tasks = opt.tasks;

		tasks.forEach(function (task) {
			if (_.intersection(task.categories, context.categories).length !== 0) {
				var layouttpl = fs.readFileSync((process.cwd() || '')+'/'+ options.layouts+ task.layout,'utf8');
				var pagelayout = layouttpl.replace('{{> body }}', content);
				var layout = handlebars.compile(pagelayout);
				var pagehtml = layout(context);
				var newPath = fileDef.name.substr(0, fileDef.name.lastIndexOf('.'))+'.html';
				pages.push({dst:newPath, content:pagehtml});
			}
		});

	});

	return pages;
}

	return generatePages(filesDef, opt);

};
