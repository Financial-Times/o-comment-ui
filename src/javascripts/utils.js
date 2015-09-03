/**
 * Converts a plain HTML string into a DOM object.
 * @param  {String} htmlString Plain HTML in a string format.
 * @return {DOMObject} DOM Object
 */
exports.toDOM = function (htmlString) {
	const d = document;
	let i;
	const a = d.createElement("div");
	const b = d.createDocumentFragment();

	a.innerHTML = htmlString;

	while (a.firstChild) {
		i = a.firstChild;
		b.appendChild(i);
	}

	return b;
};

/**
 * getComputedStyle polyfill for IE. If native function is available, that one is used.
 * @param  {DOMObject} el     The Element for which to get the computed style.
 * @param {DOMObject} pseudoElement Optional. A string specifying the pseudo-element to match. Must be omitted (or null) for regular elements.
 * @return {Object}            Object that has a getPropertyValue function which gets a property name as parameter.
 */
exports.getComputedStyle = function (el, pseudoElement) {
	if (!window.getComputedStyle) {
		return {
			getPropertyValue: function (prop) {
				const re = /(\-([a-zA-Z]){1})/g;
				if (prop === 'float') {
					prop = 'styleFloat';
				}

				if (re.test(prop)) {
					prop = prop.replace(re, function () {
						return arguments[2].toUpperCase();
					});
				}
				return el.currentStyle[prop] ? el.currentStyle[prop] : null;
			}
		};
	} else {
		pseudoElement = (typeof pseudoElement === 'boolean' ? pseudoElement : false);
		return window.getComputedStyle(el, pseudoElement);
	}
};

/**
 * Computes the window's size.
 * @return {Object} {width: XX, height: YY}
 */
exports.windowSize = function () {
	const w = window;
	const d = document;
	const e = d.documentElement;
	const g = d.getElementsByTagName('body')[0];
	const x = w.innerWidth || g.clientWidth || e.clientWidth;
	const y = w.innerHeight || g.clientHeight || e.clientHeight;

	return {
		width: x,
		height: y
	};
};
