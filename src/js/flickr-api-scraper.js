// flickr-api-scraper

init();

function init() {
	/*
	 * Initialisation
	 */
	'use strict';

	bindEvents();
	handleAPI();
}

function bindEvents() {
	'use strict';

	var detailTriggers = $('[data-open-detail]'),
		listingTriggers = $('[data-open-listing]'),
		templates = {
			detail: $('#template-detail'),
			listing: $('#template-listing')
		};

	// Hide detail template
	toggleTemplate(templates.detail, templates.listing, true);

	if (detailTriggers.length !== 0) {

		detailTriggers.on('click', function() {
			// Show detail template
			toggleTemplate(templates.listing, templates.detail);
		});
	}

	if (listingTriggers.length !== 0) {

		listingTriggers.on('click', function() {
			// Show listing template
			toggleTemplate(templates.detail, templates.listing);
		});
	}
}

function toggleTemplate(current, next, initial) {
	/*
	 * Shows the next template
	 */
	'use strict';

	current.hide();
	next.show();

	// Don't move focus on initial load
	if (!initial) {
		handleFocus(next);
	}
}

function handleFocus(target) {
	/*
	 * Moves the keyboard focus
	 */
	'use strict';

	target
		.attr('tabindex', '-1')
		.focus();
}

function handleAPI() {
	/*
	 *
	 * To avoid embedding markup inside of the script,
	 * the current list item will be cloned for each item
 	 */
	'use strict';

	var args = '?tags=potato&tagmode=all&format=json&jsoncallback=?',
		api = 'https://api.flickr.com/services/feeds/photos_public.gne' + args;

	$.getJSON(api, function(data) {
		var wrapper = $('[data-feed-wrapper]'),
			containerIdentifier = '[data-feed-container]',
			feedMarkup = {
				list: $('[data-feed-list]', wrapper),
				container: $(containerIdentifier, wrapper),
				title: '[data-feed-title]',
				media: '[data-feed-img]',
				link: '[data-feed-reference]',
				date_taken: '[data-feed-date]',
				author:  '[data-feed-author]',
				tag: '[data-feed-tag]'
			},
			responseItems = data.items,
			responseLength = responseItems.length,
			count = 0;

		// Only looping 18 items as the markup already contains a list item
		for (count; count < responseLength -1; count++) {
			var clonedContainer = feedMarkup.container.clone();

			feedMarkup.list.append(clonedContainer);
		}

		// For new buttons in the DOM
		bindEvents();

		$.each(responseItems, function(index, item) {
			var responseItem = $(item).get(0),
				// All list items
				listItems = $(containerIdentifier),
				// Filter the current list item
				listItem = listItems.get(index),
				responseDate = responseItem.published,
				responseDay,
				responseMonth,
				responseYear;

			// Reformat date
			responseDate = new Date(responseDate);xss

			// Populate: Title
			$(feedMarkup.title, listItem).html(responseItem.title);
			// Populate: Image
			$(feedMarkup.media, listItem).attr({
				'src': responseItem.media.m,
				'alt': responseItem.title
			});
			// Populate: Link
			$(feedMarkup.link, listItem).attr('href', responseItem.link);
			// Populate: Published
			$(feedMarkup.date_taken, listItem).html(responseItem.published);
		});
	});
}