#!perl -w
use strict;
use Mojolicious::Lite;
use DBI;

use DBD::SQLite;

get '/' => sub {
    my( $c ) = @_;
    $c->redirect('canvas.html');
};

post '/move' => sub {
    my( $c ) = @_;
};

sub fetch_catalog {
    return {
        tables => [
            { name => "Table 1"
            , columns => ["S1","S2","Langespalte 3"]
            , section =>  "System A"
            },
            { name => "Table 2"
            , columns => ["S1","S2","Langespalte 3a"]
            , section =>  "System A"
            , x => 100
            , y => 100
            },
            { name => "Table 3"
            , columns  =>  ["S1","S2","S4","Date"]
            , section =>  "System B"
            , x => 400
            , y => 100
            },
            { name => "Table 4"
            , columns  =>  ["S1","S2","S4","Date"]
            , section =>  "System B"
            , x => 500
            , y => 100
            },
        ],
        
        joins => [
            { "left" => "Table 1", right => "Table 2", columns => [{left => "col_a",right => "col_b"}] },
            { "left" => "Table 2", right => "Table 3", columns => [{left => "col_c",right => "col_c"},{left => "col_d",right => "col_d"}] },
        ],
    };
}

get '/catalog' => sub {
    my( $c ) = @_;
    my $catalog = fetch_catalog();
    $c->render( json => $catalog );
};

app->start;