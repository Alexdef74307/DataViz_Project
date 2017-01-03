
    
    //Margin Convention
     var margin = {top: 20, right: 20, bottom: 30, left: 50},
         width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    
    //create the SVG container	
    var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 
    
    
    var player={};
    var result={};
    var axis_x=["1st Rnd","2nd Rnd","3rd Rnd","4th Rnd","Quarter","Semi","Finals"];
    
    //y scale
		var y = d3.scale.linear()
							.range([height, 0]);
    
    var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
    
  d3.csv("data/test_atp.csv", function(data) {
      //data.forEach(function(d) {
      
    
  // Extract the name of the player and his ranking 
  	for (var i=0;i<data.length;i++){
     	if (isNaN(player[data[i].Winner]) && data[i].WRank !== "N/A"){
       	player[data[i].Winner]=data[i].WRank;
      }
      if (isNaN(player[data[i].Loser]) && data[i].LRank !== "N/A"){
       	player[data[i].Loser]=data[i].LRank;
      }
	  if (isNaN(player[data[i].Loser]) && data[i].LRank == "N/A"){
       	player[data[i].Loser]="500";
      }
      
   	}
    
   
    
	for (var a=0;a<Object.keys(player).length;a++){
	//a=84;
    var j=0;
    var k=0;
    var m=0;
    result[Object.keys(player)[a]] = [];
    var rank=player[Object.keys(player)[a]];
    for (var i=0;i<data.length;i++){
      if (data[i].Winner == Object.keys(player)[a]){
       	result[Object.keys(player)[a]].push
				({"Round": axis_x[j], "difference": data[i].LRank-rank, "status":"V", "opponent" 						:data[i].Loser});
        j=j+1;
        k=i;
      }  
    }
    
    var player_inter= "";
    
   		if (j<axis_x.length-1){
   			for (var l=k;k<data.length;k++){
         	if (data[k].Loser == Object.keys(player)[a]){
           result[Object.keys(player)[a]].push
					({"Round": axis_x[j], "difference": data[k].WRank-rank, "status":"L","opponent" 						:data[k].Winner});
        	j=j+1;
          m=k;
          player_inter=data[k].Winner;
          break;  
         	}  
  			}    
  		}
    
    if (j<axis_x.length-1){
    	while (j<axis_x.length){
   			for (var l=m+1;l<data.length;l++){
         	if (data[l].Winner == player_inter){
           result[Object.keys(player)[a]].push
					({"Round": axis_x[j], "difference": data[l].WRank-rank, "status":"L","opponent" 						:data[l].Winner});
        	j=j+1;
          m=l;
          break;
         	} else if (data[l].Loser == player_inter){
            result[Object.keys(player)[a]].push
					({"Round": axis_x[j], "difference": data[l].WRank-rank, "status":"L","opponent" 						:data[l].Winner});
        	j=j+1;
          m=l;
          player_inter=data[m].Winner  
          break;  
          }  
  			}    
  		}
    
    } else if (j<axis_x.length){
      //for (var l=k;k<data.length;k++){
         	if (data[data.length-1].Loser == Object.keys(player)[a]){
           result[Object.keys(player)[a]].push
					({"Round": axis_x[j], "difference": data[data.length-1].WRank-rank, "status":"L","opponent" 						:data[data.length-1].Winner});
        	j=j+1;
          
         	}  
  			
      
    }
	
	}
    //var donnees= [{x:10,y:20},{x:20,y:60}, {x:30,y:70},
//{x:40,y:202},{x:50,y:260}, {x:60,y:70},
//{x:70,y:75},{x:80,y:70}, {x:90,y:0},
//{x:100,y:20},{x:110,y:20},{x:120,y:60}, {x:130,y:70},
//{x:140,y:32},{x:150,y:60}, {x:160,y:90},
//{x:170,y:75},{x:180,y:100}, {x:190,y:20}];
       
   // console.log(result[Object.keys(player)[84]][0].difference)
    
    var line= d3.svg.line()
    .x (function(d){return d.x})
    .y (function(d){return d.y});
    
    var groupe= svg.append("g")
    .attr("transform", "translate(20,20)");
    
    var donnees2=[];
	 for (var b=0;b<7;b++){
	 donnees2.push({"x":result[Object.keys(player)[84]][0].Round,"y":result[Object.keys(player)[84]][0].difference})
     }
    
    var x = d3.scale.ordinal().rangeRoundBands([0, width]);
    x.domain(axis_x)
    var xAxis = d3.svg.axis().scale(x).orient("bottom");

    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
    
    
    console.log(donnees2)
    
    
    
    
   });
