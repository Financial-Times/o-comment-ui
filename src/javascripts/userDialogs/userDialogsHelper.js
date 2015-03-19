"use strict";

exports.addAutofocus = function (overlayInstance) {
	var onOverlayReady = function (evt) {
		if (evt.detail.el.wrapper === overlayInstance.wrapper) {
			var elementWithAutofocus = overlayInstance.wrapper.querySelector('[data-autofocus]');

			if (elementWithAutofocus) {
				elementWithAutofocus.focus();

				if (elementWithAutofocus.value) {
					if (elementWithAutofocus.setSelectionRange) {
						var len = elementWithAutofocus.value.length * 2;
						elementWithAutofocus.setSelectionRange(len, len);
					} else {
						elementWithAutofocus.value = elementWithAutofocus.value;
					}
				}
			}
		}
	};
	document.addEventListener('oOverlay.ready', onOverlayReady);

	return onOverlayReady;
};
