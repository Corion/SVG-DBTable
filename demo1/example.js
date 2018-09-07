var svg = SVG('svg1').size("100%", 900);
var links = svg.group();
var markers = svg.group();
var nodes = svg.group();
var defs = svg.defs();

var telems = {};
var svgTables = {};

function mkTable(svg,tableInfo) {
    var name = tableInfo.name;
    var columns = tableInfo.columns;
    if(! telems[name]) { telems[name] = {} };
    var colrefs = telems[name];
    var t = svg.text((t) => {
        t.tspan(name).attr({"x":0, "y":10,"fill":"crimson","font-weight":"bold"});
        var ofs = 15;
        for (var c in columns) {
            var n = columns[c];
            colrefs[n] =
            t.tspan(n).attr({"y":ofs+=20, "x":10,"fill":"black"});
        }
    });
    t.fill("#E91E63").opacity(0.6);
    var b = t.bbox();
    var border = svg.rect(b.width, b.height).move(b.x,b.y).attr({"fill":"white","stroke":"black"});
    var g = svg.group().draggy();
    g.add(border);
    g.add(t);

    svgTables[ name ] = g;

    if( tableInfo.x || tableInfo.y ) {
        g.move( tableInfo.x, tableInfo.y );
    };

    g.on('dragend', (event) => {
        // Save the new coordinates in the backend
        var info = {
            from : { x: null, y: null },
            to   : { x: event.detail.event.pageX, y: event.detail.event.pageY }
        };
        console.log("Moved: "+name+" to ",info,event.detail);

        // Also update borders around table groups via group.bbox()

    });
    return g;
}

var tables = [
    { name:"Table 1"
    , columns:["S1","S2","Langespalte 3"]
    },
    { name:"Table 2"
    , columns:["S1","S2","Langespalte 3a"]
    , x:100
    , y:100
    },
    { name:"Table 3"
    , columns : ["S1","S2","S4","Date"]
    , x:400
    , y:100
    },
];

var joins = [
    { left: "Table 1", right: "Table 2", columns:[{left:"",right:""}] },
    { left: "Table 2", right: "Table 3", columns:[{left:"",right:""}] },
];

function mkTables( nodes, tables ) {
    return tables.map( (table) => { mkTable( nodes, table ) } )
}

function mkJoin( nodes, join ) {
    var tableL = svgTables[ join.left ];
    var tableR = svgTables[ join.right ];
    var conn1 = tableL.connectable({
        container: links,
        markers: markers,
        marker: 'default',
        targetAttach: 'perifery',
        sourceAttach: 'perifery',
        //color: '#2a88c9'
    }, tableR );
    conn1.setMarker('default',markers);

}

function mkJoins( nodes, joins ) {
    joins.map( (join) => { mkJoin( nodes, join )})
}

mkTables( nodes, tables );
mkJoins( nodes, joins );

// console.log(telems);