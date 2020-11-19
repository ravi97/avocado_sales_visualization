class Data{
    constructor(){

        const avodata = d3.csv("datasets/avocado_final.csv")
        const tempData = d3.csv("datasets/state_temp.csv")
        const stateData = d3.json("datasets/us_states.json")
        this.dataPromise = Promise.all([avodata,tempData, stateData]).then(res => {
            let [avodata,tempData, stateData] = res;
            //console.log(res)
            this.avocado_data = this.get_avocado(avodata)
            this.climate_data = this.get_climate(tempData)
            this.us_states= stateData

        })
        // console.log(this.avocado_data)

    }

    get_avocado(data){
        //console.log(data)
        var parseTime = d3.timeParse("%Y-%m-%d");
            data.forEach(element => {
                element.AveragePrice = parseFloat(element.AveragePrice)
                element.year = parseInt(element.year);
                element.month = parseInt(element.month);
                element.Date = parseTime(element.Date)
                element.lat = parseFloat(element.lat)
                element.long = parseFloat(element.long)
            });
            return data;
    }

    get_climate(data){
            data.forEach(element => {
                element.year = parseInt(element.year);
                element.month = parseInt(element.month);
                element.temp = parseFloat(element.temp);
            });
            return data;
    }

    filtered_data(user_selection){
        //console.log(this.avocado_data)
        //console.log(this.climate_data)
        this.filtered_avocado_data = this.avocado_data.filter(function (row) {
            return row.year === user_selection.year && row.month == user_selection.month && row.Date.getTime() == user_selection.time.getTime() && row.type == user_selection.type;
        })


        this.filtered_climate_data = this.climate_data.filter(function (row) {
            return row.year === user_selection.year && row.month == user_selection.month ;
        })
    }
}
