function latLng2(lat, lng) {
  return new google.maps.LatLng(lat, lng);
}

// south, west, north, east
function latLngBounds4(lat1, lng1, lat2, lng2) {
  return new google.maps.LatLngBounds(latLng2(lat1, lng1), latLng2(lat2, lng2));
}

function latLngBoundsWidth(latLngBounds) {
  return latLngBounds.getNorthEast().lng() - latLngBounds.getSouthWest().lng();
}

function latLngBoundsHeight(latLngBounds) {
  return latLngBounds.getNorthEast().lat() - latLngBounds.getSouthWest().lat();
}

function basename(path) {
  return path.replace(/\\/g,'/').replace( /.*\//, '' );
}

// browser compat function
function mouseEventXY(e) {
  var x;
  var y;
  if (e.pageX || e.pageY) { 
    x = e.pageX;
    y = e.pageY;
  }
  else { 
    x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
    y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
  }
  return new XYPair(x, y);
}

// browser compat function
function getViewportWidth() {
  return window.innerWidth;
}

// browser compat function
function getViewportHeight() {
  return window.innerHeight;
}

function XYPair(x, y) {
  this.__x = x;
  this.__y = y;
}

XYPair.prototype.x = function (arg0) {
  if (arg0 === undefined) return this.__x;
  else this.__x = arg0;
}

XYPair.prototype.y = function (arg0) {
  if (arg0 === undefined) return this.__y;
  else this.__y = arg0;
}

XYPair.prototype.width = function (arg0) {
  return this.x(arg0);
}

XYPair.prototype.height = function (arg0) {
  return this.y(arg0);
}

XYPair.prototype.toString = function () {
  return "(" + this.__x + ", " + this.__y + ")";
}


/**
*
*  Javascript string pad
*  http://www.webtoolkit.info/
*
**/
 
var STR_PAD_LEFT = 1;
var STR_PAD_RIGHT = 2;
var STR_PAD_BOTH = 3;
 
function pad(str, len, pad, dir) {
 
	if (typeof(len) == "undefined") { var len = 0; }
	if (typeof(pad) == "undefined") { var pad = ' '; }
	if (typeof(dir) == "undefined") { var dir = STR_PAD_RIGHT; }
 
	if (len + 1 >= str.length) {
 
		switch (dir){
 
			case STR_PAD_LEFT:
				str = Array(len + 1 - str.length).join(pad) + str;
			break;
 
			case STR_PAD_BOTH:
				var right = Math.ceil((padlen = len - str.length) / 2);
				var left = padlen - right;
				str = Array(left+1).join(pad) + str + Array(right+1).join(pad);
			break;
 
			default:
				str = str + Array(len + 1 - str.length).join(pad);
			break;
 
		} // switch
 
	}
 
	return str;
 
}