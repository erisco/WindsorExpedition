// TODO revealed structure hacked in

function Fog(latlngBounds, latRes, lngRes) {
  this.__initRegionData(latlngBounds, latRes, lngRes);
  this.__initSubscriptions();
  
  this.__revealed = [];
  this.__numRevealed = 0;
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

Fog.prototype.__getRegionIndex = function (region) {
  // if LatLng we have to calculate the index
  if (region instanceof google.maps.LatLng) {
    var latLng = region;
    var width = latLngBoundsWidth(this.__bounds);
    var height = latLngBoundsHeight(this.__bounds);
    var regX = (latLng.lng() - this.__bounds.getSouthWest().lng())/width * this.__lngRes;
    var regY = (latLng.lat() - this.__bounds.getSouthWest().lat())/height * this.__latRes;
    return Math.floor(regY)*this.__lngRes + Math.floor(regX);
  }
  // otherwise it is assumed the argument is 'int' and already the index.
  else {
    return region;
  }
}

Fog.prototype.__notifySubscribers = function (indexes) {
  for (var i in this.__subscribers) {
    this.__subscribers[i](indexes);
  }
}

Fog.prototype.__changeManyTo = function (array, state) {
  var len = array.length;
  var indexes = new Array();
  for (var i = 0; i < len; ++i) {
    var index = this.__getRegionIndex(array[i]);
    if (this.__regions[index] != state) {
      indexes.push(index);
      this.__regions[index] = state;
      if (state == Fog.REVEALED) {
        this.__numRevealed++;
        this.__revealed.push(index);
      }
    }
  }
  if (indexes.length > 0)
    this.__notifySubscribers(indexes);
}

Fog.prototype.getPercentageRevealed = function() {
  return Math.floor((this.__numRevealed / (this.__latRes*this.__lngRes))*10000.0)/100.0;
}

Fog.prototype.getRevealed = function () {
  return this.__revealed;
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

Fog.prototype.getRegionCount = function () {
  return this.__lngRes * this.__latRes;
}

Fog.prototype.revealInRadius = function(latlng,rad) {
  var width = latLngBoundsWidth(this.__bounds);
  var height = latLngBoundsHeight(this.__bounds);
  
  // Get reveal bounds
  var x1 = Math.floor(((latlng.lng()-rad) - this.__bounds.getSouthWest().lng())/width  * this.__lngRes);
  var y1 = Math.floor(((latlng.lat()-rad) - this.__bounds.getSouthWest().lat())/height * this.__latRes);
  var x2 = Math.floor(((latlng.lng()+rad) - this.__bounds.getSouthWest().lng())/width  * this.__lngRes);
  var y2 = Math.floor(((latlng.lat()+rad) - this.__bounds.getSouthWest().lat())/height * this.__latRes);

  // Find squares to reveal
  var toReveal = [];
  for ( var x = x1; x <= x2; ++x )
    for ( var y = y1; y <= y2; ++y )
      toReveal.push( y*this.__lngRes + x );
  
  // If there are squares to reveal
  if ( toReveal.length != 0 )
    this.revealMany(toReveal);
}

Fog.prototype.getRegionBounds = function (region) {
  var index = this.__getRegionIndex(region);
  var col = index % this.__lngRes;
  var row = Math.floor(index/this.__lngRes);
  var bWidth = latLngBoundsWidth(this.__bounds);
  var bHeight = latLngBoundsHeight(this.__bounds);
  var regWidth = bWidth / this.__lngRes;
  var regHeight = bHeight / this.__latRes;
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