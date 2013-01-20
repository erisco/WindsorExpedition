// @note: Needs data.js
function GetWindsorBounds()
{
  var north = 42.3;
  var south = 42.3;
  var east = -83;
  var west = -83;
  
  for ( type in json_data )
  {
    for ( place in json_data[type] )
    {
      // localize variable
      var entry = json_data[type][place];
      
      // Get best X's
      var x = entry.x;
      if ( x > east )
        east = x;
      else if ( x < west )
        west = x;
      
      // Get best Y's
      var y = entry.y;
      if ( y > north )
        north = y;
      else if ( y < south )
        south = y;
    }
  }
  
  north = north + 0.02;
  south = south - 0.02;
  east = east + 0.05;
  west = west - 0.05;
  return new google.maps.LatLngBounds( new google.maps.LatLng(south,west), new google.maps.LatLng(north,east) );
}

function DataMap(latlngBounds, latRes, lngRes) {
  this.__space = new SpacialHash(latlngBounds, latRes, lngRes);
  this.__initRegionData(latlngBounds, latRes, lngRes);
  this.__initSubscriptions();
}

/* Initializes subscription list.
 *   __subscribers
 */
DataMap.prototype.__initSubscriptions = function () {
  this.__subscribers = [];
}

/*
 * Allocates room for latRes*lngRes regions. Initializes all regions
 * as hidden.
 * Initializes fields:
 *   __regions
 */
DataMap.prototype.__initRegionData = function (latlngBounds, latRes, lngRes) {
  var len = this.__space.maxIndex();
  this.__regions = new Array(len);
  for (var i = 0; i < len; ++i)
    this.__regions[i] = { };
   
  // iterate the database, initialize the regions data
  for ( type in json_data )
  {
    for ( place in json_data[type] )
    {
      var entry = json_data[type][place];
      var idx = this.__space.getIndex(entry.x, entry.y);

      // Create array if it wasn't already done
      if ( !(type in (this.__regions[idx])) )
      {
      
        this.__regions[idx][type] = [];
      }
        
      this.__regions[idx][type][place] = entry;
    }
  }
    
}

// Retrieves the objects at the given longitude(x) and latitude(y)
DataMap.prototype.getObjectsAt = function (x,y) {
	return this.__regions[this.__space.getIndex(x, y)];
}

DataMap.prototype.getObjectsAt = function (latlng) {
	return this.__regions[this.__space.getIndex(latlng.lng(), latlng.lat())];
}

// Retrieve the objects within a given box (lat/lng coordinates)
DataMap.prototype.getObjectsIn = function (south,west,north,east) {
  var results = {};
  
  var xBegin  = this.__space.ptToIdx_x(west);
  var xEnd    = this.__space.ptToIdx_x(east);
  var yBegin  = this.__space.ptToIdx_y(south);
  var yEnd    = this.__space.ptToIdx_y(north);
  for ( var x = xBegin; x < xEnd; ++x )
  {
    for ( var y = yBegin; y < yEnd; ++y )
    {
      var idx = this.__space.idx2to1(x,y);
      
      for ( type in this.__regions[idx] )
      {
        if ( !(type in results) )
          results[type] = [];
        
        for ( place in this.__regions[idx][type] )
          results[type].push(this.__regions[idx][type][place]);
      }
    }
  }
  return results;
}


DataMap.prototype.__notifySubscribers = function (indexes) {
  for (var sub in this.__subscribers) {
    sub(indexes);
  }
}


/*
 * Adds subscriber callback to subscription list. Callback will receive
 * a list of region indexes that were changed.
 */
DataMap.prototype.subscribe = function (subscriber) {
  this.__subscribers.append(subscriber);
}