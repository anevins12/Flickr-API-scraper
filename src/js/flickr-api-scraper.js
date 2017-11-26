// flickr-api-scraper

init();

function init() {
	/*
	 * Initialisation
	 */
	'use strict';

	handleAPI();
	bindEvents();
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

	var toggleClass = 'js-is-visible';

	current.hide()
	next.fadeIn()

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
	 * Extracts and applies API to the DOM.
	 *
	 * To avoid embedding markup inside of the script,
	 * DOM items will be cloned
 	 */
	'use strict';

	var args = '?tags=potato&tagmode=all&format=json&jsoncallback=?',
		api = 'https://api.flickr.com/services/feeds/photos_public.gne' + args,
		loadingIcon = $('[data-loading]'),
		loadingToggleClass = 'js-is-visible',
		wrapper = $('[data-feed-wrapper]'),
		containerIdentifier = '[data-feed-container]',
		container = $(containerIdentifier, wrapper);

	// Hide placeholder list item
	container.hide();
	// Show loading icon
	loadingIcon.addClass(loadingToggleClass)

	$.getJSON(api, function(data) {
		var feedMarkup = {
				list: $('[data-feed-list]', wrapper),
				title: '[data-feed-title]',
				media: '[data-feed-img]',
				link: '[data-feed-reference]',
				date_taken: '[data-feed-date]',
				author:  '[data-feed-author]',
				tag: '[data-feed-tag]',
				time_taken: '[data-feed-time]'
			},
			responseItems = data.items,
			responseLength = responseItems.length,
			count = 0,
			toggleClass = 'js-is-populated';

		// Only looping 18 items as the markup already contains a list item
		for (count; count < responseLength -1; count++) {
			var clonedContainer = container;

			// Remove hidden state on first item
			if (count === 0) {
				clonedContainer.show();
			}

			// Clone the markup for each item
			clonedContainer = clonedContainer.clone();
			feedMarkup.list.append(clonedContainer);
		}

		$.each(responseItems, function(index, item) {
			var responseItem = $(item).get(0),
				// All list items
				listItems = $(containerIdentifier),
				// Filter the current list item
				listItem = listItems.get(index),
				responseDate = responseItem.published,
				responseTime = responseDate;

			// Reformat date
			responseDate = new Date(responseDate);
			responseDate = dateFormat(responseDate, 'd mmm yyyy');

			// Reformat time
			responseTime = dateFormat('h:MM');

			// Populate: Title
			$(feedMarkup.title, listItem).html(responseItem.title);
			// Populate: Image
			$(feedMarkup.media, listItem).attr({
				'src': responseItem.media.m,
				'alt': responseItem.title
			});
			// Populate: Link
			$(feedMarkup.link, listItem).attr('href', responseItem.link);
			// Populate: Published date
			$(feedMarkup.date_taken, listItem).html(responseDate);
			// Populate: Published time
			$(feedMarkup.time_taken, listItem).html(responseTime);
		});

		// Show feed
		wrapper.addClass(toggleClass);
		// Hide loading icon
		loadingIcon.removeClass(loadingToggleClass)
	});
}