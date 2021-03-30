const startButton = document.getElementById('startButton');

startButton.addEventListener('click', function () {
  document.querySelector('#overlay').remove();

  console.log('Trynna play the video');
  const camvideo = document.querySelector('#video')
  if (camvideo !== null) camvideo.style.display = 'block'

  const video = document.querySelector('#arvideo')
  video.muted = false;
  video.play();

}, false);

ARnft.ARnft.init(1280, 720,
    "static/img-tracking/data/nft/{{ ar.imagename }}",
    "{% static 'img-tracking/config.json' %}", true)
     .then(nft => nft.addVideo('arvideo', 60))
     .catch(console.log);