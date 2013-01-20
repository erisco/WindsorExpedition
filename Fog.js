function Fog(latlngBounds, latRes, lngRes) {
  this.__space = new SpacialHash(latlngBounds, latRes, lngRes);
  this.__bounds = latlngBounds;
  this.__initRegionData();
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
  var len = this.__space.maxIndex();
  this.__regions = new Array(len);
  for (var i = 0; i < len; ++i) 
    this.__regions[i] = Fog.HIDDEN;
}

Fog.prototype.__notifySubscribers = function (indexes) {
  for (var i in this.__subscribers) {
    this.__subscribers[i](indexes);
  }
}

Fog.prototype.__changeManyTo = function (array, state) {
  var len = array.length;
  var indexes = new Array(len);
  for (var i = 0; i < len; ++i) {
    var index = this.__space.getIndex(array[i].lng(), array[i].lat());
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
  var rval;
  if (region instanceof google.maps.LatLng)
    rval = this.__regions[this.__space.getIndex(region.lng(),region.lat())] == Fog.HIDDEN;
  else
    rval = this.__regions[region] == Fog.HIDDEN;
  return rval;
}

Fog.prototype.isRevealed = function (region) {
  var rval;
  if (region instanceof google.maps.LatLng)
    rval = this.__regions[this.__space.getIndex(region.lng(),region.lat())] == Fog.REVEALED;
  else
    rval = this.__regions[region] == Fog.REVEALED;
  return rval;
}

Fog.prototype.getRegionBounds = function (region) {
  var index;
  if (region instanceof google.maps.LatLng)
    index = this.__space.getIndex(region.lng(),region.lat());
  else
    index = region;
    
  var col = index % this.__space.resolutionX();
  var row = Math.floor(index/this.__space.resolutionY());
  var bWidth = latLngBoundsWidth(this.__bounds);
  var bHeight = latLngBoundsHeight(this.__bounds);
  var regWidth = bWidth / this.__space.resolutionX();
  var regHeight = bHeight / this.__space.resolutionY();
  var regLng = this.__bounds.getSouthWest().lng() + regWidth*col;
  var regLat = this.__bounds.getSouthWest().lat() + regHeight*row;
  return latLngBounds4(regLat, regLng, regLat + regHeight, regLng + regWidth);
}

/*
 * Adds subscriber callback to subscription list. Callback will receive
 * a list of region indexes that were changed.
 */
Fog.prototype.subscribe = function (subscriber) {
  this.__subscribers.push(subscriber);
}