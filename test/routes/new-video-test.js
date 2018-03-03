const {assert} = require('chai');
const request = require('supertest');
const app = require('../../app');
const {parseTextFromHTML, seedVideoToDatabase, parseYoutubeVideo, buildVideoObject} = require('../test-utilities');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');
const {jsdom} = require('jsdom');
const Video = require('../../models/video');

const findUrlElementBySource = (htmlAsString, src) => {
  const url = jsdom(htmlAsString).querySelector(`iframe[src="${src}"]`);
  if (url !== null) {
    return url;
  } else {
    throw new Error(`Image with src "${src}" not found in HTML string`);
  }
};

describe('Server path: /videos', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  describe('GET', () => {
    it('renders empty input fields', async () => {
      const response = await request(app)
        .get('/videos/new');

      assert.equal(parseTextFromHTML(response.text, '#video-url'), '');
      assert.equal(parseTextFromHTML(response.text, '#video-title'), '');
      assert.equal(parseTextFromHTML(response.text, '#video-description'), '');

    });
  });

  describe('POST', () => {
    it('creates and saves a new video', async () => {
      const video = buildVideoObject();

      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(video);

      const allVideos = await Video.find({});
      assert.equal(allVideos.length, 1);
    });
    it('redirects to show page', async () => {
      const video = buildVideoObject();

      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(video);

      assert.equal(response.status, 302);
      assert.isOk(response.redirect, true);
    });
    it('displays an error message when supplied an empty title', async () => {
      const invalidVideoToCreate = {
        description: 'trance',
        url: 'https://www.youtube.com/watch?v=wXTgtFnY0Lw'
      };

      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(invalidVideoToCreate);

      const allVideos = await Video.find({});
      assert.equal(allVideos.length, 0);
      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, 'form'), 'required');
    });
    it('displays an error message when supplied an empty description', async () => {
      const invalidVideoToCreate = {
        title: 'Tiesto - Traffic (Original Mix)',
        url: 'https://www.youtube.com/watch?v=wXTgtFnY0Lw'
      };

      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(invalidVideoToCreate);

      const allVideos = await Video.find({});
      assert.equal(allVideos.length, 0);
      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, 'form'), 'required');
    });
    it('displays an error message when supplied an empty url', async () => {
      const invalidVideoToCreate = {
        title: 'Tiesto - Traffic (Original Mix)',
        description: 'trance'
      };

      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(invalidVideoToCreate);

      const allItems = await Video.find({});
      assert.equal(allItems.length, 0);
      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, 'form'), 'required');
    });
  });
});
