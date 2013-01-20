function Player(initialPosition,fog,data) {
  this.__initSubscriptions();
  
  //this.__pos = new google.maps.LatLng(initialPosition.lat(),initialPosition.lng());
  this.__fogMap = fog;
  this.__dataMap = data;
  
  this.__speedMul = 0.000005;
  this.__demovx = this.getRandMovement();
  this.__demovy = this.getRandMovement();
  this.__x = initialPosition.lng();
  this.__y = initialPosition.lat();
  this.__score = new GameScore();
  
  this.__log = ["","","","","","","","","",""];
  this.updateScore();
}

/* Initializes subscription list.
 *   __subscribers
 */
Player.prototype.__initSubscriptions = function () {
  this.__subscribers = [];
}


Player.prototype.__notifySubscribers = function (type, pickup) {
  for (var sub in this.__subscribers) {
    this.__subscribers[sub](latLng2(this.__x, this.__y), type, pickup);
  }
}

Player.prototype.log = function(str) {
  this.__log.shift();
  this.__log.push(str);

  // Show demo player history
  var hist = document.getElementById("history");
  hist.innerHTML = "<div style=\"font-size:5px\">"
  for ( n in this.__log )
    hist.innerHTML += this.__log[n] + "<br/>";
  hist.innerHTML += "</div>";
}

Player.prototype.getRandMovement = function() {
  var spd = ((Math.random()*3.0)-1.5)*this.__speedMul;
  
  // Fix movement speed if too slow
  if ( Math.abs(spd) < (0.5*this.__speedMul) )
  {
    if ( spd != 0 ) 
      spd = spd / Math.abs(spd);
    spd *= 0.5*this.__speedMul;
  }
  return spd;
}

Player.prototype.update = function() {
  
  // Perform demo movement
  var rnd = Math.random();
  if ( rnd < 0.0010 )
  {
    this.__demovx = this.getRandMovement();
    this.log("I don't want to go there.");
  }
  if ( rnd >= 0.0005 && rnd < 0.0015 )
  {
    this.__demovy = this.getRandMovement();
    this.log("I'm going a different way.");
  }
  
  this.__x += this.__demovx;
  this.__y += this.__demovy;
  
  // Update fog
  this.__fogMap.revealInRadius(latLng2(this.__y, this.__x), 0.0005);
  
  // Update nearby objects
  var radius = 0.00045;
  var nearbyObjects = this.__dataMap.getObjectsIn(this.__y - radius,
                                                  this.__x - radius,
                                                  this.__y + radius,
                                                  this.__x + radius );
                                                  
  var scoreModified = false;
  
  this.__notifySubscribers();
  
  for ( type in nearbyObjects )
  {
    for ( thing in nearbyObjects[type] )
    {
      var xdiff = nearbyObjects[type][thing].x - this.__x;
      var ydiff = nearbyObjects[type][thing].y - this.__y;
      //console.log(xdiff,ydiff, nearbyObjects[type][thing].x, nearbyObjects[type][thing].y, this.__x, this.__y);
      if ( !nearbyObjects[type][thing].found && xdiff*xdiff + ydiff*ydiff < radius*radius )
      {
        nearbyObjects[type][thing].found = true;
        this.__score.incCount(type);
        this.log("Found a " + type + "!");
        scoreModified = true;
        
        // notify subscribers
        this.__notifySubscribers(type, nearbyObjects[type][thing]);
      }
    }
  }

  // Display/update scores
  if ( scoreModified )
    this.updateScore();
}

Player.prototype.updateScore = function() {
  var elem = document.getElementById("score_plate");
  elem.innerHTML = "<div style=\"font-size:40px\">Score: " + this.__score.getScore() + "</div><br/><div style=\"font-size:20px;\">";
  var total = 0;
  var current = 0;
  for ( type in json_data )
  {
    elem.innerHTML += " " + pad(type, 11, "&nbsp;", STR_PAD_RIGHT) + ": " + this.__score.getCount(type) + " / " + json_data[type].length + "<br/>";
    current += this.__score.getCount(type);
    total += json_data[type].length;
  }
  var percentage = Math.floor((current/total)*10000.0)/100.0;
  elem.innerHTML += "</div><div style=\"font-size:24px;margin-top:15px;\">" + percentage + "% complete</div>";
}

Player.prototype.getPosition = function() {
  return new google.maps.LatLng(this.__y,this.__x);
}

/*
 * Adds subscriber callback to subscription list. Callback will receive
 * a list of region indexes that were changed.
 */
Player.prototype.subscribe = function (subscriber) {
  this.__subscribers.push(subscriber);
}
