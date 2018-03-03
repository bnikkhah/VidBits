const {assert} = require('chai');
const {buildVideoObject} = require('../test-utilities');
const expect = assert.expect;

describe('User visits the show video page', () => {
  describe('deletes a video', () => {
    it('is deleted', () => {
      const video = buildVideoObject();
      browser.url('/');

      browser.click('#add-video-button');
      browser.setValue('#video-url', video.url);
      browser.setValue('#video-title', video.title);
      browser.setValue('#video-description', video.description);
      browser.click('#submit-button');

      browser.click('#delete-video-button');

      assert.notInclude(browser.getText('body'), video.title);
      assert.notInclude(browser.getText('body'), video.description);
    });
  });
});
