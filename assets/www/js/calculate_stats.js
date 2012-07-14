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

function get_label(d){
    if(d < .1) {
    	return "Perfect";
    } else if(d < .2) {
        return "Excellent";
    } else if(d < .3) {
        return "Very Good";
    } else if(d < .4) {
        return "Good";
    } else if(d < .5) {
        return "Okay";
    } else if(d < .6) {
        return "Poor";
    } else if(d < .7) {
        return "Bad";
    } else if(d < .8) {
        return "Dreadful";
    } else {
        return "N/A";
    }
}

function dist_distribution(c, pointList, X, Y) {
    var m = new Array();
    for(i=0;i<9;i+=1){
        m[i] = new Array();
        m[i][0] = get_label(i/10.0);
        m[i][1] = 0;
    }
    for(i=0;i<pointList.length;i++){
        d = scaled_dist(c,pointList[i],X,Y);
        d = Math.round(d*10);
        if (d >= m.length) {
            d = m.length-1;
        }
        m[d][1] += 1;
    }
    var a = new Array();
    a.push(new Array("Distance","Number of Shots"));
    for (i=0;i<9;i+=1) {
        if  (m[i][1] > 0) {
            a.push(m[i]);
        }
    }

    return a;
}

function centroid(c, pointList, X, Y) {
    cX = 0.0;
    cY = 0.0;
    for(i=0;i<pointList.length;i++) {
        cX += pointList[i].x;
        cY += pointList[i].y;
    }
    cX = cX / pointList.length;
    cY = cY / pointList.length;

    a = new Array();
    a.push(new Array("X","Shots","Target","Centroid"));
    
    pushed_target = false;
    pushed_centroid = false;

    for(i=0;i<pointList.length;i++) {
        p = pointList[i];
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

function get_centroid_stats(pointList, xDimen, yDimen){
    c = new Array();
    l = new Array();
    for(i=0;i<pointList.length;i++)
    {
        if(pointList[i].name == "target")
        {
            c.push(pointList[i]);
        }
        else
        {
            l.push(pointList[i]);
        }
    }
    return centroid(c[0], l,xDimen,yDimen);
}

function get_stats(pointList, xDimen, yDimen){
    c = new Array();
    l = new Array();
    for(i=0;i<pointList.length;i++)
    {
        if(pointList[i].name == "target")
        {
            c.push(pointList[i]);
        }
        else
        {
            l.push(pointList[i]);
        }
    }
    return dist_distribution(c[0], l,xDimen,yDimen);
}


google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(drawBarChart);
var bar_view = 0;

function getData(legend_flag, stats){
  var circles = JSON.parse(window.localStorage.getItem("shots"));
  var width = window.localStorage.getItem("window_width");
  var height = window.localStorage.getItem("window_height");
  var chart_height = window.innerHeight - 
  	document.getElementById("help_button").offsetHeight - 
  	document.getElementById("footer").offsetHeight;
  
  var parsed_data = null;
  
  if (stats)
    parsed_data = google.visualization.arrayToDataTable(get_stats(circles,width,height));
  else
	parsed_data = google.visualization.arrayToDataTable(get_centroid_stats(circles,width,height));
	  
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
	title: 'Shot Performance'
  };
  
  return [parsed_data, options];
}


function drawBarChart(){
  var stuff = getData(false, true);
  var data = stuff[0];
  var options = stuff[1];
  var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
  chart.draw(data, options);
  //_gaq.push(['_trackEvent', 'Interaction', 'Viewed Bar Chart']);
}


function drawPieChart(){
  var stuff = getData(true, true);
  var data = stuff[0];
  var options = stuff[1];
  var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
  chart.draw(data, options);
  //_gaq.push(['_trackEvent', 'Interaction', 'Viewed Pie Chart']);
}

function drawScatterChart(){
  var stuff = getData(true, false);
  var data = stuff[0];
  var options = stuff[1]; 
  var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));
  chart.draw(data, options);
  //_gaq.push(['_trackEvent', 'Interaction', 'Viewed Scatter Chart']);
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
