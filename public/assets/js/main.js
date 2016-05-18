define([], function () {
	'use strict';

	/**
	 * Utilities
	 * Some good to have functions/helpers that works without jquery.
	 * @see {@link http://youmightnotneedjquery.com/}
	 * @version 1.1.1
	 * @exports utilities
	 */
	var utilities = {

		/**
		 * forEach function.
		 * @param {Object} arr - An array.
		 * @param {Object} fn - A function to be performed on each array item.
		 * @public
		 */
		forEach: function (arr, fn) {
			for (var i = 0; i < arr.length; i++) {
				fn(arr[i], i);
			}
		},


		/**
		 * forEach element function.
		 * @param {String} selector - A selector as a string.
		 * @param {Object} fn - A function to be performed on each DOM node that match the selector.
		 * @public
		 */
		forEachElement: function (selector, fn) {
			var elements = document.querySelectorAll(selector),
				i;

			for (i = 0; i < elements.length; i++) {
				fn(elements[i], i);
			}
		},


		/**
		 * Get the browser to rerender.
		 * @param {String} browser - A class-name from the html-tag that defines a browser (eg 'lt-ie9', 'lt-ie8').
		 * @public
		 */
		rerenderElement: function (browser) {
			if (browser === undefined || (browser !== undefined && this.hasClass(document.documentElement, browser))) {
				document.body.className = document.body.className;
			}
		},


		/**
		 * Detects if an element has a certain class.
		 * @param {Object} el - A DOM node.
		 * @param {String} className - The classname to test.
		 * @public
		 */
		hasClass: function (el, className) {
			if (el.classList) {
				return el.classList.contains(className);
			} else {
				return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
			}
		},


		/**
		 * Adds a class to an element.
		 * @param {Object} el - A DOM node.
		 * @param {String} className - The classname to add.
		 * @public
		 */
		addClass: function (el, className) {
			if (el.classList) {
				el.classList.add(className);
			} else {
				el.className += ' ' + className;
			}
		},


		/**
		 * Removes a class from an element.
		 * @param {Object} el - A DOM node.
		 * @param {String} className - The classname to remove.
		 * @public
		 */
		removeClass: function (el, className) {
			if (el.classList) {
				el.classList.remove(className);
			} else {
				el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
			}
		},


		/**
		 * Adds an event listener to an element.
		 * @param {Object} el - A DOM node.
		 * @param {String} eventName - An event name.
		 * @param {Object} handler - A function to be called when event fires.
		 * @public
		 */
		addEventListener: function (el, eventName, handler) {
			if (el.addEventListener) {
				if (eventName === 'focus' || eventName === 'blur') {
					el.addEventListener(eventName, handler, true);
				} else {
					el.addEventListener(eventName, handler);
				}
			} else {
				el.attachEvent('on' + eventName, function () {
					handler.call(el);
				});
			}
		},


		/**
		 * Removes an event listener from an element.
		 * @param {Object} el - A DOM node.
		 * @param {String} eventName - An event name.
		 * @param {Object} handler - The function that is called when event fires.
		 * @public
		 */
		removeEventListener: function (el, eventName, handler) {
			if (el.removeEventListener) {
				el.removeEventListener(eventName, handler);
			} else {
				el.detachEvent('on' + eventName, handler);
			}
		},


		/**
		 * Removes an event listener from an element.
		 * @param {Object} el - A DOM node.
		 * @param {String} eventName - An event name.
		 * @public
		 */
		triggerEvent: function (el, eventName) {
			var event; // The custom event that will be created

			if (document.createEvent) {
				event = document.createEvent('HTMLEvents');
				event.initEvent(eventName, true, true);
			} else {
				event = document.createEventObject();
				event.eventType = eventName;
			}

			event.eventName = eventName;

			if (document.createEvent) {
				el.dispatchEvent(event);
			} else {
				el.fireEvent('on' + event.eventType, event);
			}
		},


		/**
		 * Detects if an element is in the viewport.
		 * @param {Object} el - A DOM node.
		 * @see {@link http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport/7557433#7557433}
		 * @public
		 */
		isElementInViewport: function (el) {
			var rect = el.getBoundingClientRect();

			return (
				rect.top >= 0 &&
				rect.left >= 0 &&
				rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
				rect.right <= (window.innerWidth || document.documentElement.clientWidth)
			);
		},


		/**
		 * Detects if browser has support for the History API.
		 * @public
		 */
		hasHistorySupport: function () {
			return !!(window.history && history.pushState);
		},


		/**
		 * DOMParser HTML extension for other browsers.
		 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMParser}
		 * @public
		 */
		DOMParserPolyfill: function () {
			if (window.DOMParser !== undefined) {
				(function (DOMParser) {
					var proto = DOMParser.prototype,
						nativeParse = proto.parseFromString;

					// Firefox/Opera/IE throw errors on unsupported types
					try {
						// WebKit returns null on unsupported types
						if ((new DOMParser()).parseFromString('', 'text/html')) {
							// text/html parsing is natively supported
							return;
						}
					} catch (ex) {}

					proto.parseFromString = function (markup, type) {
						if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {
							var doc = document.implementation.createHTMLDocument('');

							if (markup.toLowerCase().indexOf('<!doctype') > -1) {
								doc.documentElement.innerHTML = markup;
							} else {
								doc.body.innerHTML = markup;
							}

							return doc;
						} else {
							return nativeParse.apply(this, arguments);
						}
					};
				}(DOMParser));
			}
		},


		/**
		 * Polyfill requestAnimFrame.
		 * @see {@link http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/}
		 * @private
		 */
		RAFPolyfill: function () {
			window.requestAnimFrame = (function () {
				return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				function (callback) {
					window.setTimeout(callback, 1000 / 60);
				};
			})();
		},


		/**
		 * Parse a form and creates an object with all the keys and values.
		 * @param {Object} form - A FORM DOM node.
		 * @see {@link https://plainjs.com/javascript/ajax/serialize-form-data-into-an-array-46/}
		 * @public
		 */
		formToArray: function (form) {
			var field, l, s = [], i, j, len;

			if (typeof form == 'object' && form.nodeName == 'FORM') {
				len = form.elements.length;

				for (i = 0; i < len; i++) {
					field = form.elements[i];
					if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') {
						if (field.type == 'select-multiple') {
							l = form.elements[i].options.length;
							for (j = 0; j < l; j++) {
								if (field.options[j].selected) {
									s[s.length] = { name: field.name, value: field.options[j].value };
								}
							}
						}
						else if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
							s[s.length] = { name: field.name, value: field.value };
						}
					}
				}
			}

			return s;
		},


		/**
		 * Takes a form and creates a query-string from it's values.
		 * @param {Object} form - A FORM DOM node.
		 * @see {@link module:utilities.formToArray}
		 * @public
		 */
		formToQuery: function (form) {
			var data = this.formToArray(form),
				query = [];

			this.forEach(data, function (obj) {
				query.push(encodeURIComponent(obj.name) + '=' + encodeURIComponent(obj.value));
			});

			return query.join('&');
		},


		objectByString: function (o, s) {
			s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
			s = s.replace(/^\./, '');           // strip a leading dot

			var a = s.split('.'),
				i, n, k;

			for (i = 0, n = a.length; i < n; ++i) {
				k = a[i];
				if (k in o) {
					o = o[k];
				} else {
					return;
				}
			}
			return o;
		},


		/**
		 * Scrolls to Y-coordinate.
		 * @param {Number} scrollTargetYParam - The target scrollY property of the window
		 * @param {Number} speedParam - Time in pixels per second
		 * @param {String} easingParam - Easing equation to use
		 * @see {@link http://stackoverflow.com/a/26808520/5243250}
		 * @public
		 */
		scrollToY: function (scrollTargetYParam, speedParam, easingParam) {
			var scrollY = window.pageYOffset || document.documentElement.scrollTop,
				scrollTargetY = scrollTargetYParam || 0,
				speed = speedParam || 2000,
				easing = easingParam || 'easeOutSine',
				currentTime = 0,
				time, easingEquations;

			// min time 0.1, max time 0.8 seconds
			time = Math.max(0.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, 0.8));

			// easing equations from https://github.com/danro/easing-js/blob/master/easing.js
			easingEquations = {
				easeOutSine: function (pos) {
					return Math.sin(pos * (Math.PI / 2));
				},
				easeInOutSine: function (pos) {
					return (-0.5 * (Math.cos(Math.PI * pos) - 1));
				},
				easeInOutQuint: function (pos) {
					if ((pos /= 0.5) < 1) {
						return 0.5 * Math.pow(pos, 5);
					}
					return 0.5 * (Math.pow((pos - 2), 5) + 2);
				}
			};

			// add animation loop
			function tick () {
				currentTime += 1 / 60;

				var p = currentTime / time,
					t = easingEquations[easing](p);

				if (p < 1) {
					window.requestAnimFrame(tick);
					window.scrollTo(0, scrollY + ((scrollTargetY - scrollY) * t));
				} else {
					window.scrollTo(0, scrollTargetY);
				}
			}

			// call it once to get started
			tick();
		}
	};


	return utilities;
});