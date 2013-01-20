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