var svg = SVG('svg1').size("100%", 900);
var links = svg.group();
var markers = svg.group();
var nodes = svg.group();
var defs = svg.defs();

var telems = {};
var svgTables = {};
var sections = {};

function sizeSection(section) {
    // Also add a section title in the middle of the BB
    var s = sections[section];
    var b = s.border;
    var bb = s.group[0].rbox();
    s.group.map( (p) => ( bb = bb.merge( p.rbox() )) );
    b.move( bb.x-15, bb.y-15 ).attr({ width:bb.width+15,height:bb.height+15 });
    s.title.move( b.x()+(b.width() - s.title.width()) / 2, b.y() );
}

function mkSection(svg, info) {
    var border = svg.rect().attr({"fill-opacity":0,"stroke":"red","stroke-dasharray":"4"});
    var title = svg.text(info);
    // Should we group those?!
    var g = svg.group();
    g.add( border );
    g.add( title );
    return {
            border: border,
            title: title,
            g: g,
            group: [],
    };
}

function mkTable(svg,tableInfo) {
    var name = tableInfo.name;
    var columns = tableInfo.columns;
    if(! telems[name]) { telems[name] = {} };
    var colrefs = telems[name];

    if( ! sections[ tableInfo.section ]) {
        sections[ tableInfo.section ] = mkSection( svg, tableInfo.section );
    };

    let t = svg.text((t) => {
        t.tspan(name).attr({"x":0, "y":10,"fill":"crimson","font-weight":"bold"});
        let ofs = 15;
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
    sections[ tableInfo.section ].group.push( g );

    svgTables[ name ] = g;

    if( tableInfo.x || tableInfo.y ) {
        g.move( tableInfo.x, tableInfo.y );
    };

    sizeSection( tableInfo.section );
    g.on('dragmove', function(event) {
        // Broadcast new position, every 0.5 seconds
        var info = {
            from : { x: null, y: null },
            to   : { x: event.detail.event.pageX, y: event.detail.event.pageY }
        };
        console.log("Moving: "+name+" at ",info,event.detail);
    });
    g.on('dragend', (event) => {
        // Save the new coordinates in the backend
        var info = {
            from : { x: null, y: null },
            to   : { x: event.detail.event.pageX, y: event.detail.event.pageY }
        };
        console.log("Moved: "+name+" to ",info,event.detail);

        // Broadcast new position of item

        // Also update borders around table groups via group.bbox()
        sizeSection( tableInfo.section );

    });
    return g;
}

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

function exportAsSvg() {
    var svg_blob = new Blob([svg.svg()],
                            {'type': "image/svg+xml"});
    var url = URL.createObjectURL(svg_blob);
    window.location = url;
    // var svg_win = window.open(url, "svg_win");
}
// console.log(telems);