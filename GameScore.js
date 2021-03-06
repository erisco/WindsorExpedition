function GameScore() {
  this.__initSubscriptions();
  
  this.__scores = {};
  for ( key in json_data )
    this.__scores[key] = 0;
    
  this.__multipliers = { "arenas":100, "community":100, "fire":75, "heritage":10, "hospitals":75, 
                          "libraries":80, "parking":5, "parks":35, "police":75, "sculptures":25, "transit":1 };
}

/* Initializes subscription list.
 *   __subscribers
 */
GameScore.prototype.__initSubscriptions = function () {
  this.__subscribers = [];
}


GameScore.prototype.__notifySubscribers = function (indexes) {
  for (var sub in this.__subscribers) {
    sub(indexes);
  }
}

GameScore.prototype.incCount = function (key) {
  this.__scores[key]++;
}

GameScore.prototype.getCount = function (key) {
  var rval = 0;
  if ( key in this.__scores )
    rval = this.__scores[key];
  return rval;
}

GameScore.prototype.getScore = function () {
  var total = 0;
  for ( key in json_data )
  {
    if ( key in this.__multipliers )
      total += this.__multipliers[key] * this.__scores[key];
    else
      total += this.__scores[key];
  }
  return total;
}



/*
 * Adds subscriber callback to subscription list. Callback will receive
 * a list of region indexes that were changed.
 */
GameScore.prototype.subscribe = function (subscriber) {
  this.__subscribers.append(subscriber);
}
