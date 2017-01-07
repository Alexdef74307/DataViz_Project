//*******************************************//      
// Analyse des données	
var player={};
var result={};

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
var year = tab_year[0];
var tournament=tab_tournament[1];

/* Initiatializing minimum and maximum rank in the tournament */
var rankMin = 10000;
var rankMax = 0;

var numberOfPlayersDisplayed = 8;

d3.csv("data/resultat_atp.csv", function(data) {
  
	// Extract the name of the player and his ranking
	var r=0;
	for (var i=0;i<data.length;i++){
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
				if (data[data.length-1].Loser == Object.keys(player)[a]){
					result[rank+ " "+Object.keys(player)[a]].push
							({"Round": axis_x[j], "difference": data[data.length-1].WRank-rank, "status":"L","opponent":data[data.length-1].Winner});
					j=j+1;
				}  
			}
		}
		else{
			for (var l=k;l<data.length;l++){
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
				for (var l=k+1;l<data.length;l++){
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


	var donnees3=[];
	donnees3.push({"player" : a, "rank" : 126 , "result":[1,2]})

	var p=56; var donnees2=[];
	for(var d=0;d<128;d++) {
		var tab_reel=[];
		var tab_prev=[]; 
		var u=0;   
		for (var b=0;b<7;b++){ 
			if(result[Object.keys(result)[d]][b].status == "V"){
				tab_reel.push({"x":result[Object.keys(result)[d]][b].Round,"y":result[Object.keys(result)[d]][b].difference})
			}
			if(u>0 && result[Object.keys(result)[d]][b].status == "L"){
				tab_prev.push({"x":result[Object.keys(result)[d]][b].Round,"y":result[Object.keys(result)[d]][b].difference});
			}
			if(u==0 && result[Object.keys(result)[d]][b].status == "L"){
				tab_reel.push({"x":result[Object.keys(result)[d]][b].Round,"y":result[Object.keys(result)[d]][b].difference});
				tab_prev.push({"x":result[Object.keys(result)[d]][b].Round,"y":result[Object.keys(result)[d]][b].difference});
				u=u+1;
			}  
		}  

		donnees2.push({"player" : Object.keys(result)[d].split(" ")[1]+" "+Object.keys(result)[d].split(" ")[2] , "rank" : Object.keys(result)[d].split(" ")[0] , "reel":tab_reel , "prev":tab_prev})
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
	
	getExtremeRanks(donnees2);

	// Graphics
	//Margin Convention
	 var margin = {top: 20, right: 20, bottom: 30, left: 50},
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;
		
	
	/* Defining the color domain */
	/*var color = d3.scale.quantize()  
	.range(["rgb(237,248,233)", 
			"rgb(186,228,179)",
			"rgb(116,196,118)", 
			"rgb(49,163,84)", 
			"rgb(0,109,44)"]);*/
			
	var color = d3.scale.linear()
      .interpolate(d3.interpolateHcl)
      .range([d3.rgb("#756bb1"), d3.rgb("#efedf5")]);
			
	color.domain([rankMin, rankMax]);

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
	
	//var groupe= svg.append("g")
	//.attr("transform", "translate(20,20)");

	//var x = d3.scale.ordinal().rangeRoundBands([0, width]);

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

	//*********************************   
	//plot the grap   

	for(var d=0;d<numberOfPlayersDisplayed;d++) {
		//d=0;
		chartBody.append("path")
			.datum(donnees2[d].reel)
			.attr("class", "line1")
			.attr("d", line)
			.style("stroke", function() {
				if (donnees2[d].rank) {
				  return color(donnees2[d].rank);
				}
				else {
				  return "#ccc";
				}
			});

		chartBody.append("path")
			.datum(donnees2[d].prev)
			.attr("class", "line2")
			.attr("d", line)
			.style("stroke", function() {
				if (donnees2[d].rank) {
				  return color(donnees2[d].rank);
				}
				else {
				  return "#ccc";
				}
			});
	}

	//*****************************   
	//define functions

	// zooming functions
	function zoomed() {
		//console.log(d3.event.translate);     // display information in the logging console of the browser (using developping tools)
		//console.log(d3.event.scale);
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
});

var getExtremeRanks = function(data) {
	for (var i = 0; i<numberOfPlayersDisplayed; i ++) {
		var rank = parseInt(data[i].rank);
		if (rank < rankMin) {
			rankMin = rank;
		}
		else if (rank > rankMax) {
			rankMax = rank;
			
		}
	}
	
	
}
