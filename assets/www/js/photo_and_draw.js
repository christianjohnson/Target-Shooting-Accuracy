var pictureSource;   // picture source
var destinationType; // sets the format of returned value
var stage, image_layer, dots_layer, text_layer;
var draw_target = false;
var num_circles = 0;

// Wait for Cordova to connect with the device
document.addEventListener("deviceready", onDeviceReady, false);

// Cordova is ready to be used!
function onDeviceReady() {
    pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;
	stage = new Kinetic.Stage({
		container: "canvas-div",
		width: window.innerWidth,
		height: window.innerHeight * .9
	});
	image_layer = new Kinetic.Layer();
	dots_layer = new Kinetic.Layer();
	stage.add(image_layer);
	stage.add(dots_layer);
	capturePhoto();
}

// A button will call this function
function capturePhoto() {
  // Take picture using device camera and retrieve image as URI
  navigator.camera.getPicture(onPhotoCaptureSuccess, onFail, 
		  { quality: 75,
	  	    destinationType: destinationType.FILE_URI,
	  	    correctOrientation: true});
}

//Called when a photo is successfully retrieved
function onPhotoCaptureSuccess(imageURI) {
  var image_obj = new Image();
  image_obj.onload = function() {
	  var image_k = new Kinetic.Image({
		  x: 0,
		  y: 0,
		  image: image_obj,
		  width: window.innerWidth,
		  height: window.innerHeight - document.getElementById("help_button").offsetHeight
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
  
  _gaq.push(['_trackEvent', 'Interaction', 'Took Picture']);
}

function drawDot(){
	var touch_event = stage.getTouchPosition();
	touch_x = touch_event.x;
	touch_y = touch_event.y;
	var color = '#32CD32';
	var name = 'shot';
	var help_btn = document.getElementById('help_text');
	
	if (!draw_target){
		color = '#FF0000';
		name = 'target';
		draw_target = true;
		help_btn.innerHTML = 'Tap the photo to mark your shots';
		num_circles--;
	}
	
	if (num_circles > 3){
	  help_btn.innerHTML = 'Click here when done';	
	} else if (num_circles > 1){
		help_btn.innerHTML = 'Tap a shot to remove it';	
	}
	
	var circle = new Kinetic.Circle({
	  x: touch_x,
	  y: touch_y,
	  radius: 10,
	  alpha: .5,
	  fill: color,
	  name: name,
	  strokeWidth: 1
	  
	});
	
	circle.on('touchend', function(){
      dots_layer.remove(circle);
	  dots_layer.draw();
	  if (this.getName() == 'target'){
		  draw_target = false;
	  }
	});
	dots_layer.add(circle);
	dots_layer.draw();
	num_circles++;
}

// Called if something bad happens.
function onFail(message) {
  _gaq.push(['_trackEvent', 'Exceptions', 'Application', message, null, true]);
  window.location = 'index.html';
}

//Process shots
function processShots(){
  var circles = dots_layer.getChildren();
  if (circles.length < 2){
	  alert("You need to add at least one shot.  Tap on the photo to mark your target first and then your shot.");
	  return;
  }
  var circles_to_rtn = Array();
  for(var i=0; i < circles.length; i++){
    var circle = {
      x: circles[i].getX(),
      y: circles[i].getY(),
      name: circles[i].getName()
    };
    circles_to_rtn.push(circle);
  }
  window.localStorage.setItem("shots", JSON.stringify(circles_to_rtn));
  window.localStorage.setItem("window_width", window.innerWidth);
  window.localStorage.setItem("window_height", window.innerHeight);
  _gaq.push(['_trackEvent', 'Interaction', 'Took Photo']);
  window.location = "loading_screen.html";
}