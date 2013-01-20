function WindsorExpedition(map, assets) {
  this.__map = map;
  this.__fog = new Fog(windsorBounds, 100, 100);
  this.__dataMap = new DataMap(windsorBounds, 1000, 1000);
  this.__score = new GameScore();
  this.__assets = assets;
  this.__player = new Player(latLng2(42.3, -83), this.__fog, this.__dataMap);
  
  this.fitBounds(windsorBounds);
  
  window.setInterval(function (){
    this.__player.update();
    this.__overlay.drawIcon(this.__assets.image["fire.png"], this.__player.getPosition());
   // console.log(this.__player.getPosition());
    this.rebuildOverlay();
  }.bind(this), 200 );
  
  window.onclick = function (e) {
    var xy = mouseEventXY(e);
    
    var marker = new google.maps.Marker({
      position: this.__screenToLatLng(xy),
      map: this.__map
  });
    console.log(this.__screenToLatLng(xy));
  
    
    this.__fog.reveal(this.__screenToLatLng(xy));
  }.bind(this);
  
  this.__fog.subscribe(function (regions) {
    for (i in regions) {
      var r = regions[i];
      if (this.__fog.isRevealed(r))
      {
        var bounds = this.__fog.getRegionBounds(r);
        this.__overlay.revealArea(bounds);
      }
    }
  }.bind(this));
  
  // add zoom button to page
  this.__zoomer = new Zoomer();
  this.__zoomer.subscribe(function (state) {
    if (state == Zoomer.ZOOMED_OUT) {
      this.fitBounds(windsorBounds);
    }
    else {
      this.centreOn(this.__player.getPosition());
    }
  }.bind(this));
}

WindsorExpedition.prototype.__advisedBufferBounds = function (b) {
  return latLngBounds4(
    b.getSouthWest().lat() - 0.01,
    b.getSouthWest().lng() - 0.01,
    b.getNorthEast().lat() + 0.01,
    b.getNorthEast().lng() + 0.01
  );
}

WindsorExpedition.prototype.rebuildOverlay = function () {
  var b = this.__map.getBounds();
  var bufferBounds = this.__advisedBufferBounds(b);
  this.__overlay = new Overlay(bufferBounds, b);
  
  var places = this.__dataMap.getObjectsIn( bufferBounds.getSouthWest().lat(),
                                            bufferBounds.getSouthWest().lng(),
                                            bufferBounds.getNorthEast().lat(),
                                            bufferBounds.getNorthEast().lng() );
  for ( type in places ) {
    for ( spot in places[type] ) {
      var imgType = type + ".png";
      if ( !places[type][spot].found /*&& type != "transit" && type != "heritage"*/ )
      {
        this.__overlay.drawIcon(
          this.__assets.image[imgType],
          latLng2(places[type][spot].y, places[type][spot].x)
        );
      }
    }
  }
}

WindsorExpedition.prototype.centreOn = function (latLng) {
  var bounds = latLngBounds4(
    latLng.lat() - 0.001,
    latLng.lng() - 0.001,
    latLng.lat() + 0.001,
    latLng.lng() + 0.001
  );
  this.fitBounds(bounds);
}

WindsorExpedition.prototype.fitBounds = function (latLngBounds) {
  this.__map.fitBounds(latLngBounds);
  google.maps.event.addListenerOnce(this.__map, "bounds_changed",
    function () {
      this.rebuildOverlay();
    }.bind(this));
}

WindsorExpedition.prototype.__screenToLatLng = function(screenXY) {
  return pixelToLatLng(screenXY);
}