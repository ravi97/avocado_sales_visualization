class Chart{
    constructor(){
        this.chart_data = new Data()
        function populate_chart(){
            if (typeof this.chart_data.avocado_data!== "undefined"
                && typeof this.chart_data.climate_data!== "undefined"
                && typeof this.chart_data.us_states!== "undefined"){
                this.initVis()
                this.updateVis()        
            }
            else{
                setTimeout(populate_chart, 250)
            }
        }


        
        
    }

    initVis(){
        //Width and height of map
        var width = 960;
        var height = 500;

        // D3 Projection
        this.projection = d3.geo.albersUsa()
				                .translate([width/2, height/2])    
				                        .scale([1000]);         
        
        // Define path generator
        this.path = d3.geo.path()               
		  	 .projection(this.projection);  

		
        // Define linear scale for output
        this.color = d3.scale.linear();


        //Create SVG element and append map to the SVG
        this.svg = d3.select("body")
			.append("svg")
			.attr("width", width)
			.attr("height", height);
        
        // Append Div for tooltip to SVG
        this.div = d3.select("body")
		    .append("div")   
    		.attr("class", "tooltip")               
    		.style("opacity", 0);

    }

    updateVis(){

        //for now I have passed default value. once we create a slider, we need to pass those values
        var parseTime = d3.time.format("%Y-%m-%d");
        var user_selection={
            year:2015,
            month:1,
            time:parseTime.parse("2015-01-04"),
            type:"conventional"
        }
        this.chart_data.filtered_data(user_selection)
        this.renderVis()

    }

    renderVis(){
        this.color.domain([d3.min(this.chart_data.filtered_climate_data, d => d.temp), 
                            d3.mean(this.chart_data.filtered_climate_data, d => d.temp), 
                            d3.max(this.chart_data.filtered_climate_data, d => d.temp)]);
        this.color.range(["blue","white","red"])

        for (var i = 0; i < this.chart_data.filtered_climate_data.length; i++) {

            // Grab State Name
            var dataState = this.chart_data.filtered_climate_data[i].state;
        
            // Grab data value 
            var dataValue = this.chart_data.filtered_climate_data[i].temp;
        
            // Find the corresponding state inside the GeoJSON
            for (var j = 0; j < this.chart_data.us_states.length; j++)  {
                var jsonState = this.chart_data.us_states[j].properties.name;
        
                if (dataState == jsonState) {
        
                // Copy the data value into the JSON
                this.chart_data.us_states[j].properties.temp = dataValue; 
        
                // Stop looking through the JSON
                break;
                }
            }
        }

        	
        // Bind the data to the SVG and create one path per GeoJSON feature
        svg.selectAll("path")
        .data(this.chart_data.us_states)
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
            } 
            else {
                //If value is undefined…
                return "rgb(213,222,217)";
            }
        });

        svg.selectAll("circle")
        .data(this.chart_data.filtered_avocado_data)
        .enter()
        .append("circle")
        //.append("image")
        //.attr("xlink:href","assets/avocado.png")
        //.attr("class", "image")
        .attr("x", function(d) {
            return this.projection([d.long, d.lat])[0] - d.AveragePrice * 25 /2 ;
        })
        .attr("y", function(d) {
            return this.projection([d.long, d.lat])[1] - d.AveragePrice * 25 /2 ;
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
    }



}

climate_chart=new Chart()

