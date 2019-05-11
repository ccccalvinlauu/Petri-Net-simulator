var paper = null;
var help_text = "Graphically, a Petri Net structure consists of tokens, places, transitions and arcs. Tokens are placed in the place and when a transition of a Petri Net satisfies some rules. <br> for example, when sufficient tokens are placed in all input places, it may fire and when it does, tokens will be consumed depending on the required input tokens, and at the output places, tokens will be created. Places may hold tokens and depending on the arcs connection, it can be an input place or an output place, when an arc runs towards a transition, it is an input place; when an arc runs from a transition toward a place, it is an output place. Arcs are used to connect a place to a transition or vice versa, but never between places or between transitions.<br> By default, Arc has a capacity of 1 but it can be greater than 1 and will be marked on the arc. As mentioned before, a transition can only be enabled when the conditions are satisfied.<br>In details, the number of tokens in all its input places should not be less than the arc weight running from the place towards the transition. The enabled transition could fire in anytime and when it does, tokens will be consumed according to arc weights, tokens will be created in the output place.";
    function onload() {

//create svg canvas
        var center_row = document.getElementById("center_row");
        paper = new Raphael("center_row");
//set up buttons

        SetUpbutton("btnAddPlaces", function () { NewPlace(40, 65); });
        SetUpbutton("btnAddTrans", function () { NewTransition(40, 65); });
        SetUpbutton("btnAddArcs", function () { ArcInput(); });
        SetUpbutton("btnRemove", function () { RemoveObject(); });
        SetUpbutton("btnClear", function () { Clear(); });
        SetUpbutton("btnRun", function () { run_clicked(); });
        SetUpbutton("btnPause", function () { Pause_clicked(); });
        SetUpbutton("btnStop", function () { Stop_clicked(); });
        SetUpbutton("btnSave",function(){Save();});
        SetUpbutton("Example1", function(){Loadexample(1);});
        SetUpbutton("Example2", function(){Loadexample(2);});
        SetUpbutton("Example3", function(){Loadexample(3);});
        SetUpbutton("Example4", function(){Loadexample(4);});
        SetUpbutton("btnAnalysis", function(){Analysis();});
        SetUpbutton("btnHelp", function(){helpInfo();});
        SetUpbutton("btnReload", function() {resize();});
//set up timer
         $('.disableIdle').prop('disabled', true);
        setTime();
    }

//onclick fucntion for buttons
    function SetUpbutton(id, onclick){
        var btn = document.getElementById(id);
        btn.onclick = onclick;
    }
//clear the drawing area and remove all
    function Clear() {
        paper.clear();
        Places = {};
        Trans = {};
        Arcs = [];
    }

//function to create new place
    function NewPlace(x, y)
    {
        AddPlace("P" + next_key(Places), x, y, 0);
    }

//function to create new transition
    function NewTransition(x, y) {
        AddTransition("T" + next_key(Trans), x, y);
    }
//function to run
    function run_clicked() {
//check if there is any places, transitions and arc
        if (Object.keys(Places).length > 0 && Object.keys(Trans).length > 0 && Arcs.length > 0) {
//disable and enable button groups
            $('.disableWhenRun').prop('disabled', true);
            $('.disableIdle').prop('disabled', false);
//start run
            StartRun();

        }
        else
        {
            alert("No valid net was found.");
        }
    }

//Pause
    function Pause_clicked() {
        if (IsRunning) {
//disable and enable button groups
            $('.disableIdle').prop('disabled', true);
            $('.enableWhenPause').prop('disabled', false);
            PauseRun();
        }
        else {
            alert("There is nothing running.");
        }
    }

//Stop
    function Stop_clicked() {
//disable and enable button groups
            $('.disableWhenRun').prop('disabled', false);
            $('.disableIdle').prop('disabled', true);
            StopRun();

    }
//Load examples
    function Loadexample(key){
            if(!IsRunning){
            var example = null;
                switch(key){
            case 1:
               example = { places:[["P1",60,245,1],["P2",310,60,0],["P3",575,150,0],["P4",878,125,0],["P5",310,180,0],["P6",664,281,0]], trans:[["T1",143,84],["T2",455,150],["T3",455,250],["T4",750,160],["T5",455,50],["T6",750,405]], arcs:[["P1","T1"],["T1","P2"],["P2","T2"],["T2","P3"],["P5","T3"],["T3","P6"],["T1","P5"],["P3","T4"],["T4","P4"],["P2","T5"],["T5","P4"],["P4","T6"],["P6","T6"],["T6","P1"]] };

                break;
            case 2:
                 example = { places:[["P1",100,200,1],["P2",375,200,0],["P3",620,80,0],["P4",620,280,1]], trans:[["T1",230,80],["T2",230,280],["T3",500,200],["T4",775,200]], arcs:[["P1","T1",1],["T1","P2",2],["P2","T2",1],["T2","P1",1],["P2","T3",1],["T3","P3",1],["P4","T3",1],["P3","T4",1],["T4","P4",1]] };
                break;
            case 3:
                example =  {places:[["P1",235,223,2],["P2",508,129,0],["P3",910,345,0],["P4",714,275,0]],trans:[["T2",356,125],["T3",665,160],["T4",593,247],["T5",591,351],["T1",47,217]],arcs:[["P1","T2",2],["T2","P2",2],["P2","T3",1],["T3","P3",1],["P2","T4",1],["T4","P4",1],["P4","T5",1],["P3","T5",1],["T5","P1",2],["P1","T1",1],["T1","P1",1]]};


                break;
            case 4:
                example =  {places:[["P1",45,175,2],["P2",435,65,0],["P3",395,175,2],["P4",435,315,0]],trans:[["T1",230,85],["T2",230,300],["T3",630,95],["T4",625,285]],arcs:[["P1","T1",1],["P1","T2",1],["P3","T1",1],["P3","T2",1],["T1","P2",1],["T2","P4",1],["P2","T3",1],["P4","T4",1],["T3","P3",1],["T3","P1",1],["T4","P3",1],["T4","P1",1]]};


                break;


            }


        }
//construct the net
        construntNet(example);

    }

//Analysis button clicked
    function Analysis(){
        var e = document.getElementById('analysis_div');
        if ( e.style.display == 'block' ){
            e.style.display = 'none';
        } else{
            e.style.display = 'block';
            info();
        }


    }
    
    function helpInfo(){
        var e = document.getElementById('help_div');
        if ( e.style.display == 'block' ){
            e.style.display = 'none';
        } else{
            e.style.display = 'block';
            document.getElementById("help_text").innerHTML = help_text;
        }
        
    }
