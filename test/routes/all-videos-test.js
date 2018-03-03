const {assert} = require('chai');
const request = require('supertest');
const app = require('../../app');
const {parseTextFromHTML, seedVideoToDatabase, parseVideo} = require('../test-utilities');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');
const {jsdom} = require('jsdom');

const findUrlElementBySource = (htmlAsString, src) => {
  const url = jsdom(htmlAsString).querySelector(`iframe[src="${src}"]`);
  if (url !== null) {
    return url;
  } else {
    throw new Error(`Video with src "${src}" not found in HTML string`);
  }
};

describe('Server path: /videos', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  describe('GET', () => {
    it('renders a video with a title and description', async () => {
      const video = await seedVideoToDatabase();
      video.url = parseVideo(video);

      const response = await request(app)
        .get(`/videos`);

      assert.include(parseTextFromHTML(response.text, '.video-title'), video.title);
      const urlElement = findUrlElementBySource(response.text, video.url);
      assert.equal(urlElement.src, video.url);
    });

    it('renders all items from the database', async () => {
      const firstVideo = await seedVideoToDatabase({title: 'Video1'});
      const secondVideo = await seedVideoToDatabase({title: 'Video2'});

      const response = await request(app)
        .get(`/videos`);

      assert.include(parseTextFromHTML(response.text, `#video-${firstVideo._id} .video-title`), firstVideo.title);
      assert.include(parseTextFromHTML(response.text, `#video-${secondVideo._id} .video-title`), secondVideo.title);
    });
  });
});
