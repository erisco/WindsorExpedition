function Player(initialPosition,fog,data) {
  this.__initSubscriptions();
  
  this.__pos = new google.maps.LatLng(initialPosition.lat(),initialPosition.lng());
  this.__fogMap = fog;
  this.__dataMap = data;
}

/* Initializes subscription list.
 *   __subscribers
 */
Player.prototype.__initSubscriptions = function () {
  this.__subscribers = [];
}


Player.prototype.__notifySubscribers = function (indexes) {
  for (var sub in this.__subscribers) {
    sub(indexes);
  }
}

Player.prototype.update = function() {
  
  //this.__fogMap.something
  var nearbyObjects = this.__dataMap.getObjectsIn(this.__pos.lat() - 0.001,
                                                  this.__pos.lng() - 0.001,
                                                  this.__pos.lat() + 0.001,
                                                  this.__pos.lng() + 0.001 );
  for ( type in nearbyObjects )
  {
    for ( thing in nearbyObjects[type] )
    {
      if ( Math.pow(thing.x - this.__pos.lng(), 2) +
           Math.pow(thing.y - this.__pos.lat(), 2) < 0.001*0.001 )
      {
        // @TODO: Register icon was found
       
      }
    }
  }
}

/*
 * Adds subscriber callback to subscription list. Callback will receive
 * a list of region indexes that were changed.
 */
Player.prototype.subscribe = function (subscriber) {
  this.__subscribers.append(subscriber);
}
