function WindsorExpedition(map,assets) {
  this.__fog = new Fog(windsorBounds, 1000, 1000);
  this.__dataMap = new DataMap(windsorBounds, 1000, 1000);
  this.__score = new GameScore();
  var mapB = map.getBounds();
  // calculate reasonable buffer bounds
  var bufferBounds = latLngBounds4(
    mapB.getSouthWest().lat() - 0.01,
    mapB.getSouthWest().lng() - 0.01,
    mapB.getNorthEast().lat() + 0.01,
    mapB.getNorthEast().lng() + 0.01
  );
  
  this.__overlay = new Overlay(bufferBounds, mapB);
  
  
  var places = this.__dataMap.getObjectsIn( bufferBounds.getSouthWest().lat(),
                                            bufferBounds.getSouthWest().lng(),
                                            bufferBounds.getNorthEast().lat(),
                                            bufferBounds.getNorthEast().lng() );
  
  for ( type in places )
  {
    for ( spot in places[type] )
    {
      var imgType = type + ".png";
      if ( !(imgType in assets.image) )
        console.log("not here bro: ", imgType, assets.image);
      this.__overlay.drawIcon(assets.image[imgType], latLng2(places[type][spot].y, places[type][spot].x) );
    }
  }
}