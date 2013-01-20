function Zoomer() {
  var button = this.__button = document.getElementById("zoomer");
  button.textContent = "Zoom In";
  document.body.appendChild(button);
  button.style.position = "absolute";
  button.style.top = "10px";
  button.style.left = "10px";
  button.style.background = "#FFF";
  button.style.z_index = "200";
  button.style.display = "block";
  this.__zoomState = Zoomer.ZOOMED_OUT;
  button.onclick = function () {
    if (this.__zoomState == Zoomer.ZOOMED_OUT) {
      this.setZoomedIn();
    }
    else {
      this.setZoomedOut();
    }
  }.bind(this);
  this.__subscribers = [];
}

Zoomer.ZOOMED_IN = 0;
Zoomer.ZOOMED_OUT = 1;

Zoomer.prototype.__notifySubscribers = function() {
  for (var i in this.__subscribers) {
    this.__subscribers[i](this.__zoomState);
  }
}

Zoomer.prototype.isZoomedIn = function() {
  return this.__zoomState == Zoomer.ZOOMED_IN;
}

Zoomer.prototype.isZoomedOut = function() {
  return this.__zoomState == Zoomer.ZOOMED_OUT;
}

Zoomer.prototype.setZoomedIn = function() {
  this.__zoomState = Zoomer.ZOOMED_IN;
  this.__button.textContent = "Zoom Out";
  this.__notifySubscribers();
}

Zoomer.prototype.setZoomedOut = function() {
  this.__zoomState = Zoomer.ZOOMED_OUT;
  this.__button.textContent = "Zoom In";
  this.__notifySubscribers();
}

Zoomer.prototype.subscribe = function(subscriber) {
  this.__subscribers.push(subscriber);
}