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
  this.__pxViewport = new XYPair(document.width, document.height);
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
  var cv = this.__canvas = document.createElement('canvas');
  document.body.appendChild(cv);
  cv.style.width = cv.width = this.__pxBounds.width();
  cv.style.height = cv.height = this.__pxBounds.height();
  cv.style.z_index = "100";
  cv.style.position = "absolute";
  cv.style.left = -this.__pxBuffer.width();
  cv.style.top = -this.__pxBuffer.height();
  
  var ctx = this.__ctx = this.__canvas.getContext('2d');
  ctx.scale(this.__pxBounds.width()/2.0, this.__pxBounds.height()/2.0);
  ctx.translate(1, 1);
  ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.fillRect(-1, -1, 2, 2);
  
  // TODO remove
  this.revealArea(windsorBounds);
}

Overlay.prototype.__latLngToXY = function(latLng) {
  var b = this.__latLngBounds;
  var width = latLngBoundsWidth(b);
  var height = latLngBoundsHeight(b);
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