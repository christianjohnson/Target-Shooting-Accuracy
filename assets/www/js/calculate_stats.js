function dist(A,B){
    return Math.sqrt( Math.pow( A.x - B.x, 2 ) + Math.pow(A.y - B.y, 2 ) );
}

function scaled_dist(A,B,X,Y){
    return Math.sqrt( Math.pow( A.x/X - B.x/X, 2 ) + Math.pow(A.y/Y - B.y/Y, 2 ) );
}

function avg_dist(C,L){
    s = 0.0;
    for(i=0;i<L.length;i++){
        s += dist(C,L[i]);
    }

    return s/L.length;
}

var cutoffs = new Array(.2,.7,2);
var labels = new Array("Excellent", "Okay", "Poor");
var colors = new Array("FF0000","00FF00","0000FF");

function bucket(c,pointList,X,Y) {
	var m = new Array();
	for (i=0;i<cutoffs.length;i++) {
		m[i] = new Array();
		m[i][0] = labels[i];
		m[i][1] = 0;
	}
	for (i=0;i<pointList.length;i++) {
		d = scaled_dist(c,pointList[i],X,Y);
		b = 0;
		for (j=0;j<cutoffs.length;j++) {
			if(d<cutoffs[j]) {
				b = j;
				break;
			}
		}
		m[b][1] += 1;
	}
	
	return m;
}

function extract_target(pointList) {
	c = new Array();
    l = new Array();
    for(i=0;i<pointList.length;i++){
        if(pointList[i].name == "target"){
          c.push(pointList[i]);
        }
        else{
          l.push(pointList[i]);
        }
    }
    return new Array(c[0],l);
}

function pie_static(pointList,xPic,yPic,xSize,ySize) {
	a = extract_target(pointList);
	c = a[0]
	shots = a[1]
	
	m = bucket(c,shots,xPic,yPic);

	// http://chart.googleapis.com/chart?cht=p&chs=250x350&chdl=Excellent|Okay|Poor&chco=0000FF|00FF00|FF0000&chd=t:10,20,30&chdlp=t&chma=10,10,10,10&chds=0,50
	
	s = "http://chart.googleapis.com/chart?cht=bvg&";
    s += 'chs=' + xSize + 'x' + ySize + '&';
    
    data_string = "chd=t:";
    label_string = "chdl=";
    color_string = "chco=";
    
    data_max = 0;
    
    for (i=0;i<m.length;i++) {
    	if (m[i][1] > data_max) {
    		data_max = m[i][1];
    	}
    }
    data_max += 1;
    
    for (i=0;i<m.length;i++) {
    	data_string += m[i][1];
    	label_string += m[i][0];
    	color_string += colors[i];
    	if (i<m.length-1) {
    		data_string += ",";
    		label_string += "|";
    		color_string += "|";
    	}
    }
    
    s += data_string + "&";
    s += label_string + "&";
    s += color_string + "&";
    s += "chds=0," + data_max + "&";
    
    s += "chdlp=t&chma=10,10,10,10";
    
    return s;
	
	
}

function bar_static(pointList,xPic,yPic,xSize,ySize) {
	a = extract_target(pointList);
	c = a[0]
	shots = a[1]
	
	m = bucket(c,shots,xPic,yPic);
	
	// http://chart.googleapis.com/chart?cht=bvg&chs=250x350&chd=t:10,50,30&chxt=x,y&chco=00FF00|FF0000|0000FF&chxl=0:|Excellent|Okay|Poor&chma=10,10,10,10&chxr=1,0,10&chbh=r
	
	s = "http://chart.googleapis.com/chart?cht=bvg&";
    s += 'chs=' + xSize + 'x' + ySize + '&';
    s += "chxt=x,y&";
    
    data_string = "chd=t:";
    label_string = "chxl=0:|";
    color_string = "chco=";
    
    data_max = 0;
    
    for (i=0;i<m.length;i++) {
    	if (m[i][1] > data_max) {
    		data_max = m[i][1];
    	}
    }
    data_max += 1;
    
    for (i=0;i<m.length;i++) {
    	data_string += (m[i][1]/data_max) * 100;
    	label_string += m[i][0];
    	color_string += colors[i];
    	if (i<m.length-1) {
    		data_string += ",";
    		label_string += "|";
    		color_string += "|";
    	}
    }
    
    s += data_string + "&";
    s += label_string + "&";
    s += color_string + "&";
    
    s += "chxr=1,0," + data_max + "&";
    
    s += "chma=10,10,10,10&chbh=r";
    
    return s;
}

