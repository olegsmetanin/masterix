'use strict';
/*jslint browser: true, unused: false */

(function () {

	var $ = require('jquery'),
		skrollrlib = require('skrollr'),
		bootstrap = require('bootstrap');

	$(function () {

		var skrollr = skrollrlib.init({forceHeight:false});

		var attractors = {
			"bg01": {
				"attractor": 0.3
			},
			"bg02": {
				"attractor": 0.3
			},
			"bg03": {
				"attractor": 0.5
			},
			"bg04": {
				"attractor": 0.5
			}};


		var resize = function () {
			var ratio = 9/16;
			var width = $(window).width();
			var heigth = $(window).height();

			$(".ani-pic").each(function (i, elm) {
				var el = $(elm);
				var elwidth = (width*ratio > heigth) ? width : heigth / ratio;
				var elheigth = (width*ratio > heigth) ? width * ratio : heigth;
				el.width(elwidth);
				el.height(elheigth);
				var id = el.attr('id');
				var attractor = attractors[id];
				console.log(elwidth, elheigth, width*ratio, heigth);

				if (attractor) {
					el.css('margin-left', ((width*ratio > heigth) ? 0 : "-"+(attractor.attractor*elwidth-width/2))+'px');
				}
			});


			$(".ani-bg").each(function (i, elm) {
				var el = $(elm);
				el.width(width);
				el.height(heigth);
			});

		};

		resize();
		$('.container-full').show();
		$(window).resize(resize);

	});
})();