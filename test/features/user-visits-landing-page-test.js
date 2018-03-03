const {assert} = require('chai');

describe('User visits root', () => {
  describe('without existing videos', () => {
    it('starts blank', () => {
      browser.url('/');
      assert.equal(browser.getText('#videos-container'), '');
    });
  });

  describe('can navigate', () => {
    it('to the new video page', () => {
      browser.url('/');
      browser.click('#add-video-button');

      assert.include(browser.getText('body'), 'Save a video');
    });
  });
});
