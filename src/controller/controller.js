//function that will look for the next key for each node.
function next_key(nodes)
{
    var newKey = 0;
    var sum = Object.keys(nodes);
    if (sum.length != 0) {
        var newKey = parseInt(sum[sum.length - 1].slice(1));
    }
    return newKey + 1;
}

//function to add places to svg(paper), create an object that contain its x, y, dx, dy and number of
//tokens and draw the tokens as well.
function AddPlace(key, x, y, tokens)
{
//create a circle with attributes
    var place = paper.circle(x, y, PlaceRad).attr(place_setting);
// event handlers for drag of the place.
    place.drag(drag_move, drag_start, drag_end);
    place.click(objectClick);
    place.key = key;
    place.x = x;
    place.y = y;
    place.dx = 0;
    place.dy = 0;
    place.info = createText(key, x, y);
    place.tokens_count = tokens;
    place.tokens = null;
    draw_tokens(place, place.x, place.y);
    Places[key] = place;
}

//function to add transition to svg(paper), create an obejct that contain its x, y, dx, dy.
function AddTransition(key, x, y)
{
//create a rectangle with attributes
    var transition = paper.rect(x - width / 2, y - height/2, width, height).attr(trans_setting);
// event handlers for drag of the transition.
    transition.drag(drag_move, drag_start, drag_end);
    transition.click(objectClick);
    transition.x = x;
    transition.y = y;
    transition.info = createText(key, x, y);
    transition.key = key;
    Trans[key] = transition;
}

//fucntion to create the arc object
function AddArc(node1, node2, weight_count) {
//create the object
    var arc= {};
//if both  nodes are not null and ensure only connect places and transitions
    if (node1 != null && node2 != null && node1.key.charAt(0) != node2.key.charAt(0))
    {
//check if there is existing arc between two node
        arc = { repeated: null};
        var checked = checkArc(node1.key, node2.key);
//checked = 1 means repeated but in different direction
        if (checked == 1) {
            arc.repeated = true;
        }else if(checked == 0){
//checked = 0 means not
            arc.repeated = false;
        }
//checked = 2 means repeated butt in the same direction, in this case, rather creating new arc, check the weight of the existing one
        if(checked != 2){
                var midX = midpointX(node1.x, node2.x);
                var midY= midpointY(node1.y , node2.y);
//create an arrow
                arc.arrow =  drawArrow(node1.x , node1.y, node2.x, node2.y, PlaceRad, arc.repeated).attr(arrow_head);
                arc.from = node1;
                arc.to = node2;

                if(!isNaN(Number(weight_count))){
                    arc.arrow.weight_count = weight_count;
                    if(Number(weight_count) > 1)
                    arc.arrow.weight_text = createText(weight_count,midX, midY + 20);;
                }else{
                    arc.arrow.weight_count = 1;
                    arc.arrow.weight_text = null;
                }

                arc.arrow.click(objectClick);
                arc.arrow.keys = [node1.key, node2.key];
                Arcs.push(arc);

        }

    }else{
//when input is not valid
        alert("Input is invalid.");
    }

}

//function that check for existing arc between two nodes
function checkArc(key1, key2) {
    var count = 0;
    Arcs.forEach(function (arc, ind) {
        if ((arc.from.key == key2 && arc.to.key == key1)) {
            count = 1;
        }else if((arc.from.key == key1 && arc.to.key == key2)){
           alert("Arc is repeated");
            count = 2;
           }
    });
    return count;
}

//function that handles a drag start movement
function drag_start(x, y, e)
{

        this.current_transform = this.transform();
}

//function that handles the movement of a drag event
function drag_move(dx, dy, x, y, e)
{
//measure the transformation of the object, T means translate, which therefore translate the object from the current location plus dx, dy
        this.transform(this.current_transform + "T" + dx + ',' + dy);
        this.dx = dx;
        this.dy = dy;
//reconnect the nodes with new arc
        redrawArrow(this, this.x + dx, this.y + dy);
        recreate_text(this, this.x + dx, this.y + dy, this.key);

//refresh the tokens
        if (this.tokens_count > 0) {
//draw tokens
            draw_tokens(this, this.x + dx, this.y + dy);
        }

}

//function that handles the end of a drag event, set the new x, y
function drag_end(e)
{
        this.x += parseInt(this.dx) || 0;
        this.y += parseInt(this.dy) || 0;
        this.current_transform = this.transform();
}

//click event
function objectClick(e) {
    select_object(this);
}

