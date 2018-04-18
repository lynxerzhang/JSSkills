
(function () {
	'use strict';
 
	//utils
	var utils = {};
	utils.isinArray = function (value, ary) {
		if (ary) {
			for (var e in ary) {
				if (ary[e] == value) {
					return true;
				}
			}
		}
		return false;
	};

	utils.trim = function (s) {
		return s.replace(/^\s+|\s+$/g, "");
	};

	utils.replaceString = function (str) {
		var args = [];
		for(var i = 1; i < arguments.length; i ++){
		  args.push(arguments[i]);
		}
		var r, provider;
		if (args.length == 1 && typeof(args[0]) == "object" && !Array.isArray(args[0])) {
			r = /\(([a-z]+)\)|\{([a-z]+)\}|\[([a-z]+)\]/g;
			provider = args[0];
		} else {
			r = /\(\d+\)|\{\d+\}|\[\d+\]/g;
			if (Array.isArray(args[0])) {
				provider = args[0];
			} else {
				provider = args;
			}
		}
		str = str.replace(r, function (match) {
			return provider[match.slice(1, match.length - 1)];
		});
		return str;
	};

	var STYLE_HELP_ARY = [];
	var STYLE_REG = /{(.*?)}/g;
	utils.styleString = function (str, color) {
		var reg = STYLE_REG;
		var result = STYLE_HELP_ARY;
		result.length = 0;
		if (reg.test(str)) {
			reg.lastIndex = 0;
			var d;
			var s = 0;
			while ((d = reg.exec(str)) != null) {
				s = str.indexOf(d[1], s);
				result.push([s, s + d[1].length]);
				s = s + d[1].length;
			}
			var len = result.length;
			for (var i = 0; i < len; i++) {
				result[i][0] -= 1 + i * 2;
				result[i][1] -= 1 + i * 2;
			}
			result = result.filter(function(item){
				if(item[0] == item[1]){
					return false;
				}
				return true;
			});
			result.content = str.replace(reg, "$1");
			if(color){
				if(color.constructor.name && color.constructor.name.toLowerCase() == "array"){
					var __m = "";
					var __s = 0;
					result.htmlContent = str.replace(reg, function(match){
						__m = match.slice(1, match.length - 1);
						return "<span style=" + "'" + "color:#" + 
									color[__s++].toString(16) + "'" + ">" + __m + "</span>";
					});
				}
				else{
					result.htmlContent = str.replace(reg, 
						"<span style=" + "'" + "color:#" + color.toString(16) + "'" + ">" + "$1" + "</span>");
				}
			}
			else{
				result.htmlContent = "";
			}
		} else {
			result.content = str;
		}
		return result;
	};

	utils.randomunit = function (min, max) {
		return ((Math.random() * (max - min + 1))|0) + min;
	};

	utils.typeEqual = function (obj, classObj) {
		return obj.constructor == classObj;
	};

	utils.createThrottle = function(fun, waitMilSec) {
		var now = 0, previous = 0, remaining = 0;
		var args = Array.prototype.slice.call(arguments, 2);
		return function(){
			now = new Date().getTime();
			remaining = waitMilSec - (now - previous);
			if(remaining <= 0 || remaining > waitMilSec){
				previous = now;
				var d = args;
				if(arguments.length > 0){
					var e = Array.prototype.slice.call(arguments);
					d = d.concat(e);
				}
				if(d.length == 0){
					fun();
				}
				else{
					fun.apply(null, d);
				}
			}
		}
	};

	utils.debounce = function(func, wait, immediate) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if(!immediate) {
					func.apply(context, args);
				}
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait || 200);
			if (callNow) { 
				func.apply(context, args);
			}
		};
	};
    window.jsutils = utils;
})();
