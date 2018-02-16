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
* "More tags" button on tags > 12
* Production build task

## Setup
### Node
First time setup of this plugin will require the node packages to be installed.

If you have NVM installed, make sure to use the correct node version:
```bash
$ nvm use 8.9.x
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

## Building
Use `npm run build` to build production files:
```bash
$ npm run build
```
