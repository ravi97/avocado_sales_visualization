import csv
from geopy.geocoders import Bing
from geopy.extra.rate_limiter import RateLimiter
import datetime
avocado = {}
regions={}
not_cities=['TotalUS','West','California','Midsouth','Northeast','SouthCarolina','SouthCentral','Southeast','GreatLakes','NothernNewEngland']
with open('avocado.csv', newline='') as csvfile, open('avocado_loc1.csv', 'w', newline='') as write_obj:
    avocadoReader = csv.DictReader(csvfile)
    # avocadoWriter = csv.DictWriter(write_obj)

    field_names = avocadoReader.fieldnames
    field_names+=["month","lat","long","name"]

    avocadoWriter = csv.DictWriter(write_obj, field_names)    
    # print(field_names)
    avocadoWriter.writeheader()
    geolocator = Bing(api_key='Ag8Fm8pfsbqphxbXnIL3-YUf8Mk4V8Pp8jKtFLJC8im7OXAT5bZjH1PbEEwo3TeN', timeout=30)
    geocode = RateLimiter(geolocator.geocode, min_delay_seconds=2)
    for row in list(avocadoReader):
        # print (row)
        if row["region"] not in not_cities:
            if row["region"] not in regions.keys():
                location = geolocator.geocode(row["region"])
                regions.update({row["region"]:location})
            else:
                location = regions[row["region"]]
            # print (location.latitude,location.longitude ,location.raw["name"])
            row.update({"lat":location.latitude})
            row.update({"long":location.longitude})
            row.update({"name":location.raw["name"]})
            datee = datetime.datetime.strptime(row["Date"], "%Y-%m-%d")
            row.update({"month":datee.month})
            avocadoWriter.writerow(row)