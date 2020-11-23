var color = d3.scaleLinear();
color.domain([0, 30, 60]);
color.range(["blue", "white", "red"])
let sidebar;
var parseTime = d3.timeParse("%Y-%m-%d");

let time;
let markers = L.layerGroup([])
let heatMap = L.layerGroup()
var formatTime = d3.timeFormat("%b %d %y")

var user_selection = {
    year: 2015,
    month: 1,
    time: parseTime("2015-01-04"),
    type: "conventional",
    color: true,
    avgPrice: true,
    temp: true
}

var imgScaleAvgPrice = d3.scaleLinear().range([16, 40]);
var imgScaleTotVol = d3.scaleLinear().range([16, 40]);



chart_data = new Data()
populate_chart()

async function populate_chart() {
    await this.chart_data.dataPromise
    this.initVis()
    this.updateVis()

}

function style(feature) {
    var value = feature.properties.density
    return {
        fillColor: color(value),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function highlightFeature(e) {
    //console.log("called")
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

function sortByDateAscending(a, b) { return a - b; }

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

function initVis() {

    

    //time = d3.map(chart_data.avocado_data.map(d => d.Date));
    var time_Data = chart_data.avocado_data.filter(function (row) {
        return row.region == "Albany" && row.type == "conventional";
    })


    time = time_Data.map(d => d.Date).sort(sortByDateAscending)

    //time.domain([d3.min(chart_data.avocado_data, d => d.Date), d3.max(chart_data.avocado_data, d => d.Date)]);
    //time.range([0,168])

    map = L.map('map').setView([37.8, -96], 4)
    L.easyButton('fa-home',function(btn,map){
        map.setView([37.8, -96], 4);
      },'Zoom To Home').addTo(map)
    console.log(d3.extent(chart_data.avocado_data, d => d["Total Volume"]))

    imgScaleAvgPrice.domain(d3.extent(chart_data.avocado_data, d => d.AveragePrice))

    imgScaleTotVol.domain(d3.extent(chart_data.avocado_data, d => d["Total Volume"]))

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/light-v9',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: API_KEY,
    }).addTo(map);

    var slider2 = L.control.slider(function (value) {
        user_selection.time = time[value];
        user_selection.month = time[value].getMonth() + 1;
        user_selection.year = time[value].getFullYear();
        updateVis()
    },
        {
            id: slider2,
            orientation: 'horizontal',
            collapsed: false,
            increment: true,
            min: 0,
            max: 168,
            value: 0,
            syncSlider: true,
            getValue: function (value) { return formatTime(time[value]) }
        }).addTo(map);
    

    //
    
    sidebar = L.control.sidebar('sidebar').addTo(map);


    var MyControl = L.Control.extend({
        options: {
          position: 'bottomright'
        },
    
        onAdd: function (map) {
          var container = L.DomUtil.create('div', 'legendContainer');
          container.innerHTML = "<div id='legend'> </div>"
          return container;
        }
    });

    map.addControl(new MyControl());
}

function updateOptions(checkbox) {
    if (checkbox.id == "heatmap") {
        if (checkbox.checked == true) {
            user_selection.temp = true
        }
        else {
            user_selection.temp = false
        }
    }
    else if (checkbox.id == "color") {
        if (checkbox.checked == true) {
            user_selection.color = true
            var legendDiv = document.getElementById("legend");
            legendDiv.className = ""
        }
        else {
            user_selection.color = false

            var legendDiv = document.getElementById("legend");
        
            legendDiv.className = "noColor"
        }
    }
    else if (checkbox.id == "measure") {
        if (checkbox.checked == true) {
            user_selection.avgPrice = false
        }
        else {
            user_selection.avgPrice = true
        }
    }
    else if (checkbox.id == "type") {
        if (checkbox.checked == true) {
            user_selection.type = "conventional"
        }
        else {
            user_selection.type = "organic"
        }
    }
    updateVis()
}

function updateVis() {

    if (user_selection.color) {
        if (user_selection.temp) {
            color.range(["#FF5629", "#7A0013"]).domain(d3.extent(chart_data.climate_data, d => d.temp))
        }
        else {
            color.range(["#A8DFFF", "#0014A7"]).domain(d3.extent(chart_data.climate_data, d => d.rainfall))

        }
    }
    else {
        if (user_selection.temp) {
            color.range(["#E8E8E8", "#2A2A2A"]).domain(d3.extent(chart_data.climate_data, d => d.temp))
        }
        else {
            color.range(["#E8E8E8", "#2A2A2A"]).domain(d3.extent(chart_data.climate_data, d => d.rainfall))

        }
    }

    chart_data.filtered_data(user_selection)

    for (var state in chart_data.us_states.features) {
        var stateName = chart_data.us_states.features[state].properties.name
        if (user_selection.temp) {
            chart_data.us_states.features[state].properties.density = chart_data.filtered_climate_data.filter(obj => { return obj.state == stateName })[0].temp
        }
        else {
            chart_data.us_states.features[state].properties.density = chart_data.filtered_climate_data.filter(obj => { return obj.state == stateName })[0].rainfall

        }
    }






    map.removeLayer(markers)
    markersArray = []
    // console.log(chart_data.filtered_avocado_data)
    for (var i in chart_data.filtered_avocado_data) {
        // console.log(chart_data.filtered_avocado_data[i])
        var lat = chart_data.filtered_avocado_data[i].lat
        var long = chart_data.filtered_avocado_data[i].long
        var averagePrice = chart_data.filtered_avocado_data[i].AveragePrice
        var volume = chart_data.filtered_avocado_data[i]["Total Volume"]
        var name = chart_data.filtered_avocado_data[i].name

        if (user_selection.avgPrice) {
            iconSize = imgScaleAvgPrice(averagePrice)
        }
        else {
            iconSize = imgScaleTotVol(volume)
        }

        var avoIcon = L.Icon.extend({
            options: {
                iconSize: [iconSize, iconSize],
                iconAnchor: [iconSize / 2, iconSize / 2],
                popupAnchor: [0, 0]
            }
        });

        var conventional = new avoIcon({ iconUrl: 'assets/regular.png' }),
            organic = new avoIcon({ iconUrl: 'assets/organic.png' }),
            bw_conventional = new avoIcon({ iconUrl: 'assets/regularGrey.png' }),
            bw_organic = new avoIcon({ iconUrl: 'assets/organicGrey.png' });


        var tooltipText = `<div class = "toolTip"> <b>${name}</b> <br> <b>Average Price :</b> ${d3.format("$.2f")(averagePrice)} <br> <b>Total Volume :</b> ${numberWithCommas(~~volume)} </div> `
        if (user_selection.color) {
            if (user_selection.type == "conventional") {
                markersArray.push(L.marker([lat, long], { icon: conventional }).bindTooltip(tooltipText))
            }
            else {
                markersArray.push(L.marker([lat, long], { icon: organic }).bindTooltip(tooltipText))

            }
        }
        else {
            if (user_selection.type == "conventional") {
                markersArray.push(L.marker([lat, long], { icon: bw_conventional }).bindTooltip(tooltipText))
            }
            else {
                markersArray.push(L.marker([lat, long], { icon: bw_organic }).bindTooltip(tooltipText))

            }
        }

    }
    markers = L.layerGroup(markersArray)
    map.addLayer(markers)
    renderVis()

}

function renderVis() {

    geojson = L.geoJson(chart_data.us_states, {
        style: style,
        onEachFeature: onEachFeature
    }).bindTooltip(function(layer){
        let name=layer.feature.properties.name
        let attr=layer.feature.properties.density
        if(user_selection.temp){
            return `<div class = "toolTip"> <b>State: ${name}</b> <br> <b>Temperature :</b> ${attr} <sup>o</sup>C </div> `
        }
        else{
            return `<div class = "toolTip"> <b>State: ${name}</b> <br> <b>Rainfall :</b> ${attr} mm/month </div> `
        }
        
    },{
        sticky: true
    })

    map.removeLayer(heatMap)
    heatMap = L.layerGroup([geojson])
    map.addLayer(heatMap)


}



