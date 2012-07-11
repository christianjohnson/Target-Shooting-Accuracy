function dist(A,B)
{
    return Math.sqrt( Math.pow( A.x - B.x, 2 ) + Math.pow(A.y - B.y, 2 ) );
}

function scaled_dist(A,B,X,Y)
{
    return Math.sqrt( Math.pow( A.x/X - B.x/X, 2 ) + Math.pow(A.y/Y - B.y/Y, 2 ) );
}

function avg_dist(C,L)
{
    s = 0.0;
    for(i=0;i<L.length;i++)
    {
        s += dist(C,L[i]);
    }

    return s/L.length;
}

function get_label(d)
{
    if(d < .1) {
    	return "Perfect";
    } else if(d < .2) {
        return "Excellent";
    } else if(d < .3) {
        return "Very Good";
    } else if(d < .4) {
        return "Good";
    } else if(d < .6) {
        return "Okay";
    } else if(d < .7) {
        return "Poor";
    } else if(d < .8) {
        return "Dreadful";
    } else {
        return "N/A";
    }
}

function dist_distribution(c, pointList, X, Y) 
{
    var m = new Array();
    for(i=0;i<20;i+=1)
    {
        m[i] = new Array();
        m[i][0] = get_label(i/10.0);
        m[i][1] = 0;
    }
    for(i=0;i<pointList.length;i++)
    {
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

function get_stats(pointList, xDimen, yDimen)
{
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

