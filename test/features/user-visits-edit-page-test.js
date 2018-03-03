const {assert} = require('chai');
const {buildVideoObject, parseVideo} = require('../test-utilities');

describe('User visits the edit video page', () => {
  describe('edits a video', () => {
    it('is edited', () => {
      const video = buildVideoObject();
      video.url = parseVideo(video);
      browser.url('/');

      browser.click('#add-video-button');
      browser.setValue('#video-url', video.url);
      browser.setValue('#video-title', video.title);
      browser.setValue('#video-description', video.description);
      browser.click('#submit-button');

      browser.click('#edit-video-button');
      browser.setValue('#video-url', 'https://www.youtube.com/watch?v=8d44ykdKvCw');
      browser.setValue('#video-title', 'Basshunter - DotA (HQ)');
      browser.setValue('#video-description', 'Now You\'re Gone');
      browser.click('#submit-button');

      assert.include(browser.getText('body'), 'Basshunter - DotA (HQ)');
      assert.include(browser.getText('body'), 'Now You\'re Gone');
      assert.include(browser.getAttribute('body iframe', 'src'), 'https://www.youtube.com/embed/8d44ykdKvCw');
      assert.notInclude(browser.getText('body'), video.title);
      assert.notInclude(browser.getText('body'), video.description);
      assert.notInclude(browser.getAttribute('body iframe', 'src'), video.url);
    });
  });
});
