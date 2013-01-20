function WindsorExpedition(map) {
  this.__fog = new Fog(windsorBounds, 1000, 1000);
  var mapB = map.getBounds();
  // calculate reasonable buffer bounds
  var bufferBounds = latLngBounds4(
    mapB.getSouthWest().lat() - 0.01,
    mapB.getSouthWest().lng() - 0.01,
    mapB.getNorthEast().lat() + 0.01,
    mapB.getNorthEast().lng() + 0.01
  );
  
  this.__overlay = new Overlay(bufferBounds, mapB);
}