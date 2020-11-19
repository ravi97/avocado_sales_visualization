
function climateColor(d){
    var color = d3.scaleLinear();
    color.domain([0,30,60]);
    color.range(["blue","white","red"])
    return color(d)
}

chart_data = new Data()
populate_chart()

async function populate_chart(){
    await this.chart_data.dataPromise
    this.initVis()
    this.updateVis()

}

    /*
    climateColor(d){
        console.log(d)
        var color = d3.scaleLinear();
        color.domain([0,50,100]);
        color.range(["blue","white","red"])
        return color(d)
    }
    */

    function style(feature) {
        var value=feature.properties.density
        return {
            fillColor: climateColor(value),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }
    function highlightFeature(e) {
        console.log("called")
        var layer = e.target;
      
        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });
      
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
      }
      
    function resetHighlight(e) {
    geojson.resetStyle(e.target);
    }
      
    function zoomToFeature(e) { map.fitBounds(e.target.getBounds()); }
      
    function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
    }

    function initVis(){
        map = L.map('map').setView([37.8, -96], 4)

        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/light-v9',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: API_KEY,
        }).addTo(map);

    }

    function updateVis(){

        //for now I have passed default value. once we create a slider, we need to pass those values
        var parseTime = d3.timeParse("%Y-%m-%d");
        var user_selection={
            year:2015,
            month:1,
            time:parseTime("2015-01-04"),
            type:"conventional"
        }
        chart_data.filtered_data(user_selection)

        for(var state in chart_data.us_states.features){
            var stateName = chart_data.us_states.features[state].properties.name
            chart_data.us_states.features[state].properties.density=chart_data.filtered_climate_data.filter(obj=>{return obj.state==stateName})[0].temp
        }


        renderVis()

    }

    function renderVis(){
        
        geojson=L.geoJson(chart_data.us_states, {
            style: style,
            onEachFeature: onEachFeature
          }).addTo(map);

    }



