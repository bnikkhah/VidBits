const {jsdom} = require('jsdom');
const urlParser = require('js-video-url-parser');

const Video = require('../models/video');

// Create and return a sample Video object
const buildVideoObject = (options = {}) => {
  const url = options.url || 'https://www.youtube.com/watch?v=wXTgtFnY0Lw';
  const title = options.title || 'Tiesto - Traffic (Original Mix)';
  const description = options.description || 'trance music';
  return {url, title, description};
};

// Add a sample Video object to mongodb
const seedVideoToDatabase = async (options = {}) => {
  const video = await Video.create(buildVideoObject(options));
  return video;
};

// extract text from an Element by selector.
const parseTextFromHTML = (htmlAsString, selector) => {
  const selectedElement = jsdom(htmlAsString).querySelector(selector);
  if (selectedElement !== null) {
    return selectedElement.textContent;
  } else {
    throw new Error(`No element with selector ${selector} found in HTML string`);
  }
};

//parse youtube videos so they can be displayed in the iframe
const parseYoutubeVideo = function(video) {
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  var match = video.url.match(regExp);
  if (match&&match[7].length==11) {
      video.url = video.url.replace(video.url, `https://www.youtube.com/embed/${match[7]}`);
  }
  return video.url;
}

const parseVideo = function(video) {
  const parseVid = urlParser.parse(video.url);
  if (video.url.search('youtube') > 0) {
    video.url = `https://www.youtube.com/embed/${parseVid.id}`;
  } else if (video.url.search('vimeo') > 0) {
    video.url = `//player.vimeo.com/video/${parseVid.id}`;
  } else if (video.url.search('dailymotion') > 0) {
    video.url = `//www.dailymotion.com/embed/video/${parseVid.id}`;
  }
  return video.url;
}

module.exports = {
  buildVideoObject,
  seedVideoToDatabase,
  parseTextFromHTML,
  parseVideo
};
