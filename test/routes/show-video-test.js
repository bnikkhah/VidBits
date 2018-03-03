const {assert} = require('chai');
const request = require('supertest');
const app = require('../../app');
const Video = require('../../models/video');
const {parseTextFromHTML, seedVideoToDatabase, parseYoutubeVideo, buildVideoObject} = require('../test-utilities');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');

describe('Server path: /items/:videoId/delete', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  // Write your test blocks below:
  describe('GET', () => {
    it('renders the show page', async () => {
        const video = await seedVideoToDatabase();

        const response = await request(app)
          .get(`/videos/${video._id}`);

        assert.include(parseTextFromHTML(response.text, '.video-title'), video.title);
    });
  });
});
