
function SpacialHash(bounds,lngRes,latRes) {
  this.__initSubscriptions();
  this.__bounds = bounds;
  this.__lngRes = lngRes;
  this.__latRes = latRes;
}

/* Initializes subscription list.
 *   __subscribers
 */
SpacialHash.prototype.__initSubscriptions = function () {
  this.__subscribers = [];
}

SpacialHash.prototype.maxIndex = function() {
  return this.__lngRes*this.__latRes;
}

SpacialHash.prototype.ptToIdx_x = function (x) {
  if ( x < this.__bounds.getSouthWest().lng() )
    x = this.__bounds.getSouthWest().lng();
  else if ( x > this.__bounds.getNorthEast().lng() )
    x = this.__bounds.getNorthEast().lng();

  var width   = latLngBoundsWidth(this.__bounds);
  var regWidth  = width / this.__lngRes;
  var regX = (x - this.__bounds.getSouthWest().lng()) * (this.__lngRes / width);
  return Math.floor(regX);
}

SpacialHash.prototype.ptToIdx_y = function (y) {
  if ( y < this.__bounds.getSouthWest().lat() )
    y = this.__bounds.getSouthWest().lat();
  else if ( y > this.__bounds.getNorthEast().lat() )
    y = this.__bounds.getNorthEast().lat();

  var height  = latLngBoundsHeight(this.__bounds);
  var regHeight = height / this.__latRes;
  var regY = (y - this.__bounds.getSouthWest().lat()) * (this.__latRes / height);
  console.log(Math.floor(regY));
  return Math.floor(regY);
}

SpacialHash.prototype.idx2to1 = function (x,y) {
  return y*this.__lngRes + x;
}

SpacialHash.prototype.resolutionX = function () {
  return this.__lngRes;
}
SpacialHash.prototype.resolutionY = function () {
  return this.__latRes;
}

// Gets the index for longitude(x) and latitude(y)
SpacialHash.prototype.getIndex = function (x,y) {
  // using a flat Earth approximation.
  return this.ptToIdx_y(y)*this.__lngRes + this.ptToIdx_x(x); // turn into array index
}

SpacialHash.prototype.__notifySubscribers = function (indexes) {
  for (var sub in this.__subscribers) {
    sub(indexes);
  }
}


/*
 * Adds subscriber callback to subscription list. Callback will receive
 * a list of region indexes that were changed.
 */
SpacialHash.prototype.subscribe = function (subscriber) {
  this.__subscribers.append(subscriber);
}