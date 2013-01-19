function Overlay(latLngBounds) {
  this.__latLngBounds = latLngBounds;

  // buffer dimensions (per edge, not total)
  this.__widthBuffer = Math.floor(document.width*0.25);
  this.__heightBuffer = Math.floor(document.height*0.25);
  
  // width and height within viewport
  this.__viewportWidth = document.width;
  this.__viewportHeight = document.height;
  
  // width, height including buffers
  this.__totalWidth = this.__viewportWidth + this.__widthBuffer*2;
  this.__totalHeight = this.__viewportHeight + this.__heightBuffer*2;

  // create canvas
  var cv = this.__canvas = document.createElement('canvas');
  document.body.appendChild(cv);
  cv.style.width = cv.width = this.__totalWidth;
  cv.style.height = cv.height = this.__totalHeight;
  cv.style.z_index = "100";
  cv.style.position = "absolute";
  cv.style.left = -this.__widthBuffer;
  cv.style.top = -this.__heightBuffer;
  cv.style.left = "0";
  cv.style.top = "0";
  
  var ctx = this.__ctx = this.__canvas.getContext('2d');
  this.__aspect = this.__totalWidth / this.__totalHeight;
  ctx.scale(this.__totalWidth/2.0, this.__totalHeight/2.0);
  ctx.translate(1, 1);
  ctx.fillStyle = "black";
  ctx.fillRect(-1, -1, 2, 2);
  this.revealArea(latLngBounds4(42.2578, -83.035511, 43.2578, -82.035511));
}

Overlay.prototype.__latLngToXY = function(latLng) {
  var b = this.__latLngBounds;
  var width = Math.abs(b.getNorthEast().lng() - b.getSouthWest().lng());
  var height = Math.abs(b.getNorthEast().lat() - b.getSouthWest().lat());
  var xy = new XYPair(
    2.0*(latLng.lng() - b.getSouthWest().lng())/width - 1,
    2.0*(latLng.lat() - b.getSouthWest().lat())/height - 1
  );
  return xy;
}

Overlay.prototype.revealArea = function (latLngBounds) {
  var sw = this.__latLngToXY(latLngBounds.getSouthWest());
  var ne = this.__latLngToXY(latLngBounds.getNorthEast());
  var width = Math.abs(ne.x() - sw.x());
  var height = Math.abs(ne.y() - sw.y());
  this.__ctx.clearRect(sw.x(), sw.y(), width, height);
}

Overlay.prototype.drawIcon = function (img, latLng) {
  var xy = this.__latLngToXY(latLng);
  this.__ctx(img, xy.x(), xy.y(), 0.1 * this.__aspect, 0.1);
}