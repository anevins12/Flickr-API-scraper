// flickr-api-scraper
(function($) {
	'use strict';

	var flickrApiScraper = new FlickrApiScraper();

	flickrApiScraper._init();

	function FlickrApiScraper() {
		this._api = 'https://api.flickr.com/services/feeds/photos_public.gne?tags=potato&tagmode=all&format=json&jsoncallback=?';
		// Elements that trigger the different templates
		this._detailTriggers = $('[data-open-detail]');
		this._listingTriggers = $('[data-open-listing]');


		this._init = function() {
			/*
			 * Initialisation
			 */
			// Public methods
			var self = this;

			self._handleAPI();

		}.bind(this);

		this._bindEvents = function() {
			var self = this,
				templates = {
					detail: $('#template-detail'),
					listing: $('#template-listing')
				};

			// Hide detail template
			self._toggleTemplate(templates.detail, templates.listing, false);

			if (self._detailTriggers.length !== 0) {

				self._detailTriggers.on('click', function(event) {
					// Show detail template
					self._toggleTemplate(templates.listing, templates.detail, event);
				});
			}

			if (self._listingTriggers.length !== 0) {

				self._listingTriggers.on('click', function(event) {
					// Show listing template
					self._toggleTemplate(templates.detail, templates.listing, event, true);
				});
			}
		};

		this._toggleTemplate = function(current, next, event, previous) {
			/*
			 * Shows the next template
		     * @param {jQueryObject} current - The current template
		     * @param {jQueryObject} next - The next template
		     * @param {jQueryObject} event - The jQuery event
		     * @param {boolean} previous - Navigating back to a template
			 */
			var self = this,
				trailIdentifier = 'js-trail';

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
					self._handleFocus(trails);
				} else {
					// Focus on the next template
					self._handleFocus(next);
				}
			}
		};

		this._handleFocus = function(target) {
			/*
			 * Moves the keyboard focus
		     * @param {jQueryObject} target - The element being focused
			 */
			target
				// tabindex not always necessary but better safe than sorry
				.attr('tabindex', '-1')
				.focus();
		};

		this._handleAPI = function() {
			/*
			 * Extracts and applies API to the template.
			 *
			 * To avoid embedding markup inside of the script,
			 * DOM items will be cloned
		 	 */
			var self = this,
				loadingIcon = $('[data-loading]'),
				loadingToggleClass = 'js-is-visible',
				wrapper = $('[data-feed-wrapper]'),
				containerIdentifier = '[data-feed-container]',
				container = $(containerIdentifier, wrapper);

			// Hide placeholder list item
			container.hide();
			// Show loading icon
			loadingIcon.addClass(loadingToggleClass);

			$.getJSON(self._api, function(data) {
				var responseItems = data.items,
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
					$('[data-feed-list]', wrapper).append(clonedContainer);
				}

				$.each(responseItems, function populateItem(index, item) {
					/*
					 * Extract response and populate DOM
					 */
					self._updateTemplates($('.template-listing'), item, index);
				});

				// Show feed
				wrapper.addClass(toggleClass);
				// Hide loading icon
				loadingIcon.removeClass(loadingToggleClass);
				// Bind events to new markup
				self._bindEvents();

				// Fetch new template triggers
				self._detailTriggers = $('[data-open-detail]');

				self._detailTriggers.on('click', function() {
					var containers = $('[data-feed-container]'),
						container = $(this).parents('[data-feed-container]'),
						index = containers.index(container);

					// The container has bound response data
					self._updateTemplates($('.template-detail'), container, true);
				});
			});
		};

		this._updateTemplates = function(template, item, index) {
			var feedMarkup = {
					author: '[data-feed-author]',
					date_taken: '[data-feed-date]',
					description: '[data-feed-desc]',
					link: '[data-feed-reference]',
					list: '[data-feed-list]',
					media: '[data-feed-img]',
					tags: '[data-feed-tag-list]',
					title: '[data-feed-title]',
					titleBtn: '[data-feed-title-btn]',
					time_taken: '[data-feed-time]'
				},
				responseIdentifier = 'js-response',
				listItem,
				responseItem,
				wrapper,
				responseDate,
				responseAuthor,
				responseTime,
				authorURL,
				titleId = 'feed__title-0';

			if (template.is('.template-listing')) {
				titleId = 'feed__title-' + index;
				listItem = $('[data-feed-container]').get(index);
				responseItem = $(item).get(0);
				wrapper = listItem;
			} else {
				listItem = item;
				responseItem = item.data(responseIdentifier);
				wrapper = $('.template-detail');

				/// NNoooo get the trail!!!
				$(listItem).data(responseIdentifier, item);
			}

			feedMarkup.list = $('[data-feed-list]', wrapper);

			authorURL = '//www.flickr.com/photos/' + responseItem.author_id;
			responseDate = responseItem.published;
			responseAuthor = responseItem.author;

			// Reformat date
			responseDate = new Date(responseDate);
			responseTime = responseDate;
			responseDate = dateFormat(responseDate, 'd mmm yyyy');
			// Reformat time
			responseTime = dateFormat(responseTime, 'h:MM');

			// Reformat author: Remove brackets and speech marks
			responseAuthor = responseAuthor.substring(
				responseAuthor.indexOf('(') + 2,
				responseAuthor.lastIndexOf(')') - 1
			);

			// Populate: Title
			$(feedMarkup.title, wrapper).attr('id', titleId);
			$(feedMarkup.titleBtn, wrapper).html(responseItem.title);

			// Populate: Image
			$(feedMarkup.media, wrapper).attr({
				'src': responseItem.media.m,
				'alt': responseItem.title
			});

			// Populate: Link
			$(feedMarkup.link, wrapper).attr({
				'aria-describedby': titleId,
				'href': responseItem.link
			});

			// Populate: Published date
			$(feedMarkup.date_taken, wrapper).html(responseDate);

			// Populate: Published time
			$(feedMarkup.time_taken, wrapper).html(responseTime);

			// Populate: Author
			$(feedMarkup.author, wrapper)
				.attr('href', authorURL)
				.html(responseAuthor);

			// Populate: Description
			if ($(feedMarkup.description, wrapper).length !== 0) {
				$(feedMarkup.description, wrapper).html(responseItem.description);
			}

			// Populate: Tags
			if ($(feedMarkup.tags, wrapper).length !== 0) {
				var responseTags = responseItem.tags,
					readInitialTags = [],
					readMoreTags = [],
					markupTags = $(feedMarkup.tags, wrapper),
					tagUrl = 'https://www.flickr.com/photos/tags/',
					listMarkup = '<li class="tags__list-item"></li>',
					tagMarkup;

				// Reformat tags
				responseTags = responseTags.split(' ');

				// If there are too many tags
				if (responseTags.length > 12) {
					// Split them up into chunks
					readInitialTags = responseTags.slice(0, 12);
					readMoreTags = responseTags.slice(12);
					responseTags = readInitialTags;
				}

				$.each(responseTags, function(index, tag) {
					var listItem = $(listMarkup);

					tagMarkup = '<a href="' + tagUrl + tag +  '">' + tag + '</a>';

					// Add tag
					listItem.append(tagMarkup);
					markupTags.append(listItem);
				});

				if (readMoreTags.length !== 0) {
					markupTags.after('<ul data-read-more></ul>');

					$.each(readMoreTags, function(index, tag) {
						var listItem = $(listMarkup);

						tagMarkup = '<a href="' + tagUrl + tag +  '">' + tag + '</a>';

						// Add tag
						listItem.append(tagMarkup);
						$('[data-read-more]').append(listItem);
					});

					// Initialise hideShow plugin
					self._initHideShow();
				}
			}
		}

		this._initHideShow = function() {
			/*
			 * Initialise hideShow plugin
			 */
			var readMoreComponents = $('[data-read-more]');

			if (readMoreComponents.length !== 0) {
				readMoreComponents.hideShow({
					hideText: 'Less tags',
					showText: 'More tags',
					speed: '300',
				    state: 'hidden'
				});
			}
		};
	}
}(jQuery));