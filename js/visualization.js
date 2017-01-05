var player={};
    var result={};
    var axis_x=["1st Rnd","2nd Rnd","3rd Rnd","4th Rnd","Quarter","Semi","Finals"];
    
    
    
  d3.csv("data/test_atp.csv", function(data) {
      
  // Extract the name of the player and his ranking 
  	for (var i=0;i<data.length;i++){
     	if (isNaN(player[data[i].Winner]) && data[i].WRank !== "N/A"){
       	player[data[i].Winner]=data[i].WRank;
      }
      if (isNaN(player[data[i].Loser]) && data[i].LRank !== "N/A"){
       	player[data[i].Loser]=data[i].LRank;
      }
	  if (isNaN(player[data[i].Loser]) && data[i].LRank == "N/A"){
       	player[data[i].Loser]="200";
      }
      
   	}
    
   
    
	for (var a=0;a<Object.keys(player).length;a++){
	
    var j=0;
    var k=0;
    var m=0;
    result[Object.keys(player)[a]] = [];
    var rank=player[Object.keys(player)[a]];
    for (var i=0;i<data.length;i++){
      if (data[i].Winner == Object.keys(player)[a]){
       	result[Object.keys(player)[a]].push
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
           result[Object.keys(player)[a]].push
					({"Round": axis_x[j], "difference": data[l].WRank-rank, "status":"L","opponent":data[l].Winner});
        	j=j+1;
          k=l;
          break;
         	} else if (data[l].Loser == player_inter){
			//console.log("Loser" + " " +data[l].Winner)
            result[Object.keys(player)[a]].push
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
           result[Object.keys(player)[a]].push
					({"Round": axis_x[j], "difference": data[data.length-1].WRank-rank, "status":"L","opponent":data[data.length-1].Winner});
        	j=j+1;
          
         	}  
  			
      
    }
 }else{//console.log(j);
       for (var l=k;l<data.length;l++){
       if (data[l].Loser == player_inter){
			//console.log("Loser" + " " +data[l].Winner)
            result[Object.keys(player)[a]].push
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
           result[Object.keys(player)[a]].push
					({"Round": axis_x[j], "difference": data[l].WRank-rank, "status":"L","opponent" 						:data[l].Winner});
        	j=j+1;
          k=l;
          break;
         	} else if (data[l].Loser == player_inter){
			//console.log("Loser" + " " +data[l].Winner)
            result[Object.keys(player)[a]].push
					({"Round": axis_x[j], "difference": data[l].WRank-rank, "status":"L","opponent" 						:data[l].Winner});
        	j=j+1;
          k=l;
          player_inter=data[l].Winner  
          break;  
          }  
  			}    
  		}
      }
    
	} // loop for
    
   var p=56; var donnees2=[];
   for(var d=0;d<128;d++) {
		var tab_inter=[];
		for (var b=0;b<7;b++){
			tab_inter.push({"x":result[Object.keys(player)[d]][b].Round,"y":result[Object.keys(player)[d]][b].difference})
		}
		donnees2.push(tab_inter)
   }
    
    console.log(donnees2[1][0])
    
   
    
  // tracé du graph  
    
    //Margin Convention
     var margin = {top: 20, right: 20, bottom: 30, left: 50},
         width = 960 - margin.left - margin.right,
         height = 700 - margin.top - margin.bottom;
    
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
	var y = d3.scale.linear().range([height, 0]);
	
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
    
    for(var d=0;d<32;d++) {
		svg.append("path")
			.datum(donnees2[d])
			.attr("class", "line")
			.attr("d", line);
	}
	
	//svg.append("path")
    //.datum(donnees2)
    //.attr("x", function(d) { return x(d.letter); })
    //.attr("y", function(d) { return y(d.frequency); })
    //.attr("class", "line")
	
});