function bar_pie_dynamic(pointList,xPic,yPic) {
	a = extract_target(pointList);
	c = a[0];
	shots = a[1];
	
	m = bucket(c,shots,xPic,yPic);
	var a = new Array();
    a.push(new Array("Distance","Number of Shots"));
    for(i=0;i<m.length;i++) {
    	a.push(m[i]);
    }
    
	return a;
}

function centroid_static(pointList,xSize,ySize) {
	// Extract the center
	a = extract_target(pointList);
	c = a[0];
	shots = a[1];
	
	// Calculate the centroid
	cX = 0.0;
    cY = 0.0;

    for(i=0;i<shots.length;i++) {
        cX += shots[i].x;
        cY += shots[i].y;
    }
    cX = cX / shots.length;
    cY = cY / shots.length;

    //http://chart.googleapis.com/chart?cht=s&chs=300x200&chd=t:25,2,70,50,60|35,4,80,50,60&chco=FF0000|00FF00|0000FF|0000FF|0000FF&chdl=Target|Centroid|Shots&chg=10,10,4,4,-5,-5

    // Base URL plus size
    s  = 'http://chart.googleapis.com/chart?cht=s&';
    s += 'chs=' + xSize + 'x' + ySize + '&';
    s += 'chd=t:';

    // Calculate the max and min X and Y values for scaling
    maxX = c.x;
    minX = c.x;
    maxY = c.y;
    minY = c.y;

    for(i=0;i<shots.length;i++) {
        maxX = Math.max(maxX,shots[i].x);
        minX = Math.min(minX,shots[i].x);
        maxY = Math.max(maxY,shots[i].y);
        minY = Math.min(minY,shots[i].y);
    }

    // Scale each point to be in [0,100],[0,100]
    xS = 100*(c.x-minX)/(maxX-minX)     + ',' + 100*(cX-minX)/(maxX-minX);
    yS = 100*(1-(c.y-minY)/(maxY-minY)) + ',' + 100*(1-(cY-minY)/(maxY-minY));
    colors = 'FF0000|00FF00';

    for (i=0;i<shots.length;i++) {
        xS += ',' + 100*(shots[i].x-minX)/(maxX-minX);
        yS += ',' + 100*(1-(shots[i].y-minY)/(maxY-minY));
        colors += '|0000FF';
    }

    s += xS + '|' + yS + '&' + 'chco=' + colors + '&';

    s += 'chdl=Target|Centroid|Shots&';

    xScale = 100/(xSize/50);
    yScale = 100/(ySize/50);

    // Draw grid lines with 50 pixels distance and centered on the target
    s += 'chg=' + 100/(xSize/50) + ',' + 100/(ySize/50) + ',4,4,' + ((100*(c.x-minX)/(maxX-minX))%xScale) + ',' + ((100*(1-(c.y-minY)/(maxY-minY)))%yScale) + '&';

    s += 'chma=10,10,10,10';

    return s;
}

function centroid_dynamic(pointList) {
	// Extract the center
	q = extract_target(pointList);
	c = q[0];
	shots = q[1];
	
	// Calculate the centroid, cX and cY
	cX = 0.0;
    cY = 0.0;
    for(i=0;i<shots.length;i++) {
        cX += shots[i].x;
        cY += shots[i].y;
    }
    cX = cX / shots.length;
    cY = cY / shots.length;

    // Start building the return array
    a = new Array();
    a.push(new Array("X","Shots","Target","Centroid"));
    
    pushed_target = false;
    pushed_centroid = false;

    // If the center or centroid share an X value with each other or a shot, we need to combine them
    for(i=0;i<shots.length;i++) {
        p = shots[i];
        l = new Array(p.x-c.x,c.y-p.y);

        if(!pushed_target && c.x == p.x) {
            l.push(c.y-c.y);
            pushed_target = true;
        } else {
            l.push(null);
        }

        if(!pushed_centroid && cX == p.x) {
            l.push(c.y-cY);
            pushed_centroid = true;
        } else {
            l.push(null);
        }

        a.push( l );
    }
    
    if( !pushed_target ) {
        l = new Array(c.x-c.x, null, c.y-c.y);
        if(!pushed_centroid && cX == c.x) {
            l.push(c.y-cY);
            pushed_centroid = true;
        } else {
            l.push(null);
        }
        a.push(l);
    }

    if( !pushed_centroid ) {
        a.push(new Array(cX-c.x,null,null,c.y-cY));
    }

    return a;
	
}

