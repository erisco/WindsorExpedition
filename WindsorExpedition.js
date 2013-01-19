function WindsorExpedition() {
  var bounds = latLngBounds4(42.2578, -83.035511, 43.2578, -82.035511);
  this.__fog = new Fog(bounds, 1000, 1000);
  this.__overlay = new Overlay(bounds);
  //alert('foo');
}