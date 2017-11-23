// flickr-api-scraper

init();

function init() {
	/*
	 * Initialisation
	 */
	'use strict';

	var detailTriggers = $('[data-open-detail]'),
		listingTriggers = $('[data-open-listing]'),
		templates = {
			detail: $('#template-detail'),
			listing: $('#template-listing')
		};

	toggleTemplate(templates.detail, templates.listing, true);

	if (detailTriggers.length !== 0) {

		detailTriggers.on('click', function() {
			toggleTemplate(templates.listing, templates.detail);
		});
	}

	if (listingTriggers.length !== 0) {

		listingTriggers.on('click', function() {
			toggleTemplate(templates.detail, templates.listing);
		});
	}
}

function toggleTemplate(current, next, initial) {
	/*
	 * Shows the next template
	 */

	current.hide();
	next.show();

	// Don't move focus on initial load
	if (!initial){
		handleFocus(next);
	}
}

function handleFocus(target) {
	/*
	 * Moves the keyboard focus
	 */
	target
		.attr('tabindex', '-1')
		.focus();
}