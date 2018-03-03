const {assert} = require('chai');
const {buildVideoObject, parseVideo} = require('../test-utilities');

describe('User visits the new video page', () => {
  describe('posts a new video', () => {
    it('is created', () => {
      const video = buildVideoObject();
      video.url = parseVideo(video);
      browser.url('/');

      browser.click('#add-video-button');
      browser.setValue('#video-url', video.url);
      browser.setValue('#video-title', video.title);
      browser.setValue('#video-description', video.description);
      browser.click('#submit-button');

      assert.include(browser.getText('body'), video.title);
      assert.include(browser.getText('body'), video.description);
      assert.include(browser.getAttribute('body iframe', 'src'), video.url);
    });
  });
});
