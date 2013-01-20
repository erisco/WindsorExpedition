function Player(initialPosition,fog,data) {
  this.__initSubscriptions();
  
  //this.__pos = new google.maps.LatLng(initialPosition.lat(),initialPosition.lng());
  this.__fogMap = fog;
  this.__dataMap = data;
  
  this.__demovx = -0.0001;
  this.__demovy = 0.0001;
  this.__x = initialPosition.lng();
  this.__y = initialPosition.lat();
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
  
  // Perform demo movement
  if ( Math.random() < 0.01 )
    this.__demovx *= -1.0;
  else if ( Math.random() < 0.02 )
    this.__demovy *= -1.0;
  
  this.__x += this.__demovx;
  this.__y += this.__demovy;
  
  // Update fog
  // @TODO
  //this.__fogMap.something
  
  // Update nearby objects
  var nearbyObjects = this.__dataMap.getObjectsIn(this.__y - 0.001,
                                                  this.__x - 0.001,
                                                  this.__y + 0.001,
                                                  this.__x + 0.001 );
  for ( type in nearbyObjects )
  {
    for ( thing in nearbyObjects[type] )
    {
      if ( Math.pow(thing.x - this.__x, 2) +
           Math.pow(thing.y - this.__y, 2) < 0.001*0.001 )
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
