var webcam={
  init:function  (selectorContainer,width,height){
  if(!width){
      width=640;
  }
  if(!height){
      height=480;
  }
  var rand_videoId='video'+(Math.random(500)*50000).toFixed(0);
  document.querySelector(selectorContainer).innerHTML='<video class="'+rand_videoId+'" width="100%" height="100%"></video><canvas class="canvas'+rand_videoId+'" style="display:none;"></canvas>';
  var streaming = false,
      video        = document.querySelector('.'+rand_videoId),
      canvas       = document.querySelector('.canvas'+rand_videoId);
      

  navigator.getMedia = ( navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.msGetUserMedia);

  navigator.getMedia(
    {
      video: true,
      audio: false
    },
    function(stream) {
      if (navigator.mozGetUserMedia) {
        video.mozSrcObject = stream;
      } else {
        var vendorURL = window.URL || window.webkitURL;
        video.src = vendorURL.createObjectURL(stream);
      }
      video.play();
    },
    function(err) {
      console.log("An error occured! " + err);
    }
	
  );
video.addEventListener('canplay', function(ev){
    if (!streaming) {
      height = video.videoHeight / (video.videoWidth/width);
      canvas.setAttribute('width', width);
      canvas.setAttribute('height', height);
      streaming = true;
    }
  }, false);
  
  return {
	video:video,
        canvas:canvas,
        width:width,
        height:height
	};
},
  

  picture:function (obj) {
    obj.canvas.width = obj.width;
    obj.canvas.height = obj.height;
    obj.canvas.getContext('2d').drawImage(obj.video, 0, 0, obj.width, obj.height);
    var data = obj.canvas.toDataURL('image/png');
    return data;
  }

};