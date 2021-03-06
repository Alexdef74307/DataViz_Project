//*******************************************//      

/*
	Script controlling the visualizations 
	Use d3.js V3
*/

// --------------------------------------------------------------------------------------------	
	
/* Initializing variables */	
var player={};
var result={};

/* Both arrays are used in the first visualization, first for the actual route of the player, second for the predicted route had he not lost*/
var result_real ={};
var result_prev = {};
var axis_x=["1st Rnd","2nd Rnd","3rd Rnd","4th Rnd","Quarter","Semi","Finals"];

/* Array containing the years and the tournament */
var tab_tournament =["Australian Open", "French Open", "Wimbledon", "US Open"]; 
var tab_year=[];
    for(i=2000;i<2017;i++){
	tab_year.push(i);
	}

/* Variables containing the year and the tournament */
/* Index of the year in the array */   
var yearNumber = 0; 
/* Real year using the previous index */
var year = tab_year[yearNumber];

/* Index of the tournament in the array */
var tournamentNumber = 0;
/* Real tournament, using the previous index*/
var tournament=tab_tournament[tournamentNumber];


/* Initiatializing minimum and maximum rank in the tournament */
var rankMin = 10000;
var rankMax = 0;

/* Variables used in selectors to control range of choice in rank*/
var maximumRanking = 8;
var minimumRanking = 1;

/* Variable containing the final form of our data, made exploitable, made global to allow easy update */
var donnees2;

/* Contains the final achievement of the player sharing the same index in array */
var tab_performance=[];

/* Contains the actual number of players selected using the range of ranks */ 
var num_player=8;

// --------------------------------------------------------------------------------------------	
/* Exploiting data */