//fucntion that classify the type of the obejct clicked
function select_object(object)
{


     if(!IsRunning){
            switch (object.type) {

            case "circle":
                selecting = object;
//change the label on menu bar
                changeLabel(selecting.key);
//input from user
                var input = prompt("Please enter the number of tokens of this place", object.tokens_count);
                var checked = 0;
                var num = Number(input);
                if (num == null || num == "") {

                     }else{}
                if(num < Number.MAX_SAFE_INTEGER && num > Number.MIN_SAFE_INTEGER){
                    if(!(num % 1) == 0 || num < 0 ){
                              alert("Please enter a valid integer.");
                           }else{
                            checked = num;
  //draw tokens
                        object.tokens_count = checked;
                        draw_tokens(object, object.x, object.y);

                           }

                }else{
                    
                         alert("Please don't try the max or min safe integer or even not a number");
                    
                }


                break;
            case "rect":
                selecting = object;
                changeLabel(selecting.key);
                break;

            case "path":
                selecting = object;
                changeLabel(selecting.keys);
//input from user
                var input = prompt("Please enter the weight of this path.", object.weight_count);
                var num = Number(input);
                if (num == null || num == "") {

                     }else{}
                if(num < Number.MAX_SAFE_INTEGER && num > Number.MIN_SAFE_INTEGER){
                    if(!(num % 1) == 0 || num <= 0 ){
                              alert("Please enter a valid integer.");
                           }else{
                            checked = num;

                           }

                }else{
                    
                        alert("Please don't try the max or min safe integer or even not a number");
                    
                }
                    object.weight_count = checked;
//if the weight is > 1, create a text to show the weight
                    if(object.weight_count > 1){
                        var node1 = getKey(object.keys[0]);
                        var node2 = getKey(object.keys[1]);
                         var midX = midpointX(node1.x, node2.x);
                        var midY= midpointY(node1.y , node2.y);
                        object.weight_text = createText(object.weight_count,midX, midY + 20);
                    }
                    break;
            default:
            }

        }

}

//function to clear the selection
function unselect(){
        selecting = "&nbsp;";
        changeLabel(selecting);

}

//function that removes the node(places or transitions).
function remove_node(node)
{
    var key = node.key;
//remove the arcs that were connecting to
    for (var i = Arcs.length - 1; i >= 0; i--) {
        if (Arcs[i].from.key === key || Arcs[i].to.key === key) {
            if(Arcs[i].arrow.weight_text != null)
                Arcs[i].arrow.weight_text.remove();
            Arcs[i].arrow.remove();
            Arcs.splice(i, 1);
        }
    }
//clear the node and the key on html
    node.info.remove();
    node.remove();
}

//function that removes arcs
function remove_arc(key1, key2)
{
    for(var i = Arcs.length - 1; i >= 0; i--)
    {
        if((Arcs[i].from.key == key1 && Arcs[i].to.key == key2) ||
           (Arcs[i].from.key == key2 && Arcs[i].to.key == key1))
        {
            if(Arcs[i].arrow.weight_text != null){
              Arcs[i].arrow.weight_text.remove();
            }

//clear the arrow and remove the element in the array
            Arcs[i].arrow.remove();
            Arcs.splice(i, 1);
        }

    }
}


//function that use the key of Places or Transitions by the input from user and return the object
function getKey(key) {
    switch(key.charAt(0)){
        case "P":
            return Places[key];
            break;
        case "T":
            return Trans[key];
            break;
        default:

    }

}

//function that remove object in the model and on screen
function RemoveObject()
{
//if nothing wa selected
    if (selecting == null) return;
    if(!IsRunning){
        var obj = selecting;
        var key = selecting.key;

        switch (obj.type) {
            case "circle":
//if the place has tokens
                if(obj.tokens != null)
                obj.tokens.remove();
                remove_node(obj);
//remove from Places
                delete Places[key];
                break;
            case "rect":
                remove_node(obj);
//remove from Trans
                delete Trans[key];
                break;
            case "path":
                remove_arc(obj.keys[0], obj.keys[1]);
                break;
            default:
        }
//after removing the element, clear the selection
        if (selecting != null)
        {
            unselect();
        }


    }

}

//fucntion that get the mid point of two X
function midpointX(x, x1){

    return x+(x1 - x)*0.50;
}

//fucntion that get the mid point of two Y
function midpointY(y, y1){

    return y+(y1 - y)*0.50;
}