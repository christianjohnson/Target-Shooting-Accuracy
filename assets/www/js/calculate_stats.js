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
    for(i=0;i<20;i+=1){
        m[i] = new Array();
        m[i][0] = get_label(i/10.0);
        m[i][1] = 0;
    }
    for(i=0;i<pointList.length;i++){
        d = scaled_dist(c,pointList[i],X,Y);
        d = Math.round(d*10);
        m[d][1] += 1;
    }
    var a = new Array();
    a.push(new Array("Distance","Number of Shots"));
    for (i=0;i<20;i+=1) {
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
var bar_view = true;
var parsed_data = null;

function getData(legend_flag){
  var circles = JSON.parse(window.localStorage.getItem("shots"));
  var width = window.localStorage.getItem("window_width");
  var height = window.localStorage.getItem("window_height");
  parsed_data = google.visualization.arrayToDataTable(
      get_stats(circles,width,height));
  var chart_height = window.innerHeight - 
      document.getElementById("help_button").offsetHeight - 
	  document.getElementById("footer").offsetHeight
	  
  var legend = legend_flag ? {position: 'top'} : {position : 'none'};
	  
  var options = {
    height: chart_height,
	width: window.innerWidth,
	legend: legend,
	title: 'Shot Performance',
	vAxis: {title: 'Number of Shots',  titleTextStyle: {color: 'red'}},
	hAxis: {title: 'Quality of Shots',  titleTextStyle: {color: 'red'}}
  };
  return [parsed_data, options];
}


function drawBarChart(){
  var stuff = getData(false);
  var data = stuff[0];
  var options = stuff[1];
  var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
  chart.draw(data, options);
  _gaq.push(['_trackEvent', 'Interaction', 'Viewed Bar Chart']);
}


function drawPieChart(){
  var stuff = getData(true);
  var data = stuff[0];
  var options = stuff[1];
  var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
  chart.draw(data, options);
  _gaq.push(['_trackEvent', 'Interaction', 'Viewed Pie Chart']);
}


function toggleChart(){
  if (bar_view){
	  drawPieChart();
	  document.getElementById('chart_text').innerHTML = "Toggle Bar Chart";
	  bar_view = !bar_view;
  }else{
	  drawBarChart();
	  document.getElementById('chart_text').innerHTML = "Toggle Pie Chart";
	  bar_view = !bar_view;
  }
}
