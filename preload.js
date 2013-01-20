function preload(onLoad, images) {

  var unloadedCount = 0;
  var assets = {};

  var assetLoaded = function () { --unloadedCount; };
  
  // process images
  assets.image = {};
  unloadedCount += images.length;
  for (var i in images) {
    var imgsrc = images[i];
    var img = new Image();
    img.onload = assetLoaded;
    img.src = imgsrc;
    assets.image[basename(imgsrc)] = img;
  }
  
  var interval = setInterval(function () {
    if (unloadedCount == 0) {
      clearInterval(interval);
      onLoad(assets);
    }
  }, 100);
}