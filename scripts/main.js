
/*  This visualization was made possible by modifying code provided by:

Scott Murray, Choropleth example from "Interactive Data Visualization for the Web" 
https://github.com/alignedleft/d3-book/blob/master/chapter_12/05_choropleth.html   
		
Malcolm Maclean, tooltips example tutorial
http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html

Mike Bostock, Pie Chart Legend
http://bl.ocks.org/mbostock/3888852  */

		
//Width and height of map
var width = 960;
var height = 500;

// D3 Projection
var projection = d3.geo.albersUsa()
				   .translate([width/2, height/2])    // translate to center of screen
				   .scale([1000]);          // scale things down so see entire US
        
// Define path generator
var path = d3.geo.path()               // path generator that will convert GeoJSON to SVG paths
		  	 .projection(projection);  // tell path generator to use albersUsa projection

		
// Define linear scale for output
var color = d3.scale.linear();

var legendText = ["Cities Lived", "States Lived", "States Visited", "Nada"];

//Create SVG element and append map to the SVG
var svg = d3.select("body")
			.append("svg")
			.attr("width", width)
			.attr("height", height);
        
// Append Div for tooltip to SVG
var div = d3.select("body")
		    .append("div")   
    		.attr("class", "tooltip")               
    		.style("opacity", 0);

// Load in my states data!
d3.csv("datasets/state_temp.csv", function(data) {
    

    data.forEach(element => {
        element.year = parseInt(element.year);
        element.month = parseInt(element.month);
        element.temp = parseFloat(element.temp);
    });


    console.log(data);
    filteredData = data.filter(function (row) {
	return row.year === 2015 && row.month == 1 ;
    })

  console.log(filteredData)

  color.range(["blue","white","red"])
color.domain([d3.min(filteredData, d => d.temp), d3.mean(filteredData, d => d.temp), d3.max(filteredData, d => d.temp)]); // setting the range of the input data

// Load GeoJSON data and merge with states data
d3.json("datasets/us_states.json", function(json) {

// Loop through each state data value in the .csv file
for (var i = 0; i < filteredData.length; i++) {

	// Grab State Name
	var dataState = filteredData[i].state;

	// Grab data value 
	var dataValue = filteredData[i].temp;

	// Find the corresponding state inside the GeoJSON
	for (var j = 0; j < json.features.length; j++)  {
		var jsonState = json.features[j].properties.name;

		if (dataState == jsonState) {

		// Copy the data value into the JSON
		json.features[j].properties.temp = dataValue; 

		// Stop looking through the JSON
		break;
		}
	}
}
		
// Bind the data to the SVG and create one path per GeoJSON feature
svg.selectAll("path")
	.data(json.features)
	.enter()
	.append("path")
	.attr("d", path)
	.style("stroke", "#fff")
	.style("stroke-width", "1")
	.style("fill", function(d) {

	// Get data value
	var value = d.properties.temp;

	if (value) {
	//If value exists…
	return color(value);
	} else {
	//If value is undefined…
	return "rgb(213,222,217)";
	}
});

		 
// Map the cities I have lived in!
d3.csv("datasets/avocado_final.csv", function(avocado_data) {
    var parseTime = d3.time.format("%Y-%m-%d");
    
    avocado_data.forEach(element => {
        element.AveragePrice = parseFloat(element.AveragePrice)
        element.year = parseInt(element.year);
        element.month = parseInt(element.month);
        element.Date = parseTime.parse(element.Date)
        element.lat = parseFloat(element.lat)
        element.long = parseFloat(element.long)
    });

    console.log(avocado_data)
    filteredAvocadoData = avocado_data.filter(function (row) {
	return row.year === 2015 && row.month == 1 && row.Date.getTime() == parseTime.parse("2015-01-04").getTime() && row.type == "conventional";
    })

  console.log(filteredAvocadoData)


svg.selectAll("circle")
	.data(filteredAvocadoData)
	.enter()
	// .append("circle")
    .append("image")
	.attr("xlink:href","assets/avocado.png")
	.attr("class", "image")
	.attr("x", function(d) {
		return projection([d.long, d.lat])[0] - d.AveragePrice * 25 /2 ;
	})
	.attr("y", function(d) {
		return projection([d.long, d.lat])[1] - d.AveragePrice * 25 /2 ;
	})
	.attr("height", function(d) {
		return d.AveragePrice * 25 + "px";
    })
    .attr("width", function(d) {
		return d.AveragePrice * 25 + "px";
	})
		.style("fill", "rgb(217,91,67)")	
		.style("opacity", 0.85)	

	// Modification of custom tooltip code provided by Malcolm Maclean, "D3 Tips and Tricks" 
	// http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html
	.on("mouseover", function(d) {      
    	div.transition()        
      	   .duration(200)      
           .style("opacity", .9);      
           div.html(function(){
			console.log(d3.format("$.2f")(d.AveragePrice))   
			return d.name + "<br>" + d3.format("$.2f")(d.AveragePrice)
			   
           })
           .style("left", (d3.event.pageX) + "px")     
           .style("top", (d3.event.pageY - 28) + "px");    
	})   

    // fade out tooltip on mouse out               
    .on("mouseout", function(d) {       
        div.transition()        
           .duration(500)      
           .style("opacity", 0);   
    });
});  
        
// Modified Legend Code from Mike Bostock: http://bl.ocks.org/mbostock/3888852
// var legend = d3.select("body").append("svg")
//       			.attr("class", "legend")
//      			.attr("width", 140)
//     			.attr("height", 200)
//    				.selectAll("g")
//    				.data(color.domain().slice().reverse())
//    				.enter()
//    				.append("g")
//      			.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

//   	legend.append("rect")
//    		  .attr("width", 18)
//    		  .attr("height", 18)
//    		  .style("fill", color);

//   	legend.append("text")
//   		  .data(legendText)
//       	  .attr("x", 24)
//       	  .attr("y", 9)
//       	  .attr("dy", ".35em")
//       	  .text(function(d) { return d; });
	});

});