function dist(A,B)
{
    return Math.sqrt( Math.pow( A.getX() - B.getX(), 2 ) + Math.pow(A.getY() - B.getY(), 2 ) );
}

function scaled_dist(A,B,X,Y)
{
    return Math.sqrt( Math.pow( A.getX()/X - B.getX()/X, 2 ) + Math.pow(A.getY()/Y - B.getY()/Y, 2 ) );
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
            m[d][0] = String(d);
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
        if(pointList[i].getName() == "target")
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

