    var Info = "";
    var ReachabilityTree = [];
    var TreeInString = "";
    var Tree_Ready = false;
    var conservativeness = false;
    var liveness = false;
    var safeness = false;
    var totalPlaces = 0;
    var totalTrans = 0;
    var totalArcs = 0
    var totalTokens = 0;

//fucntion to construct the reachability tree
function constrcutRTree(){
    var array = [];
    var repeated = false;
    Object.keys(Places).forEach(function(key){
            array.push(Places[key].tokens_count);      
    });
    for(var i = 0; i < ReachabilityTree.length; i++){
        if(JSON.stringify(ReachabilityTree[i]) === JSON.stringify(array)){
            repeated = true;
        }

    }
    if(!repeated){
        var temp = JSON.stringify(array);
        TreeInString = TreeInString + temp +"<br>";
        ReachabilityTree.push(array);

    }else{
        Tree_Ready = true;
    }
    
}

function clear_info(){
    totalPlaces = 0;
    totalTrans = 0;
    totalArcs = 0
    totalTokens = 0;
    Info = "";
    set_Text();
}

function info(){
    clear_info();
    getTotal();
    
    if(Tree_Ready){
        get_properties();
    }
    set_Text();

}

function getTotal(){
    Object.keys(Places).forEach(function(key){
        totalPlaces++;
        totalTokens += Places[key].tokens_count;
        
    });
    Object.keys(Trans).forEach(function(key){
        totalTrans++;

    });
    totalArcs = Arcs.length;
    
}

function set_Text(){
    Info = "Total Placess : " + totalPlaces + " &nbsp &nbsp";
    Info = Info + "Total Transitions : " + totalTrans + "&nbsp &nbsp";
    Info = Info + "Total Arcs : " + totalArcs + "&nbsp &nbsp";
    Info = Info + "Total tokens : " + totalTokens + "<br>";
    if(!Tree_Ready){
       Info = Info + "Reachability Tree is not ready yet, keep running the net in order to constrcut the net<br>";
    }
    else{
        Info = Info + "Reachability Tree : <br>" + TreeInString + " &nbsp &nbsp";
        Info = Info + "Conservativeness : " + conservativeness + " &nbsp &nbsp";
        Info = Info + "Liveness : " + liveness + " &nbsp &nbsp";
        Info = Info + "1-safeness : " + safeness + "  &nbsp &nbsp";
    }
    document.getElementById("info").innerHTML = Info;
    
}


function get_properties(){
    get_conservativeness();
    get_safeness();
    
    
}

function get_conservativeness(){
    var first = ReachabilityTree[0];
    var last = ReachabilityTree[ReachabilityTree.length-1];
    var firstsum = first.reduce(function(a, b) { return a + b; }, 0);
    var lastsum = last.reduce(function(a, b) { return a + b; }, 0);
    if(firstsum == lastsum)
        conservativeness = true;
    else
        conservativeness = false;
}


function get_safeness(){
    var max = 0;
    for(var i = 0; i < ReachabilityTree.length; i++){
        var temp = Math.max(...ReachabilityTree[i]);
        if(temp > max){
            max = temp;
        }
    }
    if(max < 2)
        safeness = true;
    else
        safeness = false;
    
}