try {
  google.load("visualization", "1", { packages: ["corechart"] } );
  google.setOnLoadCallback(drawBarChart);
  var bar_view = 0;	
} catch (ReferenceError){
  alert("You seem to be offline.  Please try again when you have a network connection or are on a WiFi network.");
  window.location = "index.html";
}

function getData(legend_flag, stats){
  var circles = JSON.parse(window.localStorage.getItem("shots"));
  var width = window.localStorage.getItem("window_width");
  var height = window.localStorage.getItem("window_height");
  var chart_height = window.innerHeight - 
  	  3.25 * document.getElementById("help_button").offsetHeight;
  
  console.log("Window Height: " + window.innerHeight);
  console.log("Window Width: " + window.innerWidth);
  console.log("Button height: " + document.getElementById("help_button").offsetHeight);
  
  var parsed_data = null;
  
  if (stats){
	parsed_data = google.visualization.arrayToDataTable(bar_pie_dynamic(circles,width,height));
  }else{
	//parsed_data = google.visualization.arrayToDataTable(get_centroid_stats(circles, width, height));
	  parsed_data = centroid_static(circles, window.innerWidth, chart_height);
  }	 
	
  
  var legend = legend_flag ? {position: 'top'} : {position : 'none'};

  var options = stats ? {
    height: chart_height,
	width: window.innerWidth,
	legend: legend,
	title: 'Shot Performance',
    vAxis: {title: 'Number of Shots',  titleTextStyle: {color: 'red'} },
    hAxis: {title: 'Quality of Shots',  titleTextStyle: {color: 'red'} }
  } : {
	height: chart_height,
	width: window.innerWidth,
	legend: legend,
	title: 'Shot Performance',
	vAxis: {textPosition: 'none' },
    hAxis: {textPosition: 'none' }
  };
  
  return [parsed_data, options];
}


function drawBarChart(){
  var stuff = getData(false, true);
  var data = stuff[0];
  var options = stuff[1];
  var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
  chart.draw(data, options);
  _gaq.push(['_trackEvent', 'Interaction', 'Viewed Bar Chart']);
}


function drawPieChart(){
  var stuff = getData(true, true);
  var data = stuff[0];
  var options = stuff[1];
  var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
  chart.draw(data, options);
  _gaq.push(['_trackEvent', 'Interaction', 'Viewed Pie Chart']);
}

function drawScatterChart(){
  var stuff = getData(true, false);
  var data = stuff[0];
  $("#chart_div").empty();
  $("#chart_div").append('<img src="' + data + '" />');
  console.log("IMG SRC: " + data);
  //var options = stuff[1]; 
  //var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));
  //chart.draw(data, options);
  _gaq.push(['_trackEvent', 'Interaction', 'Viewed Scatter Chart']);
}

function toggleChart(){
  if (bar_view == 0){
	  console.log("Drawing pie chart: " + bar_view);
	  drawPieChart();
	  document.getElementById('chart_text').innerHTML = "Toggle Scatter Chart";
	  bar_view++;
  }else if (bar_view == 1){
	  console.log("Drawing scatter chart: " + bar_view);
	  drawScatterChart();
	  document.getElementById('chart_text').innerHTML = "Toggle Bar Chart";
	  bar_view++;
  }else{
	  console.log("Drawing bar chart: " + bar_view);
	  drawBarChart();
	  document.getElementById('chart_text').innerHTML = "Toggle Pie Chart";
	  bar_view = 0;
  }
}
