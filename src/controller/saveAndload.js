var fileName = "PetriNet.txt";
var saveContent;
var net = null;
var textFile = /text.*/;

//fucntion that handles body reszie
        function resize(){
//save the net to local storage
            net = { places:[], trans:[], arcs:[] };
            if (typeof(Storage) !== "undefined") {
                savePlaces();
                saveTrans();
                saveArcs();
                saveContent = JSON.stringify(net);
                localStorage.setItem("saved_net", saveContent);
//remove paper and recreate one with new center_row(new size)
                paper.remove();
                var center_row = document.getElementById("center_row");
                paper = new Raphael("center_row");
//load the net from local storage
                var new_net = localStorage.getItem("saved_net");
                construntNet(JSON.parse(new_net));
                
            }else{
                alert("Sorry, your browser does not support Web Storage");
            }

  
        }

//function that handles saving of a net
        function Save(){
            net = { places:[], trans:[], arcs:[] };
            savePlaces();
            saveTrans();
            saveArcs();
            saveContent = JSON.stringify(net);
            var blob = new Blob([saveContent], {type: "text/plain;charset=utf-8"});
            saveAs(blob, fileName);
            

        }

//convert all places object into array and push to the net.
        function savePlaces(){

                Object.keys(Places).forEach(function (key) {
                    var pn =[];
                    pn.push(Places[key].key);
                    pn.push(Places[key].x);
                    pn.push(Places[key].y);
                    pn.push(Places[key].tokens_count);
                    net.places.push(pn);
            });

        }

//convert all transition object into array and push to the net.
        function saveTrans(){

                Object.keys(Trans).forEach(function (key) {
                    var pn =[];
                    pn.push(Trans[key].key);
                    pn.push(Trans[key].x);
                    pn.push(Trans[key].y);
                    net.trans.push(pn);
            });

        }

//convert all arcs object into array and push to the net.
        function saveArcs(){
                Arcs.forEach(function(result){
                    var pn =[];
                    pn.push(result.from.key);
                    pn.push(result.to.key);
                    pn.push(result.arrow.weight_count);
                    net.arcs.push(pn);
                });

        }

//function that read the file loaded by user when the load button is clicked.
      function showFile() {
         var file = document.querySelector('input[type=file]').files[0];
         var reader = new FileReader()        
         if(file != null){
            if (file.type.match(textFile)) {
                reader.onload = function (event) {
                var load = JSON.parse(event.target.result);
                    construntNet(load);
            }
         } else {
            alert("It doesn't seem to be a text file.")
         }
             reader.readAsText(file);
              
         }

          
      }

//function that construct the net from object
        function construntNet(input){
                Clear();
                var PlaceArray = input.places;
                var TransArray = input.trans;
                var ArcsArray = input.arcs;
                if(PlaceArray.length > 0){
                    PlaceArray.forEach(function(result){
                        AddPlace(result[0],result[1],result[2],result[3]);
                    });
                }
            
                if(TransArray.length > 0){
                    TransArray.forEach(function(result){
                        AddTransition(result[0],result[1],result[2]);
                    }); 
                }

                if(ArcsArray.length > 0){
                    ArcsArray.forEach(function(result){
                        AddArc(getKey(result[0]),getKey(result[1]),result[2]);
                    });
                }

        }

