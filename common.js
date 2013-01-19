function latLng2(lat, lng) {
  return new google.maps.LatLng(lat, lng);
}

function latLngBounds4(lat1, lng1, lat2, lng2) {
  return new google.maps.LatLngBounds(latLng2(lat1, lng1), latLng2(lat2, lng2));
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