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
      if ( entry.x < east )
        east = entry.x;
      else if ( entry.x > west )
        west = entry.x;
      
      // Get best Y's
      if ( entry.y < north )
        north = entry.y;
      else if ( entry.y > south )
        south = entry.y;
    }
  }
  
  return new google.maps.LatLngBounds( new google.maps.LatLng(south,west), new google.maps.LatLng(north,east) );
}

function DataMap(latlngBounds, latRes, lngRes) {
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
 *   __latlngBounds
 *   __regions
 *   __latRes
 *   __lngRes
 */
DataMap.prototype.__initRegionData = function (latlngBounds, latRes, lngRes) {
  var len = latRes * lngRes;
  this.__regions = new Array(len);
  for (var i = 0; i < len; ++i)
    this.__regions[i] = { [] };

  this.__latRes = latRes;
  this.__lngRes = lngRes;
  this.__bounds = latlngBounds;
  
   
  // iterate the database, initialize the regions data
  for ( type in json_data )
  {
    for ( place in json_data[type] )
    {
      var entry = json_data[type][place];
      this.__regions[this.__getRegionIndex(entry.x, entry.y)][type].push(entry);
    }
  }
    
}

DataMap.prototype.__getRegionIndex = function (latlng) {
  // if LatLng we have to calculate the index
  if (latlng instanceof google.maps.LatLng) {
    return this.__getRegionIndex(latlng.lng(), latlng.lat());
  }
  // otherwise it is assumed the argument is 'int' and already the index.
  else {
    return region;
  }
}

// Gets the index for longitude(x) and latitude(y)
DataMap.prototype.__getRegionIndex = function (x,y) {
  // using a flat Earth approximation.
  var width = Math.abs(this.__bounds.getNorthEast().lng() - this.__bounds.getSouthWest().lng());
  var height = Math.abs(this.__bounds.getNorthEast().lat() - this.__bounds.getSouthWest().lat());
  var regWidth = width / this.__lngRes;
  var regHeight = height / this.__latRes;
  var regX = x / regWidth;
  var regY = y / regHeight;
  return regX*this.__lngRes + regY;

}

// Retrieves the objects at the given longitude(x) and latitude(y)
DataMap.prototype.getObjectsAt(x,y) {
	return this.__regions[this.__getRegionIndex(x, y)];
}

DataMap.prototype.getObjectsAt(latlng) {
	return this.__regions[this.__getRegionIndex(latlng)];
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