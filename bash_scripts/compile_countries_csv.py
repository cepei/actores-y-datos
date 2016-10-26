import csv, json

headers = []
data = []

with open("../app/network-viz/data/country_names.json") as f:
	namesDict = json.load(f)

	for key, name in namesDict.iteritems():
		with open("../app/network-viz/data/{0}.csv".format(key)) as csvfile:
			csvreader = csv.reader(csvfile)
			headers = csvreader.next()
			for row in csvreader:
				data.append(row)

with open('../app/countries/data/allcountries.csv', 'wb') as f:
	writer = csv.writer(f)
	writer.writerow(headers)
	writer.writerows(data)

