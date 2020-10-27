class Data{
    constructor(){
       this.avocado_data=this.get_avocado()
       this.climate_data=this.get_climate()
       this.us_states=this.get_us_states()

       this.filtered_avocado_data=[]
       this.filtered_climate_data=[]


    }

    get_avocado(){
        d3.csv("datasets/avocado_final.csv", function(data){
            var parseTime = d3.time.format("%Y-%m-%d");
    
            data.forEach(element => {
                element.AveragePrice = parseFloat(element.AveragePrice)
                element.year = parseInt(element.year);
                element.month = parseInt(element.month);
                element.Date = parseTime.parse(element.Date)
                element.lat = parseFloat(element.lat)
                element.long = parseFloat(element.long)
            });
            return data;
            

        })
    }

    get_climate(){
        d3.csv("datasets/state_temp.csv", function(data){
            data.forEach(element => {
                element.year = parseInt(element.year);
                element.month = parseInt(element.month);
                element.temp = parseFloat(element.temp);
            });
            return data;
            
        })
    }

    get_us_states(){
        d3.json("datasets/us_states.json", function(data) {
            return data;
        })
    }

    filtered_data(user_selection){
        console.log(this.avocado_data)
        console.log(this.climate_data)
        this.filtered_avocado_data = this.avocado_data.filter(function (row) {
            return row.year === user_selection.year && row.month == user_selection.month && row.Date.getTime() == user_selection.time.getTime() && row.type == user_selection.type;
        })


        this.filtered_climate_data = this.climate_data.filter(function (row) {
            return row.year === user_selection.year && row.month == user_selection.month ;
        })
    }
}
