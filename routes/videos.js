const router = require('express').Router();
const Video = require('../models/video');
const urlParser = require('js-video-url-parser');

/*************
 *GET Index Page
 ************/

router.get('/videos', async (req, res, next) => {
  const videos = await Video.find({});
  videos.forEach(function(video){
    video.url = parseVideo(video);
  });
  res.render('videos/index', {videos});
});

/*************
 *GET Show New Page
 ************/

router.get('/videos/new', (req, res, next) => {
  res.render('videos/new');
});

/*************
 *GET Show Video Page
 ************/

router.get('/videos/:videoId', async (req, res, next) => {
  // const video = await findVideo(req);
  const video = await Video.findById(req.params.videoId);


  video.url = parseVideo(video);


  res.render('videos/show', {video});
});

/*************
 *GET Edit Video Page
 ************/

router.get('/videos/:videoId/edit', async (req, res, next) => {
  const video = await Video.findById(req.params.videoId);

  res.render('videos/edit', {video});
});

/*************
 *POST Edit videos
 ************/

router.post('/videos/:videoId/edit', async (req, res, next) => {
  const video = await Video.findById(req.params.videoId);
  video.url = req.body.url;
  video.title = req.body.title;
  video.description = req.body.description;
  video.validateSync();
  if (video.errors) {
    res.status(400);
    res.render('videos/edit', {video});
  } else {
    await video.save();
    res.redirect(`/videos/${video._id}`);
  }
});

/*************
 *POST Delete videos
 ************/

router.post('/videos/:videoId/delete', async (req, res, next) => {
  console.log(req.body);
  await Video.findByIdAndRemove(req.params.videoId);

  res.redirect('/');
});

/*************
 *POST New videos
 ************/

router.post('/videos', async (req, res, next) => {
  const {url, title, description} = req.body;
  const video = new Video({url, title, description});
  video.validateSync();
  if (video.errors) {
    res.status(400);
    res.render('videos/new', {video});
  } else {
    await video.save();
    res.redirect(`/videos/${video._id}`);
  }
});

module.exports = router;

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
