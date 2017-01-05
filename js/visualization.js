var player={};
    var result={};
	
	var result_real ={};
	var result_prev = {};
    var axis_x=["1st Rnd","2nd Rnd","3rd Rnd","4th Rnd","Quarter","Semi","Finals"];
    
    
    
  d3.csv("data/test_atp.csv", function(data) {
      
  // Extract the name of the player and his ranking
    var r=0;
  	for (var i=0;i<data.length;i++){
     	if (isNaN(player[data[i].Winner]) && data[i].WRank !== "N/A"){
       	player[data[i].Winner]=data[i].WRank;
      }
      if (isNaN(player[data[i].Winner]) && data[i].WRank == "N/A"){
       	player[data[i].Loser]=700+r;
        data[i].WRank = 700+r; 
        r=r+1;
      }
      if (isNaN(player[data[i].Loser]) && data[i].LRank !== "N/A"){
       	player[data[i].Loser]=data[i].LRank;
      }
	  if (isNaN(player[data[i].Loser]) && data[i].LRank == "N/A"){
       	player[data[i].Loser]=700+r;
        data[i].LRank = 700+r;
        r=r+1;
      }
      
   	}
    
    
   //console.log(player[Object.keys(player)[0]]) 
	for (var a=0;a<Object.keys(player).length;a++){
	
    var j=0;
    var k=0;
    var m=0;
    
    var rank=player[Object.keys(player)[a]];
    result[rank+ " "+Object.keys(player)[a]] = [];
    for (var i=0;i<data.length;i++){
      if (data[i].Winner == Object.keys(player)[a]){
       	result[rank+ " "+Object.keys(player)[a]].push
				({"Round": axis_x[j], "difference": data[i].LRank-rank, "status":"V", "opponent":data[i].Loser});
        j=j+1;
        k=i;
      }  
    }
    
	var player_inter=Object.keys(player)[a];
 if(j>0){
    if (j<axis_x.length-1){
    	while (j<axis_x.length){
   			for (var l=k+1;l<data.length;l++){
			
         	if (data[l].Winner == player_inter){
			//console.log("Winner" + " " +data[l].Winner)
           result[rank+ " "+Object.keys(player)[a]].push
					({"Round": axis_x[j], "difference": data[l].WRank-rank, "status":"L","opponent":data[l].Winner});
        	j=j+1;
          k=l;
          break;
         	} else if (data[l].Loser == player_inter){
			//console.log("Loser" + " " +data[l].Winner)
            result[rank+ " "+Object.keys(player)[a]].push
					({"Round": axis_x[j], "difference": data[l].WRank-rank, "status":"L","opponent":data[l].Winner});
        	j=j+1;
          k=l;
          player_inter=data[l].Winner  
          break;  
          }  
  			}    
  		}
    
    } else if (j<axis_x.length){
      //for (var l=k;l<data.length;l++){
         	if (data[data.length-1].Loser == Object.keys(player)[a]){
           result[rank+ " "+Object.keys(player)[a]].push
					({"Round": axis_x[j], "difference": data[data.length-1].WRank-rank, "status":"L","opponent":data[data.length-1].Winner});
        	j=j+1;
          
         	}  
  			
      
    }
 }else{//console.log(j);
       for (var l=k;l<data.length;l++){
       if (data[l].Loser == player_inter){
			//console.log("Loser" + " " +data[l].Winner)
            result[rank+ " "+Object.keys(player)[a]].push
					({"Round": axis_x[j], "difference": data[l].WRank-rank, "status":"L","opponent":data[l].Winner});
        	j=j+1;
          k=l;
          player_inter=data[l].Winner  
          break;  
          }
       }
       while (j<axis_x.length){
   			for (var l=k+1;l<data.length;l++){
			
         	if (data[l].Winner == player_inter){
			//console.log("Winner" + " " +data[l].Winner)
           result[rank+ " "+Object.keys(player)[a]].push
					({"Round": axis_x[j], "difference": data[l].WRank-rank, "status":"L","opponent":data[l].Winner});
        	j=j+1;
          k=l;
          break;
         	} else if (data[l].Loser == player_inter){
			//console.log("Loser" + " " +data[l].Winner)
            result[rank+ " "+Object.keys(player)[a]].push
					({"Round": axis_x[j], "difference": data[l].WRank-rank, "status":"L","opponent":data[l].Winner});
        	j=j+1;
          k=l;
          player_inter=data[l].Winner  
          break;  
          }  
  			}    
  		}
      }
    
	} // loop for
    
    //console.log(Object.keys(result)[0].split(" ")[0]);
    
    
    var donnees3=[];
    donnees3.push({"player" : a, "rank" : 126 , "result":[1,2]})
    //console.log(donnees3)
    
   var p=56; var donnees2=[];
   for(var d=0;d<128;d++) {
   var tab_inter=[]
	 for (var b=0;b<7;b++){
	 tab_inter.push({"x":result[Object.keys(result)[d]][b].Round,"y":result[Object.keys(result)[d]][b].difference,"z":result[Object.keys(result)[d]][b].status})
     }
    donnees2.push({"player" : Object.keys(result)[d].split(" ")[1]+" "+Object.keys(result)[d].split(" ")[2] , "rank" : Object.keys(result)[d].split(" ")[0] , "result":tab_inter})
   }
    
    //console.log(donnees2[4])
     var sort_by = function(field, reverse, primer){

   		var key = function (x) {return primer ? primer(x[field]) : x[field]};

   		return function (a,b) {
       var A = key(a), B = key(b);
       return ((A < B) ? -1 : (A > B) ? +1 : 0) * [-1,1][+!!reverse];                  
   		}
		}
     
    donnees2.sort(sort_by('rank', true, parseInt)); 
    function sortByRank(key1, key2){
   return key1.rank > key2.rank;
		}
    //donnees2.sort(sortByRank);
    console.log(donnees2[0].result)
    
    
    
    
   
    
  // tracé du graph  
    
    //Margin Convention
     var margin = {top: 20, right: 20, bottom: 30, left: 50},
         width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    
    //create the SVG container	
    var svg = d3.select(".content").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
  
    
    //var groupe= svg.append("g")
    //.attr("transform", "translate(20,20)");
    
    //var x = d3.scale.ordinal().rangeRoundBands([0, width]);
    var x = d3.scale.ordinal().rangePoints([0, width]);
    x.domain(axis_x)
    var xAxis = d3.svg.axis().scale(x).orient("bottom");
    
    //y scale
		var y = d3.scale.linear()
							.range([height, 0]);
    //y.domain(d3.extent(donnees2, function(d) { return d.y; }));
    y.domain([-300,300]);
    
    var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
    
    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height/2 + ")")
    .call(xAxis);
    
    svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Rank diff");
    
    //svg.selectAll("path")
      // .data([donnees2])
       //.enter()
 			 //.append("path")
       //.attr("class", "line")
       //.attr("d", line);
    //svg.selectAll("path")
    //.data(donnees2)
    //.enter()
    //.append("path")
    //.attr("class", "line")
    //.attr("d", line);
    
    var line = d3.svg.line()
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.y); });	
    
    for(var d=0;d<8;d++) {
    svg.append("path")
    .datum(donnees2[d].result)
    .attr("class", "line")
    .attr("d", line);
    }
    
    console.log(donnees2)
    
    
    
    //result=result.sort
    //console.log(result)
    //svg.append("path")
    //.datum(donnees2)
    //.attr("x", function(d) { return x(d.letter); })
    //.attr("y", function(d) { return y(d.frequency); })
    //.attr("class", "line")
    

   });
    