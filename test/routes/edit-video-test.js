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

describe('Server path: /videos/:videoId/edit', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  // Write your test blocks below:
  describe('GET', () => {
    it('renders the update page', async () => {
      const video = await seedVideoToDatabase();

      const response = await request(app)
          .get(`/videos/${video._id}/edit`);

      assert.include(parseTextFromHTML(response.text, 'body'), 'Edit a video');
    });
  });

  describe('POST', () => {
    it('edits a video', async () => {
      const video = await seedVideoToDatabase();
      const videoToEdit = {
        url: "https://www.youtube.com/watch?v=2-vFHLzQ1CE",
        title: 'newTitle',
        description: 'newDescription'
      }

      const response = await request(app)
        .post(`/videos/${video._id}/edit`)
        .type('form')
        .send(videoToEdit);

      const updatedVideo = await Video.findById(video._id);
      assert.equal(updatedVideo.url, videoToEdit.url);
      assert.equal(updatedVideo.title, videoToEdit.title);
      assert.equal(updatedVideo.description, videoToEdit.description);
    });

    it('redirects to show page', async () => {
      const video = await seedVideoToDatabase();
      const videoToEdit = {
        url: "https://www.youtube.com/watch?v=2-vFHLzQ1CE",
        title: 'newTitle',
        description: 'newDescription'
      }

      const response = await request(app)
        .post(`/videos/${video._id}/edit`)
        .type('form')
        .send(videoToEdit);

      assert.equal(response.status, 302);
      assert.equal(response.headers.location, `/videos/${video._id}`);
    });

    it('displays an error message when supplied with an empty title', async () => {
      const video = await seedVideoToDatabase();
      const invalidVideoToEdit = {
        url: 'https://www.youtube.com/watch?v=wXTgtFnY0Lw',
        description: 'trance'
      };

      const response = await request(app)
        .post(`/videos/${video._id}/edit`)
        .type('form')
        .send(invalidVideoToEdit);

      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, 'form'), 'required');
    });

    it('displays an error message when supplied with an empty description', async () => {
      const video = await seedVideoToDatabase();
      const invalidVideoToEdit = {
        url: 'https://www.youtube.com/watch?v=wXTgtFnY0Lw',
        title: 'Tiesto - Traffic (Original Mix)'
      };

      const response = await request(app)
        .post(`/videos/${video._id}/edit`)
        .type('form')
        .send(invalidVideoToEdit);

      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, 'form'), 'required');
    });

    it('displays an error message when supplied with an empty url', async () => {
      const video = await seedVideoToDatabase();
      const invalidVideoToEdit = {
        title: 'Tiesto - Traffic (Original Mix)',
        description: 'trance',
      };

      const response = await request(app)
        .post(`/videos/${video._id}/edit`)
        .type('form')
        .send(invalidVideoToEdit);

      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, 'form'), 'required');
    });
  });
});
