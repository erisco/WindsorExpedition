function latLng2(lat, lng) {
  return new google.maps.LatLng(lat, lng);
}

function latLngBounds4(lat1, lng1, lat2, lng2) {
  return new google.maps.LatLngBounds(latLng2(lat1, lng1), latLng2(lat2, lng2));
}

function latLngBoundsWidth(latLngBounds) {
  return latLngBounds.getNorthEast().lng() - latLngBounds.getSouthWest().lng();
}

function latLngBoundsHeight(latLngBounds) {
  return latLngBounds.getNorthEast().lat() - latLngBounds.getSouthWest().lat();
}

function basename(path) {
  return path.replace(/\\/g,'/').replace( /.*\//, '' );
}

// browser compat function
function mouseEventXY(e) {
  var x;
  var y;
  if (e.pageX || e.pageY) { 
    x = e.pageX;
    y = e.pageY;
  }
  else { 
    x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
    y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
  }
  return new XYPair(x, y);
}

// browser compat function
function getViewportWidth() {
  return document.width || window.innerWidth;
}

// browser compat function
function getViewportHeight() {
  return document.height || window.innerHeight;
}

function XYPair(x, y) {
  this.__x = x;
  this.__y = y;
}

XYPair.prototype.x = function (arg0) {
  if (arg0 === undefined) return this.__x;
  else this.__x = arg0;
}

XYPair.prototype.y = function (arg0) {
  if (arg0 === undefined) return this.__y;
  else this.__y = arg0;
}

XYPair.prototype.width = function (arg0) {
  return this.x(arg0);
}

XYPair.prototype.height = function (arg0) {
  return this.y(arg0);
}

XYPair.prototype.toString = function () {
  return "(" + this.__x + ", " + this.__y + ")";
}