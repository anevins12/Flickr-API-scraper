// flickr-api-scraper

init();

function init() {
	/*
	 * Initialisation
	 */
	'use strict';

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
	toggleTemplate(templates.detail, templates.listing, false);

	if (detailTriggers.length !== 0) {

		detailTriggers.on('click', function(event) {
			// Show detail template
			toggleTemplate(templates.listing, templates.detail, event);
		});
	}

	if (listingTriggers.length !== 0) {

		listingTriggers.on('click', function(event) {
			// Show listing template
			toggleTemplate(templates.detail, templates.listing, event, true);
		});
	}
}

function toggleTemplate(current, next, event, previous) {
	/*
	 * Shows the next template
     * @param {jQueryObject} current - The current template
     * @param {jQueryObject} next - The next template
     * @param {jQueryObject} event - The jQuery event
     * @param {boolean} previous - Navigating back to a template
	 */
	'use strict';

	var trailIdentifier = 'js-trail';

	// Hide current template
	current.hide();
	// Show next template
	next.fadeIn();

	if (event) {
		var trails = $('[' + trailIdentifier + ']');

		// Clean trails
		trails.removeAttr(trailIdentifier);

		// Track the previously interacted button
		$(event.target).attr(trailIdentifier, '');

		if (previous) {
			// Focus on the previous button
			handleFocus(trails);
		} else {
			// Focus on the next template
			handleFocus(next);
		}
	}
}

function handleFocus(target) {
	/*
	 * Moves the keyboard focus
     * @param {jQueryObject} target - The element being focused
	 */
	'use strict';

	target
		// tabindex not always necessary but better safe than sorry
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
	loadingIcon.addClass(loadingToggleClass);

	$.getJSON(api, function(data) {
		var feedMarkup = {
				list: $('[data-feed-list]', wrapper),
				title: '[data-feed-title]',
				media: '[data-feed-img]',
				link: '[data-feed-reference]',
				date_taken: '[data-feed-date]',
				author: '[data-feed-author]',
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
				responseAuthor = responseItem.author,
				responseTime,
				authorURL = '//www.flickr.com/photos/' + responseItem.author_id;

			// Reformat date
			responseDate = new Date(responseDate);
			responseTime = responseDate;
			responseDate = dateFormat(responseDate, 'd mmm yyyy');
			// Reformat time
			responseTime = dateFormat(responseTime, 'h:MM');

			// Reformat author; remove brackets and speech marks
			responseAuthor = responseAuthor.substring(
				responseAuthor.indexOf('(') + 2,
				responseAuthor.lastIndexOf(')') - 1
			);

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
			// Populate: Author
			$(feedMarkup.author, listItem)
				.attr('href', authorURL)
				.html(responseAuthor);
		});

		// Show feed
		wrapper.addClass(toggleClass);
		// Hide loading icon
		loadingIcon.removeClass(loadingToggleClass);
		// Bind events to new markup
		bindEvents();
	});
}