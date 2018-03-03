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
  describe('POST', () => {
    it('deletes the video', async () => {
        const video = await seedVideoToDatabase();

        const response = await request(app)
          .post(`/videos/${video._id}/delete`)
          .type('form');

        const allVideos = await Video.find({});
        assert.equal(allVideos.length, 0);
    });

    it('redirects home', async () => {
      const video = await seedVideoToDatabase();

      const response = await request(app)
        .post(`/videos/${video._id}/delete`)
        .type('form');

      assert.equal(response.status, 302);
      assert.equal(response.headers.location, '/');
    });
  });
});
