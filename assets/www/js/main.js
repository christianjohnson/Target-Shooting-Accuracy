var pictureSource;   // picture source
var destinationType; // sets the format of returned value
var stage, image_layer, dots_layer, text_layer;

// Wait for Cordova to connect with the device
document.addEventListener("deviceready", onDeviceReady, false);

// Cordova is ready to be used!
function onDeviceReady() {
    pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;
	stage = new Kinetic.Stage({
		container: "canvas-div",
		width: window.innerWidth,
		height: window.innerHeight
	});
	image_layer = new Kinetic.Layer();
	dots_layer = new Kinetic.Layer();
	stage.add(image_layer);
	stage.add(dots_layer);
}

// A button will call this function
function capturePhoto() {
  // Take picture using device camera and retrieve image as URI
  navigator.camera.getPicture(onPhotoCaptureSuccess, onFail, { quality: 75,
    destinationType: destinationType.FILE_URI });
}

//Called when a photo is successfully retrieved
function onPhotoCaptureSuccess(imageURI) {
  var image_obj = new Image();
  image_obj.onload = function() {
	  console.log("drawing image...");
	  var image_k = new Kinetic.Image({
		  x: 0,
		  y: 0,
		  image: image_obj,
		  width: window.innerWidth,
		  height: window.innerHeight
	  });
	  dots_layer.removeChildren();
	  image_layer.removeChildren();
	  dots_layer.draw();
	  image_layer.add(image_k);
	  image_layer.draw()
  }
  image_obj.src = imageURI;
  
  //Make target shooting
  image_layer.on('touchend', function(){
	drawDot();	
  });
}

function drawDot(){
	var touch_event = stage.getTouchPosition();
	touch_x = touch_event.x;
	touch_y = touch_event.y;
	console.log('Circle: ' + touch_x + ', ' + touch_y);
	var circle = new Kinetic.Circle({
		x: touch_x,
		y: touch_y,
		radius: 10,
		fill: '#FF1C0A',
		stroke: 'black',
		strokeWidth: 1
	});
	dots_layer.add(circle);
	dots_layer.draw();
}

// Called if something bad happens.
function onFail(message) {
  alert('Failed because: ' + message);
}

function resizeCanvas(){}
