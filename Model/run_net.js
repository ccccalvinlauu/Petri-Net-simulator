
//field
var RunList = [];
var TimeIcon = null;
var Pause = false;
var ExitRun = false;
var IsRunning = false;
var AnimateDelay = 1000;
var Timer = 0;

var Places = {};
var copiedPlaces = [];
var Trans = {};
var Arcs = [];


//function to start the simulation
function StartRun() {
    if (selecting != null)
        {
            unselect();
        }
    IsRunning = true;
    ExitRun = false;
    Tree_Ready = false;
    ReachabilityTree = [];
    TreeInString = "";
    clear_info();
//copy all the places for stop function
    if(Pause == false){
        copyPlaces();
        Pause =false;
    }
//create the tim icon and its movement, use the animation and AnimateDelay to delay the run time
    TimeIcon = new createTimeIcon(AnimateDelay);

    Run();
}

//fucntion that creates the run icon under the time label
function createTimeIcon(AnimateDelay)
{
    var x = 10;
    var y = 10;
    var rad_TimeIcon = 5;
//create a circle
    this.icon = paper.circle(x, y, rad_TimeIcon).attr({"fill":"black", "stroke":"black"});
//create an anination for the icon, to delay the simulation and move the run icon, after the animation, call back  TimeIconback function after the animation
    this.animationLeft = Raphael.animation({cx: x, cy: y}, AnimateDelay, "easyin",TimeIconBack);
//after the animation, call back process function after the animation
    this.animationRight = Raphael.animation({cx: x+50, cy: y}, AnimateDelay, "easyin", process);
    this.animationStart = function () { this.icon.animate(this.animationLeft); };
    this.animationEnd = function () { this.icon.animate(this.animationRight); };

//remove the icon
    this.remove = function () {
        this.icon.remove();

    };
}

//function to move the time icon and to dealy the run
function TimeIconMove()
{
    TimeIcon.animationStart();

}

//fucntion to move the time icon back
function TimeIconBack()
{

    TimeIcon.animationEnd();
}

//function that check if the transition is ready to fire
function ready_toFire(ArcTo) {
    var isReady = true;
    if (ArcTo === undefined || ArcTo.length == 0) {
      isReady = false;
}else{

      ArcTo.forEach(function (item, ind) {
          if (item.from.temp < item.arrow.weight_count) {
              isReady = false;
          }else{
              item.from.temp-= item.arrow.weight_count;
          }
      });

}


    return isReady;
}

//function to run
function Run()
{
    constrcutRTree();
    info();
//prepare a run list to fire
    RunList = [];

    if (!ExitRun) {
//set a temp tokens count to perform fucntion ready_toFire, not to use the real token_count
        Object.keys(Places).forEach(function (key, ind) { Places[key].temp = Places[key].tokens_count; });


        
                var listKeys = Object.keys(Trans);
        for(var i = 0; i < Object.keys(Trans).length; i++){ 
                var randomIndex = Math.floor(Math.random() * listKeys.length);
                var key = Trans[listKeys[randomIndex]].key;
                var ArcTo = getArcTo(key);
//if all arcs is ready to fire
                if (ready_toFire(ArcTo)) {
//create a run list to perform the changes of tokens count(fire)
                var run_item = {};
                run_item.tran = Trans[key];
                run_item.ArcTo = ArcTo;
                
                run_item.ArcFrom = getArcFrom(key);
                RunList.push(run_item);
                }
            
                listKeys.splice(randomIndex, 1);
                 
        }

        TimeIconMove();
    }
}

//fucntion that handles the tokens changes(fire a transition)
function process(){
        if(Tree_Ready && RunList.length != 0){
            liveness = true;
        }else{
            liveness = false;
        }
        RunList.forEach(function (run_item, ind) {
            run_item.ArcTo.forEach(function(arc, ind){
//change the tokens count of the input places
                arc.from.tokens_count -= arc.arrow.weight_count;
                draw_tokens(arc.from, arc.from.x, arc.from.y);
            });
            run_item.ArcFrom.forEach(function (arc, ind) {
//change the  tokens count of the output places
            arc.to.tokens_count += arc.arrow.weight_count;
            draw_tokens(arc.to, arc.to.x, arc.to.y);
            });
        });
//Time increases by 1
        Timer++;
        setTime();

    Run();

}


//function to pause
function PauseRun() {

    Pause = true;
    TimeIcon.remove();
    ExitRun = true;
    IsRunning = false;
}

//function to stop
function StopRun(){

    TimeIcon.remove();
    ExitRun = true;
    Pause = false;
    IsRunning = false;

//reset the timer
    Timer = 0;
//set the places back to its initially tokens count
    Object.keys(Places).forEach(function(key){
       copiedPlaces.forEach(function(item){
           if(item.key == key){
               Places[key].tokens_count = item.tokens_count;
               draw_tokens(Places[key],Places[key].x, Places[key].y);
           }

       });

    });
     setTime();

}


//function that get all the arcs coonected to the key
function getArcTo(key)
{
    var ArcTo = [];
    Arcs.forEach(function (item, index) {
        if (item.to.key == key) {
            ArcTo.push(item);
        }
    });
    return ArcTo;
}

//function that get all the arcs coonected from the key
function getArcFrom(key) {
    var ArcFrom = [];
    Arcs.forEach(function (item, index) {
        if (item.from.key == key) {
            ArcFrom.push(item);
        }
    });
    return ArcFrom;
}

//function to copy all the places
function copyPlaces(){
    Object.keys(Places).forEach(function(key){
        var copy ={};
        copy.key = key;
        copy.tokens_count = Places[key].tokens_count;
        copiedPlaces.push(copy);
    });

}
