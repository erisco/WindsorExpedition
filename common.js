function latLng(lat, lng) {
  return new google.maps.LatLng(lat, lng);
}

function latLngBounds(lat1, lng1, lat2, lng2) {
  return new google.maps.LatLngBounds(latLng(lat1, lng2), latLng(lat2, lng2));
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