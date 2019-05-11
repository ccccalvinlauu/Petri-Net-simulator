
var selecting = "&nbsp;";



//function to create the text info for place, transition and arc
function createText(key, x, y){
    return paper.text(x, y - 40, key).attr(text_setting);

}

//function to recreate the text
function recreate_text(node, x, y, key) {
    node.info.remove();
    node.info = createText(key, x, y)
}



//function to draw tokens on a specific place
function draw_tokens(node, x, y) {
//first remove if there is token displayed
        if(node.tokens != null){
            node.tokens.remove();
        }
    if(node.tokens_count == 0){

    }else{
//  creates array-like object to keep and operate several elements at once
        var tn = paper.set();
//push a circle(tokens) and a text(number of tokens) to svg(paper)
        tn.push(paper.circle(x, y, 10).attr(token_setting));
        tn.push(paper.text(x, y, node.tokens_count.toString()).attr(text_onToken));
        node.tokens = tn;
    }


}




//function to change the label on the menu bar
function changeLabel(info){
     var selected_label = document.getElementById("selected_label");
    if (selected_label != null)
        selected_label.innerHTML = info;
}



//function that allow user to enter the places and the transition to create arcs.
function ArcInput(){
        var node1;
        var node2;
        var from = prompt("Please enter the place ID 1", "P1");
        var to = prompt("Please enter the place ID 2", "T1");
//get the objects of the inputs
        if(from!=null && to!=null){
            node1 = getKey(from);
            node2 = getKey(to);
        }
        AddArc(node1,node2);

}



//function that calculate the distance, dx, dy and the position of starting point and end point
function drawArrow(x1, y1, x2, y2, rad, repeated)
{
//if the arc is repeated, increae both y to lower the the arc
        if (repeated == true) {
        y1 += 10;
        y2 += 10;
    }
//distance
    var distance = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
    var distanceWithoutRad = distance - rad;
    var dx = ((x2 - x1) * distanceWithoutRad) / distance;
    var dy = ((y2 - y1) * distanceWithoutRad) / distance;
    var startX = x2 - dx;
    var EndX = y2 - dy;
    var startY = x1 + dx;
    var EndY = y1 + dy;
//M means moveto, and L means lineto
    var path = paper.path("M" + startX + "," + EndX + " L" + startY + "," + EndY);
    return path;
}

//function handles the recreation of the arrows when a drag movement occours
function redrawArrow(node, x, y)
{
    Arcs.forEach(function (arc, index)
    {
        var keys = null;
        var count = null;
        if (arc.from.key == node.key)
        {
//re-calculate the mid points
            var midX = midpointX(arc.to.x, x);
            var midY= midpointY(arc.to.y , y);
            keys = arc.arrow.keys;
            count = arc.arrow.weight_count;
//remove the existing objects related
            if(arc.arrow.weight_count > 1)
                   arc.arrow.weight_text.remove();

            arc.arrow.remove();
//create a new one
            arc.arrow = drawArrow(x, y, arc.to.x, arc.to.y, PlaceRad, arc.repeated).attr(arrow_head);
            arc.arrow.weight_count = count;
//if weight is > 1,create the text to show the arc weight
            if(arc.arrow.weight_count > 1)
                arc.arrow.weight_text = createText(count, midX, midY + 20);
            arc.arrow.keys = keys;
            arc.arrow.click(objectClick);
        }
        else if (arc.to.key == node.key)
        {
            var midX = midpointX(arc.from.x, x);
            var midY= midpointY(arc.from.y , y);
            keys = arc.arrow.keys;
            count = arc.arrow.weight_count;
            if(arc.arrow.weight_count > 1)
                arc.arrow.weight_text.remove();

            arc.arrow.remove();
            arc.arrow = drawArrow(arc.from.x, arc.from.y, x, y, PlaceRad, arc.repeated).attr(arrow_head);
            arc.arrow.weight_count = count;
            if(arc.arrow.weight_count > 1)
            arc.arrow.weight_text = createText(count, midX, midY + 20);

            arc.arrow.keys = keys;
            arc.arrow.click(objectClick);
        }

    });
}




//function to set the timer on html
function setTime(){
        var time = document.getElementById("time_label");
        if (time != null){
        time.innerHTML = "Time:" + Timer;
         }
}

