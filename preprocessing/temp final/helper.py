import csv
# not_cities=['TotalUS','West','California','Midsouth','Northeast','SouthCarolina','SouthCentral','Southeast','GreatLakes','NothernNewEngland']
with open('state_precip_final.csv', newline='') as csvfile, open('state_precip.csv', 'w', newline='') as write_obj:
    statetempReader = csv.DictReader(csvfile)
    # avocadoWriter = csv.DictWriter(write_obj)

    # field_names = statetempReader.fieldnames
    field_names = ["state","year","month","rainfall"]

    statetempWriter = csv.DictWriter(write_obj, field_names)    
    # print(field_names)
    statetempWriter.writeheader()
    # geolocator = Bing(api_key='Ag8Fm8pfsbqphxbXnIL3-YUf8Mk4V8Pp8jKtFLJC8im7OXAT5bZjH1PbEEwo3TeN', timeout=30)
    # geocode = RateLimiter(geolocator.geocode, min_delay_seconds=2)
    for row in list(statetempReader):
        # print (row)
        writerow = {"state" : row["state"],"year": row["year"]}
        for index,item in enumerate(list(row.values())[2:]):
            # print (index+1, item)            
            writerow.update({"month": index+1 , "rainfall": item.strip(" ")})
            # print(writerow)
            statetempWriter.writerow(writerow)
        # if row["region"] not in not_cities:
        #     if row["region"] not in regions.keys():
        #         location = geolocator.geocode(row["region"])
        #         regions.update({row["region"]:location})
        #     else:
        #         location = regions[row["region"]]
        #     # print (location.latitude,location.longitude)
        #     row.update({"lat":location.latitude})
        #     row.update({"long":location.longitude})
        #     datee = datetime.datetime.strptime(row["Date"], "%Y-%m-%d")
        #     row.update({"month":datee.month})
        #     avocadoWriter.writerow(row)