/* All data files are present in the folder data in the csv format */ 
d3.csv("data/resultat_atp.csv", function(data) {
	 
	 /* 
		Function using the data present in the file to extract usable data for the application according
		to the selected elements (year, tournament, number of players)
	*/
	 var getData = function() {
		 
		 var player={};
		 var result={};
		 
		 // Choosing the right year and the Grand Slam in the data    
		 for (var i=0;i<data.length;i++){
		  if(data[i].Date.split("/")[2]==year){
			if(data[i].Tournament==tournament){
				var line_tour_debut=i;
				break;
			}
		  }
		}
		line_tour=line_tour_debut;	
		for (var i=0;i<data.length;i++){
		  if(data[i].Date.split("/")[2]==year){
			  
			if(data[i].Tournament==tournament){
				var line_tour_fin=i;
			}
		  }
		} 
	    
		
		// Extract the name of the player and his ranking
		var r=0;
		for (var i=line_tour;i<line_tour+127;i++){
			/* Registering winner name and rank */
			if (isNaN(player[data[i].Winner]) && data[i].WRank !== "N/A"){
				player[data[i].Winner]=data[i].WRank;
			}
			/* Case when winner rank is low and thus is registered as N/A */
			if (isNaN(player[data[i].Winner]) && data[i].WRank == "N/A"){
				/* Rank is registered as N/A if rank is too low (more than 1000)
				We chose to register player starting from 700 in such cases */
				player[data[i].Winner]=700+r;
				data[i].WRank = 700+r;
				/* Necessary because player could end up getting the same rank */
				r=r+1;
			}
			/* Registering loser name and rank */
			if (isNaN(player[data[i].Loser]) && data[i].LRank !== "N/A"){
				player[data[i].Loser]=data[i].LRank;
			}
			/* Case when loser is too low and thus is registered as N/A*/ 
			if (isNaN(player[data[i].Loser]) && data[i].LRank == "N/A"){
				player[data[i].Loser]=700+r;
				data[i].LRank = 700+r;
				r=r+1;
			}
		}
		
		for (var a=0;a<Object.keys(player).length;a++){
            
			
			var j=0;
			var k=0;
			var m=0;

			var rank=player[Object.keys(player)[a]];
			result[rank+ " "+Object.keys(player)[a]] = [];
			for (var i=line_tour;i<line_tour+127;i++){
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
						for (var l=k+1;l<line_tour+127;l++){
							if (data[l].Winner == player_inter){
								result[rank+ " "+Object.keys(player)[a]].push
										({"Round": axis_x[j], "difference": data[l].WRank-rank, "status":"L","opponent":data[l].Winner});
								j=j+1;
								k=l;
								break;
							} 
							else if (data[l].Loser == player_inter){
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
				else if (j<axis_x.length){
					if (data[line_tour+127-1].Loser == Object.keys(player)[a]){
						result[rank+ " "+Object.keys(player)[a]].push
								({"Round": axis_x[j], "difference": data[line_tour+127-1].WRank-rank, "status":"L","opponent":data[line_tour+127-1].Winner});
						j=j+1;
					}  
				}
			}
			else{
				for (var l=line_tour;l<line_tour+127;l++){
					if (data[l].Loser == player_inter){
						result[rank+ " "+Object.keys(player)[a]].push
								({"Round": axis_x[j], "difference": data[l].WRank-rank, "status":"L","opponent":data[l].Winner});
						j=j+1;
						k=l;
						player_inter=data[l].Winner;
						break;  
					}
				}
				while (j<axis_x.length){
					for (var l=k+1;l<line_tour+127;l++){
						if (data[l].Winner == player_inter){
							result[rank+ " "+Object.keys(player)[a]].push
									({"Round": axis_x[j], "difference": data[l].WRank-rank, "status":"L","opponent":data[l].Winner});
							j=j+1;
							k=l;
							break;
						} 
						else if (data[l].Loser == player_inter){
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
		}
        

		var p=56; donnees2=[];
		for(var d=0;d<128;d++) {
			var tab_reel=[];
			var tab_prev=[]; 
			var u=0;   
			for (var b=0;b<7;b++){ 
				if(result[Object.keys(result)[d]][b].status == "V"){
					tab_reel.push({"x":result[Object.keys(result)[d]][b].Round,"y":result[Object.keys(result)[d]][b].difference,"z":result[Object.keys(result)[d]][b].status})
				}
				if(u>0 && result[Object.keys(result)[d]][b].status == "L"){
					tab_prev.push({"x":result[Object.keys(result)[d]][b].Round,"y":result[Object.keys(result)[d]][b].difference,"z":result[Object.keys(result)[d]][b].status});
				}
				if(u==0 && result[Object.keys(result)[d]][b].status == "L"){
					tab_reel.push({"x":result[Object.keys(result)[d]][b].Round,"y":result[Object.keys(result)[d]][b].difference});
					tab_prev.push({"x":result[Object.keys(result)[d]][b].Round,"y":result[Object.keys(result)[d]][b].difference});
					u=u+1;
				}  
			}
			
			//Computation of the performance of the player
            if(tab_reel.length<axis_x.length){
				var perf=axis_x[tab_reel.length-1];  
			}else if(tab_reel.length=axis_x.length){
				if(tab_reel[axis_x.length-1].z== "V"){
					var perf="Winner";
				} else{
					var perf=axis_x[tab_reel.length-1];
				}  
			}
			donnees2.push({"player" : Object.keys(result)[d].split(" ")[1]+" "+Object.keys(result)[d].split(" ")[2] , "rank" : Object.keys(result)[d].split(" ")[0] , "reel":tab_reel , "prev":tab_prev,"perf":perf})
		} 

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
		 /*
			Finding out the winner and finalist
			Need special attention since they don't need a predicted route 
			and have different achievements despite reaching the same round
		 */
		var winner;
		var finalist;
		var wrank;
		var frank;
		for (var d=0;d<128;d++){
			if(donnees2[d].perf=="Winner"){
				winner=donnees2[d].player;
				wrank=donnees2[d].rank;
				break;
			}
		}
		for (var d=0;d<128;d++){
			if(donnees2[d].perf=="Finals"){
				finalist=donnees2[d].player;
				frank=donnees2[d].rank;
			break;
			}
		}
		
		/*
			Initializing variables to empty counterparts since update are made possible
		*/
		tab_performance=[];
		var round=[0,0,0,0,0,0,0];
		//var axis_x=["1st Rnd","2nd Rnd","3rd Rnd","4th Rnd","Quarter","Semi","Finals"]

		var d = 0;
		num_player = 0;
		while (parseInt(donnees2[d].rank) < minimumRanking) {
			d++;
		}

		/*
			Constituting the array containing the number of players at each round,
			useful for the second visualization
		*/
		while (parseInt(donnees2[d].rank) < maximumRanking) {
		 if (donnees2[d].perf=="1st Rnd"){
		   round[0]=round[0]+1;
		 }else if(donnees2[d].perf=="2nd Rnd"){
		   round[1]=round[1]+1;
		   round[0]++;
		 }else if(donnees2[d].perf=="3rd Rnd"){
		   round[2]=round[2]+1;
		   round[1]++;
		   round[0]++;
		 }else if(donnees2[d].perf=="4th Rnd"){
		   round[3]=round[3]+1;
		   round[2]++;
		   round[1]++;
		   round[0]++;
		 }else if(donnees2[d].perf=="Quarter"){
		   round[4]=round[4]+1;
		   round[3]++;
		   round[2]++;
		   round[1]++;
		   round[0]++;
		 }else if(donnees2[d].perf=="Semi"){
		   round[5]=round[5]+1;
		   round[4]++;
		   round[3]++;
		   round[2]++;
		   round[1]++;
		   round[0]++;
		 }else{
		   round[6]=round[6]+1;
		   round[5]++;
		   round[4]++;
		   round[3]++;
		   round[2]++;
		   round[1]++;
		   round[0]++;
		 }
		 d++;
		 num_player++;
		 
		}
		console.log("been there " + num_player);

		/* 
			Filling the tab_performance variable with data
		*/
		if (maximumRanking-minimumRanking>-1){
			for (var i=0;i<7;i++){
				tab_performance.push({"round":axis_x[i],"percentage":100*(round[i]/(Math.pow(2, 7-i))),"number":round[i]});
			}
			
		}
		
		/* 
			Updating the graph titles
		*/
		d3.select(".graph_title").text(tournament+" "+year);
		d3.select(".graph_winner").text(winner + " at rank "+ wrank + " beat "+ finalist+ " at rank " + frank);

	};
	
	/* 
		Used in the first launch of the application, to show a default visualization
	*/
	getData();
	/* 
		Get minimum and maximum rank to use in color domain
	*/
	getExtremeRanks(donnees2);
	
	// --------------------------------------------------------------------------------
	
	/*
		Creating update methodes on selectors and filling necessary attributes
	*/
	// Selector on year
	d3.select("#year_selector")
	.attr("min", 0)
	.attr("max", tab_year.length - 1)
	.attr("value", 0)
	.on("input", function() {
		/*
			The update function is used to update all necessary variables and call
			necessary functions when values in selectors are changed
			The function is the same for each selector
		*/ 
		update(this.value, tournamentNumber, maximumRanking); 
	});
	
	// Selector on tournament
	d3.select("#tournament_selector")
	.on("input", function() {
		update(yearNumber, this.value, maximumRanking);
	});
	
	// Updating text for maximum selector
	d3.select(".players p")
	.text("Select maximum ranking of players displayed");
	
	// Selector on minimum ranking
	d3.select("#min_ranking")
	.attr("min", 1)
	.attr("max", donnees2[maximumRanking].rank)
	.attr("step", 1)
	.attr("value", 1)
	.on("input", function() {
		minimumRanking = this.value;
		update(yearNumber, tournamentNumber, maximumRanking);
	});
	
	// Selector on maximum ranking
	d3.select("#number_players")
	.attr("min", 1)
	.attr("step", 1)
	.attr("max", 1000)
	.attr("value", 8)
	.on("input", function() {
		update(yearNumber, tournamentNumber, this.value);
		d3.select("#min_ranking")
			.attr("max", this.value);
	});
	
	// --------------------------------------------------------------------------------

	// Graphics
	//Margin Convention
	 var margin = {top: 20, right: 20, bottom: 30, left: 50},
		width = 960/1.3 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;
		
	
	/* Defining the color range */		
	var color = d3.scale.quantize()
      .range(["rgb(74,20,134)",
	  "rgb(106,81,163)",
	  "rgb(128,125,186)",
	  "rgb(158,154,200)",
	  "rgb(188,189,220)",
	  "rgb(218,218,235)",
	  "rgb(239,237,245)"]);
			
	/* Defining the initial color domain, at the start of the application*/
	color.domain([minimumRanking , rankMax]);

	//Range of xaxis
	var x = d3.scale.ordinal().rangePoints([0, width]);
	//x.domain(axis_x)
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

	var line = d3.svg.line()
		.x(function(d) { return x(d.x); })
		.y(function(d) { return y(d.y); });	

	// defines the function to call when zooming
	var zoom = d3.behavior.zoom()
		.y(y)
		.on("zoom", zoomed);

	//create the SVG container	
	var svg = d3.select(".content").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.call(zoom);

		

	svg.append("rect")
		.attr("width", width)
		.attr("height", height)
		.attr("class", "plot");

	// two functions uses for the zoom
	var make_x_axis = function () {
		return d3.svg.axis()
			.scale(x)
			.orient("bottom")
			.ticks(10);
	};

	var make_y_axis = function () {
	return d3.svg.axis()
		.scale(y)
		.orient("left")
		.ticks(10);
	}; 

	// Adding elements not related to data on the svg
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

	svg.append("g")
		.attr("class", "x grid")
		.attr("transform", "translate(0," + height + ")")
		.call(make_x_axis()
		.tickSize(-height, 0, 0)
		.tickFormat(""));

	svg.append("g")
		.attr("class", "y grid")
		.call(make_y_axis()
		.tickSize(-width, 0, 0)
		.tickFormat(""));

	// objects for the zooming
	var clip = svg.append("clipPath")
		.attr("id", "clip")
		.append("rect")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", width)
		.attr("height", height);

	var chartBody = svg.append("g")
		.attr("clip-path", "url(#clip)");    

	var div = d3.select("body")
	.append("div")  // declare the tooltip div 
	.attr("class", "tooltip")              // apply the 'tooltip' class
	.style("opacity", 0); 	
	
	
	/*
		Function used to add the data related elements to the SVG
		Also called each time an update on the selectors is done
	*/	
	var plotGraph = function() {

		/* d represents the index in the array containing the players*/
		var d = 0;
		/* While we haven't reached the minimum ranking, we don't plot the element */
		while (parseInt(donnees2[d].rank) < minimumRanking) {
			console.log("d :" + d);
			console.log("rank :" + donnees2[d].rank);
			d++;
		}
		/* While the rank of the player is inferior to the maximum ranking we can plot it */
		while (parseInt(donnees2[d].rank) <= maximumRanking) {
			/* 
				Adding unsimulated line on visualization 1
			*/
			chartBody.append("path")
				.datum(donnees2[d].reel)
				.attr("class", "line1 " + donnees2[d].rank)
				.attr("d", line)
				.attr("player", d)
				.style("stroke", function() {
					if (donnees2[d].rank) {
					  return color(donnees2[d].rank);
					}
					else {
					  return "#ccc";
					}
				})
				// Defining interactions
				.on("mouseover", function () {
					m=d3.event;
					div
						.style("opacity", 1)
						.html("Rank " + donnees2[this.getAttribute("player")].rank+" - "+donnees2[this.getAttribute("player")].player)
						.style("left", (m.pageX) + "px")
						.style("top", (m.pageY - 28) + "px")
						.style("height", "auto")
						.style("width", "auto")
						.style("padding", "10px");
						d3.select(this).style("stroke", "red");d3.select(this).style("stroke-width",3);
						
				})
				.on("mouseout", function() {		
								div.transition()		
								.duration(500)		
								.style("opacity", 0);
								d3.select(this).style("stroke", function() {
									if (donnees2[d].rank) {
									  return color(donnees2[this.getAttribute("player")].rank);
									}
									else {
									  return "#ccc";
									}
								})
								.style("stroke-width",2); 
								div.style("opacity", 0);
				});

			/* 
				Adding simulated line on visualization 1
			*/
			chartBody.append("path")
				.datum(donnees2[d].prev)
				.attr("class", "line2 " + donnees2[d].rank)
				.attr("d", line)
				.attr("player", d)
				.style("stroke", function() {
					if (donnees2[d].rank) {
					  return color(donnees2[d].rank);
					}
					else {
					  return "#ccc";
					}
				})
				.on("mouseover", function () {
					m=d3.event;
					div
						.style("opacity", 1)
						.html("Rank " + donnees2[this.getAttribute("player")].rank+" - "+donnees2[this.getAttribute("player")].player)
						.style("left", (m.pageX) + "px")
						.style("top", (m.pageY - 28) + "px")
						.style("height", "auto")
						.style("width", "auto")
						.style("padding", "10px");
						d3.select(this).style("stroke", "red");d3.select(this).style("stroke-width",3);
						
				})
				.on("mouseout", function() {		
								div.transition()		
								.duration(500)		
								.style("opacity", 0);
								d3.select(this).style("stroke", function() {
									if (donnees2[d].rank) {
									  return color(donnees2[this.getAttribute("player")].rank);
									}
									else {
									  return "#ccc";
									}
								})
								.style("stroke-width",2); 
								div.style("opacity", 0);
				});
				
			d++;
		}
		
		/* 
			Ploting elements for visualization 2
		*/
		svg2.selectAll("bar")
			.data(tab_performance)
			.enter()
			.append("rect")
			.style("fill", "steelblue")
			.attr("class", "bar_chart")
			.attr("x", function(d) { return x2(d.round); })
			.attr("width", x2.rangeBand())
			.attr("y", function(d) { return y2(d.percentage); })
			.attr("height", function(d) { console.log(d.percentage); return height - y2(d.percentage); })
			.on("mouseover", function (d) {m=d3.event;
									var num = num_player + 1;
									d3.select(this).style("fill", "red");
									  div
									  .style("opacity", 1)
									  .html(d.number+" players still qualified / "+num+ " players selected")
									  .style("left", (m.pageX) + "px")
									  .style("top", (m.pageY - 28) + "px")
									  .style("height", "auto")
									  .style("width", "auto")
									  .style("padding", "10px");})
			.on("mouseout", function (d) {
				div.style("opacity", 0);
				d3.select(this).style("fill", "steelblue");
			});
    
    
		var select=svg.selectAll(".line_sel")
			.on("mouseover", function () {d3.select(this).style("stroke", "red");d3.select(this).style("stroke-width",3);})
			.on("mouseout", function () {d3.select(this).style("stroke", "steelblue");d3.select(this).style("stroke-width",0.5);});
			
			
		/*
			Function used to display the legend of visualization 1
			The legend is updated each time the value of a selector is modified
		*/
		displayingLegend = function() {
			// Select legend elements already present in the DOM
			var legend = svg.selectAll(".legend").data(color.range())
			// Removing these elements to create the new adapted legend
			legend.remove();

			// Creating new legend elements
			legend = svg.selectAll(".legend")
			.data(color.range())
			.enter().append("g")
			.attr("class", "legend")
			.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

			// Adding rectangles filled with corresponding color
			legend.append("rect")
					.attr("x", width - 36)
					.attr("width", 36)
					.attr("height", 18)
					.style("fill", function(d) { return d;});

			// Adding corresponding text
			legend.append("text")
				.attr("x", width - 40)
				.attr("y", 9)
				.attr("dy", ".35em")
				.style("text-anchor", "end")
				.text(function(d) { 
							return "rank ["+(color.invertExtent(d)).map(function( num ){
								return parseInt( num, 10 ) })
							+"]"
				});
		}; //  End of displayingLegend function
			    
	}; // End of plotGraph function
	
	//*************************************
    
    // Graph Plotting  
	/* 
		Creating svg container for second visualization
	*/
     var margin2 = {top: 20, right: 20, bottom: 30, left: 50},
         width2 = 960/2.5 - margin2.left - margin2.right,
         height = 500 - margin2.top - margin2.bottom;
    
     var x2 = d3.scale.ordinal().rangeRoundBands([0, width2], .05);
     var y2 = d3.scale.linear().range([height, 0]);

     var xAxis2 = d3.svg.axis()
    .scale(x2)
    .orient("bottom")
     
     var yAxis2 = d3.svg.axis()
    .scale(y2)
    .orient("left")
    .ticks(10); 
     
     var svg2 = d3.select(".content").append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height + margin2.top + margin2.bottom)
    .append("g")
    .attr("transform", 
          "translate(" + margin2.left + "," + margin2.top + ")");
     
     x2.domain(tab_performance.map(function(d) { return d.round; }));
     y2.domain([0, 100]);   
    
    svg2.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis2)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", ".8em")
      .attr("dy", ".55em")
      //.attr("transform", "rotate(-90)" )
	  .attr("transform", "rotate(-20)" )
	  .style("font-size", "12px"); 
    
    svg2.append("g")
      .attr("class", "y axis")
      .call(yAxis2)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Percentage ($)");
    
    
    
    
	/* 
		Functions used when the application is initialized to display the default graphs
	*/
	plotGraph();
	displayingLegend();
	
	
	//*****************************   
	//define functions

	// zooming functions
	function zoomed() {
		svg.select(".x.axis").call(xAxis);
		svg.select(".y.axis").call(yAxis);
		svg.select(".x.grid")
			.call(make_x_axis()
			.tickSize(-height, 0, 0)
			.tickFormat(""));
		svg.select(".y.grid")
			.call(make_y_axis()
			.tickSize(-width, 0, 0)
			.tickFormat(""));
		chartBody.selectAll(".line1")
			.attr("class", "line1")
			.attr("d", line);
		svg.selectAll(".line2")
			.attr("class", "line2")
			.attr("d", line);
	}

	function zoomed2() {
		svg.select(".x.axis").call(xAxis);
		svg.select(".y.axis").call(yAxis);
	}
	
	d3.select("button").on("click", reset);

	function reset() {
		d3.transition().duration(1000).tween("zoom", function() {
			var //ix = d3.interpolate(x.domain(), [-width / 2, width / 2]),
				iy = d3.interpolate(y.domain(), [-300, 300]);
			return function(t) {
				zoom.y(y.domain(iy(t)));
				zoomed();
			};
		});
	}
	
	


	/* 
		Function launched each time a selector is modified
	*/
	var update = function(yearSelected, tournamentSelected, numberPlayerSelected) {
		// Updating global variables
		yearNumber = yearSelected;
		year = tab_year[yearSelected];
		
		tournamentNumber = tournamentSelected;
		tournament = tab_tournament[tournamentSelected];
		
		maximumRanking = numberPlayerSelected;

		/* 
			Removing elements since data has changed
		*/
		d3.selectAll(".line1").remove();
		d3.selectAll(".line2").remove();
		d3.selectAll(".bar_chart").remove();
		
		/* 
			Initializing variables to default values
		*/
		donnees2 = [];
		getData();
		rankMin = 10000;
		rankMax = 0;
		
		/* 
			Launching necessary functions to display the data
		*/
		getExtremeRanks(donnees2);
		color.domain([minimumRanking, rankMax]);
		plotGraph();
		displayingLegend();
	}	
	
});


/* Function used to get the min and max rank present among the selected players */
var getExtremeRanks = function(data) {
		for (var i = 0; i<maximumRanking; i ++) {
			var rank = parseInt(data[i].rank);
			if (rank < rankMin) {
				rankMin = rank;
			}
			else if (rank > rankMax) {
				rankMax = rank;
				
			}
		}
	}



