
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

  var width   = Math.abs(this.__bounds.getNorthEast().lng() - this.__bounds.getSouthWest().lng());
  var regWidth  = width / this.__lngRes;
  var regX = (x - this.__bounds.getSouthWest().lng()) * (this.__lngRes / width);
  return parseInt(Math.floor(regX));
}

SpacialHash.prototype.ptToIdx_y = function (y) {
  if ( y < this.__bounds.getSouthWest().lat() )
    y = this.__bounds.getSouthWest().lat();
  else if ( y > this.__bounds.getNorthEast().lat() )
    y = this.__bounds.getNorthEast().lat();

  var height  = Math.abs(this.__bounds.getNorthEast().lat() - this.__bounds.getSouthWest().lat());
  var regHeight = height / this.__latRes;
  var regY = (y - this.__bounds.getSouthWest().lat()) * (this.__latRes / height);
  return parseInt(Math.floor(regY));
}

SpacialHash.prototype.idx2to1 = function (x,y) {
  return parseInt(Math.floor(y*this.__lngRes + x));
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
  return parseInt(Math.floor(this.ptToIdx_x(x)*this.__lngRes + this.ptToIdx_y(y))); // turn into array index
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