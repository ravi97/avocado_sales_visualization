class Chart{
    constructor(){
        this.chart_data = new Data()
        console.log(this.chart_data)
        this.populate_chart()
    }

    async populate_chart(){
        await this.chart_data.dataPromise
        this.initVis()
        this.updateVis()

    }

    initVis(){
        //Width and height of map
        var width = 960;
        var height = 500;

        // D3 Projection
        this.projection = d3.geoAlbersUsa().translate([width/2, height/2]).scale([1000]);         
        
        // Define path generator
        this.path = d3.geoPath(this.projection);  

		
        // Define linear scale for output
        this.color = d3.scaleLinear();


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
        var parseTime = d3.timeParse("%Y-%m-%d");
        var user_selection={
            year:2015,
            month:1,
            time:parseTime("2015-01-04"),
            type:"conventional"
        }
        console.log(this.chart_data.avocado_data)
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
            console.log(this.chart_data.us_states.features.length)
            // Find the corresponding state inside the GeoJSON
            for (var j = 0; j < this.chart_data.us_states.features.length; j++)  {
                
                var jsonState = this.chart_data.us_states.features[j].properties.name;
                console.log(jsonState)
                if (dataState == jsonState) {
        
                // Copy the data value into the JSON
                this.chart_data.us_states.features[j].properties.temp = dataValue; 
        
                // Stop looking through the JSON
                break;
                }
            }
        }

        // Bind the data to the SVG and create one path per GeoJSON feature
        var color = this.color
        var div = this.div
        this.svg.selectAll("path")
        .data(this.chart_data.us_states.features)
        .enter()
        .append("path")
        .attr("d", this.path)
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
        // console.log(this.projection)
        var projection = this.projection
        this.svg.selectAll("circle")
        .data(this.chart_data.filtered_avocado_data)
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
        .on("mouseover", function(event,d) {      
            div.transition()        
            .duration(200)      
            .style("opacity", .9);      
            div.html(function(){
                return d.name + "<br>" + d3.format("$.2f")(d.AveragePrice)
                
            })
            .style("left", (event.pageX) + "px")     
            .style("top", (event.pageY - 28) + "px");    
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

