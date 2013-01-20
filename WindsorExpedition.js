function WindsorExpedition() {
  var bounds = GetWindsorBounds();
  this.__fog = new Fog(bounds, 1000, 1000);
  this.__datamap = new DataMap(bounds, 1000, 1000);
  this.__score = new GameScore();
  this.__overlay = new Overlay(bounds);
  //alert('foo');
}