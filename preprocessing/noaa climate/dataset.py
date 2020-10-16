import csv

f = open("state_precip.txt", "r")
s = []
stateDict = {}
with open('state.csv', newline='', encoding='utf-8-sig') as csvfile:
    stateReader = csv.DictReader(csvfile)
    
    for row in stateReader:
        # print(row)
        stateDict[row["noaaCode"]] = row["state"].strip(" ")

print (stateDict)
csv_file = open('state_precip_final.csv', mode='w', newline='') 

columns = ["state", "year", "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]
writer = csv.DictWriter(csv_file, fieldnames=columns)
writer.writeheader()
for line in f.readlines():
    # print (line)
    # print(line[7:11])
    if 2014 < int(line[6:10]) <2020 :
        # s.append(line)
        dic = dict()
        dic[columns[0]] = stateDict[str(int(line[0:3]))]
        dic[columns[1]] = line[6:10]
        dic[columns[2]] = line[10:17]
        dic[columns[3]] = line[17:24]
        dic[columns[4]] = line[24:31]
        dic[columns[5]] = line[31:38]
        dic[columns[6]] = line[38:45]
        dic[columns[7]] = line[45:52]
        dic[columns[8]] = line[52:59]
        dic[columns[9]] = line[59:66]
        dic[columns[10]] = line[66:73]
        dic[columns[11]] = line[73:80]
        dic[columns[12]] = line[80:87]
        dic[columns[13]] = line[87:94]

        writer.writerow(dic)

# print (s) 
