function Player(initialPosition,fog,data) {
  this.__initSubscriptions();
  
  //this.__pos = new google.maps.LatLng(initialPosition.lat(),initialPosition.lng());
  this.__fogMap = fog;
  this.__dataMap = data;
  
  this.__demovx = -0.0001;
  this.__demovy = 0.0001;
  this.__x = initialPosition.lng();
  this.__y = initialPosition.lat();
  this.__score = new GameScore();
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
  var rnd = Math.random();
  if ( rnd < 0.010 )
  {
    this.__demovx = ((Math.random()*2.2)-1.0)*0.0001;
    console.log("Changing directions");
  }
  if ( rnd >= 0.005 && rnd < 0.015 )
  {
    this.__demovy = ((Math.random()*2.2)-1.0)*0.0001;
    console.log("going a different way");
  }
  
  this.__x += this.__demovx;
  this.__y += this.__demovy;
  
  // Update fog
  // @TODO
  //this.__fogMap.something
  
  // Update nearby objects
  var nearbyObjects = this.__dataMap.getObjectsIn(this.__y - 0.005,
                                                  this.__x - 0.005,
                                                  this.__y + 0.005,
                                                  this.__x + 0.005 );
  for ( type in nearbyObjects )
  {
    for ( thing in nearbyObjects[type] )
    {
      var xdiff = nearbyObjects[type][thing].x - this.__x;
      var ydiff = nearbyObjects[type][thing].y - this.__y;
      //console.log(xdiff,ydiff, nearbyObjects[type][thing].x, nearbyObjects[type][thing].y, this.__x, this.__y);
      if ( !nearbyObjects[type][thing].found && xdiff*xdiff + ydiff*ydiff < 0.005*0.005 )
      {
        nearbyObjects[type][thing].found = true;
        this.__score.incCount(type);
        console.log("Found a " + type + " at (" + this.__x + ", " + this.__y + ") (I have " + this.__score.getScore() + " points!)");
      }
    }
  }
  
  
}

Player.prototype.getPosition = function() {
  return new google.maps.LatLng(this.__y,this.__x);
}

/*
 * Adds subscriber callback to subscription list. Callback will receive
 * a list of region indexes that were changed.
 */
Player.prototype.subscribe = function (subscriber) {
  this.__subscribers.append(subscriber);
}
