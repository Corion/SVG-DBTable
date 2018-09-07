var svg = SVG('svg1').size("100%", 900);
var links = svg.group();
var markers = svg.group();
var nodes = svg.group();
var defs = svg.defs();

var telems = {};

function mkTable(svg,name,columns) {
    if(! telems[name]) { telems[name] = {} };
    var colrefs = telems[name];
    var t = svg.text(function(t) {
        t.tspan(name).attr({"x":0, "y":0,"fill":"crimson","font-weight":"bold","text-anchor":"top"});
        var ofs = 45;
        for (var c in columns) {
            var n = columns[c];
            colrefs[n] =
            t.tspan(n).attr({"y":ofs+=20, "x":10,"fill":"black"});
        }
    });
    t.fill("#E91E63").opacity(0.6);
    var b = t.rbox();
    var border = svg.rect(b.width, b.height).move(b.x,b.y).attr({"fill":"white","stroke":"black"});
    var g = svg.group().draggy();
    g.add(border);        
    g.add(t);        
    return g;
}


var myTable  = mkTable(nodes,"Table 1",["S1","S2","Langespalte 3"]);
var myTable2 = mkTable(nodes,"Table 2",["S1","S2","Langespalte 3a"]);
var myTable3 = mkTable(nodes,"Table 3",["S1","S2","S4","Date"]);

console.log(telems);

var conn1 = myTable.connectable({
    container: links,
    markers: markers,
    marker: 'default',
    targetAttach: 'perifery',
    sourceAttach: 'perifery',
    //color: '#2a88c9'
}, myTable2);
conn1.setMarker('default',markers);

var conn2 = myTable2.connectable({
    //container: myTable2,
    markers: markers,
    targetAttach: 'perifery',
    sourceAttach: 'perifery',
    type: 'curved'
},myTable3);

//conn2.setConnectorColor("#00ff4a");
conn2.setMarker('default',markers);

//var connectorInUse = nodes.use(connector)