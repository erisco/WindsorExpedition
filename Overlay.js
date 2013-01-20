/*
 * bounds: latLngBounds including buffered area
 * viewport: latLngBounds of area to fit to viewport
 */
function Overlay(latLngBounds, latLngViewport) {
  this.__latLngBounds = latLngBounds;
  this.__latLngViewport = latLngViewport;

  var bLatLngWidth = latLngBoundsWidth(latLngBounds);
  var bLatLngHeight = latLngBoundsHeight(latLngBounds);
  
  var vpLatLngWidth = latLngBoundsWidth(latLngViewport);
  var vpLatLngHeight = latLngBoundsHeight(latLngViewport);
  
  // width and height within viewport
  this.__pxViewport = new XYPair(getViewportWidth(), getViewportHeight());
  var vpPxWidth = this.__pxViewport.width();
  var vpPxHeight = this.__pxViewport.height();
  
  // scaling factors from lat/lng to pixels
  var lngToPx = vpPxWidth / vpLatLngWidth;
  var latToPx = vpPxHeight / vpLatLngHeight;
  
  // buffer dimensions (per edge, not total)
  this.__pxBuffer = new XYPair(
    (bLatLngWidth*lngToPx - vpPxWidth)/2.0,
    (bLatLngHeight*latToPx - vpPxHeight)/2.0
  );
  
  
  // width, height including buffers
  this.__pxBounds = new XYPair(
    vpPxWidth + this.__pxBuffer.width()*2,
    vpPxHeight + this.__pxBuffer.height()*2
  );
  
  // aspect ratio
  this.__aspect = vpPxWidth / vpPxHeight;

  // create canvas
  var cv = this.__canvas = document.getElementById("overlay");
  cv.width = this.__pxBounds.width();
  cv.style.width = cv.width + "px";
  cv.height = this.__pxBounds.height();
  cv.style.height =  cv.height + "px";
  cv.style.z_index = "100";
  cv.style.position = "absolute";
  cv.style.display = "block";
  cv.style.left = (-this.__pxBuffer.width()) + "px";
  cv.style.top = (-this.__pxBuffer.height()) + "px";
  
  var ctx = this.__ctx = this.__canvas.getContext('2d');
  ctx.scale(this.__pxBounds.width()/2.0, this.__pxBounds.height()/2.0);
  ctx.translate(1, 1);
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(-1, -1, 2, 2);
}

Overlay.prototype.__latLngToXY = function(latLng) {
  var xy = latLngToPixel(latLng);
  return new XYPair(
    2.0*xy.x()/this.__pxViewport.width() - 1,
    2.0*xy.y()/this.__pxViewport.height() - 1
  );
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
  this.__ctx.drawImage(img, xy.x(), xy.y(), 0.01 * this.__aspect, 0.02 * this.__aspect);
}