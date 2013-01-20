function Fog(latlngBounds, latRes, lngRes) {
  this.__initRegionData(latlngBounds, latRes, lngRes);
  this.__initSubscriptions();
}

Fog.HIDDEN = true;
Fog.REVEALED = false;

/* Initializes subscription list.
 *   __subscribers
 */
Fog.prototype.__initSubscriptions = function () {
  this.__subscribers = [];
}

/*
 * Allocates room for latRes*lngRes regions. Initializes all regions
 * as hidden.
 * Initializes fields:
 *   __latlngBounds
 *   __regions
 *   __latRes
 *   __lngRes
 */
Fog.prototype.__initRegionData = function (latlngBounds, latRes, lngRes) {
  var len = latRes * lngRes;
  this.__regions = new Array(len);
  for (var i = 0; i < len; ++i) this.__regions[i] = Fog.HIDDEN;
  this.__latRes = latRes;
  this.__lngRes = lngRes;
  this.__bounds = latlngBounds;
}

Fog.prototype.__getRegionIndex = function (latlng) {
  // if LatLng we have to calculate the index
  if (latlng instanceof google.maps.LatLng) {
    return this.__getRegionIndex(latlng.lng(), latlng.lat());
  }
  // otherwise it is assumed the argument is 'int' and already the index.
  else {
    return region;
  }
}

// Gets the index for longitude(x) and latitude(y)
Fog.prototype.__getRegionIndex = function (x,y) {
  // Math here is now correct
  // using a flat Earth approximation.
  var width   = Math.abs(this.__bounds.getNorthEast().lng() - this.__bounds.getSouthWest().lng());
  var height  = Math.abs(this.__bounds.getNorthEast().lat() - this.__bounds.getSouthWest().lat());
  var regWidth  = width / this.__lngRes;
  var regHeight = height / this.__latRes;
  var regX = (x - this.__bounds.getSouthWest().lng()) * (this.__lngRes / width);
  var regY = (y - this.__bounds.getSouthWest().lat()) * (this.__latRes / height);
  return parseInt(Math.floor(regX*this.__lngRes + regY)); // turn into array index
}

Fog.prototype.__notifySubscribers = function (indexes) {
  for (var sub in this.__subscribers) {
    sub(indexes);
  }
}

Fog.prototype.__changeManyTo = function (array, state) {
  var len = array.length;
  var indexes = new Array(len);
  for (var i = 0; i < len; ++i) {
    var index = this.__getRegionIndex(latlngs[i]);
    indexes[i] = index;
    this.__regions[index] = state;
  }
  this.__notifySubscribers(indexes);
}

Fog.prototype.revealMany = function (array) {
  this.__changeManyTo(array, Fog.REVEALED);
}

Fog.prototype.reveal = function (region) {
  this.__changeManyTo([region], Fog.REVEALED);
}

Fog.prototype.hide = function (region) {
  this.__changeManyTo([region], Fog.HIDDEN);
}

Fog.prototype.hideMany = function (array) {
  this.__changeManyTo(array, Fog.HIDDEN);
}

Fog.prototype.isHidden = function (region) {
  return this.__regions[this.__getRegionIndex(region)] == Fog.HIDDEN;
}

Fog.prototype.isRevealed = function (region) {
  return this.__regions[this.__getRegionIndex(region)] == Fog.REVEALED;
}

/*
 * Adds subscriber callback to subscription list. Callback will receive
 * a list of region indexes that were changed.
 */
Fog.prototype.subscribe = function (subscriber) {
  this.__subscribers.append(subscriber);
}