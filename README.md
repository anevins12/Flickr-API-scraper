# flickr API scraper
A jQuery app that scrapes the flickr API from a tag and displays results in one page.

## Techniques
To avoid mess I've tried to separate the generation of HTML from JS where possible.

I've limited the API calls to 1 call, resulting in the following compromises:
* The author_id field returned both username and ID, resulting in extra processing to extract the username;
* The description field duplicates information that is already present on the page. For now I have hidden the duplicates with CSS.

## Additional features
* Loading animation
* Handling focus order
* "More tags" button

## Setup
### Node
First time setup of this plugin will require the node packages to be installed.

If you have NVM installed, make sure to use the correct node version:
```bash
$ nvm use 0.10
```
Next install the plugin's node packages:

```bash
$ npm install
```

### Grunt
You will need to install the Grunt CLI (command line interface):

```bash
$ npm install -g grunt-cli
# => if you have used grunt before you probably have this (this can be run from any directory)
```

## Running
Use `http-server` to serve the HTML:
```bash
$ http-server
```

Use `npm run serve` to watch over file changes:
```bash
$ npm run serve
```

## Accessibility concerns
There are some accessibility concerns with the wireframes, but to meet the requirements I will implement what is in the wireframes and instead improve the markup where possible.
* There are many "View on flickr" links with the same text, that would be confusing to people using assistive technologies;
* In the listing view, links are duplicated for the image and title and would be tedious to navigate for keyboard users.

