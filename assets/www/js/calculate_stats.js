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
    if(d<0) {
        return "perfect";
    } else if(d < .1) {
        return "perfect";
    } else if(d < .2) {
        return "excellent";
    } else if(d < .3) {
        return "very good";
    } else if(d < .4) {
        return "good";
    } else if(d < .5) {
        return "okay";
    } else if(d < .6) {
        return "meh";
    } else if(d < .7) {
        return "poor";
    } else if(d < .8) {
        return "bad";
    } else if(d < .9) {
        return "dreadful";
    } else {
        return "you shouldn't shoot while drinking";
    }
}

function dist_distribution(c, pointList, X, Y) 
{
    var m = new Object();
    for(i=0;i<pointList.length;i++)
    {
        d = scaled_dist(c,pointList[i],X,Y);
        d = Math.round(d*10)/10.0;
        if(m[d] == undefined)
        {
            m[d] = new Array();
            m[d][0] = get_label(d);
            m[d][1] = 0;
        }
        m[d][1] += 1;
    }
    var a = new Array();
    a.push(new Array("Distance","Number of Shots"));
    for (var key in m) {
        if (m.hasOwnProperty(key)) {
            a.push(m[key]);
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

