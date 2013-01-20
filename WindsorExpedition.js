function WindsorExpedition(map) {
  this.__map = map;
  this.__fog = new Fog(windsorBounds, 75, 75);
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
  
  window.onclick = function (e) {
    var xy = mouseEventXY(e);
    this.__fog.hide(this.__screenToLatLng(xy));
  }.bind(this);
  
  this.__fog.subscribe(function (regions) {
    for (i in regions) {
      var r = regions[i];
      if (this.__fog.isHidden(r)) {
        this.__overlay.revealArea(this.__fog.getRegionBounds(r));
      }
    }
  }.bind(this));
}

WindsorExpedition.prototype.__screenToLatLng = function(screenXY) {
  var b = this.__map.getBounds();
  return latLng2(
    b.getSouthWest().lat() + screenXY.y()*latLngBoundsHeight(b)/getViewportHeight(),
    b.getSouthWest().lng() + screenXY.x()*latLngBoundsWidth(b)/getViewportWidth()
  );
}