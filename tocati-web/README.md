# tocati.web
----------
## REST API methods
----------
#### Header
  - **Content-Type** = 'application/json;charset=utf-8'
  - **X-ACCESS-TOKEN** = 'token'

### User Profile 
```
  GET /api/users/{ownerId}/{userId}
```

#### Result - UsedData
    {
	"ownerId": "DEMO",
	"objectId": "899f1eaf-7d7a-4f62-ac9f-ac99e131da11",
	"creationDate": 1469632767395,
	"lastUpdate": 1469632909029,
	"userId": "mic",
	"name": "michele",
	"surname": "nori",
	"displayName": "micnori",
	"points": 177,
	"checkinList": [
		{
			"timestamp": 1469632874438,
			"poi": {
				"ownerId": "DEMO",
				"objectId": "poi1",
				"creationDate": 1469631864657,
				"lastUpdate": 1469631864657,
				"name": "uno1",
				"description": "test",
				"imageUrl": "http://...",
				"category": "cat1",
				"when": "\"dfsdfsd\"",
				"opening": "\"dvfdgdg\"",
				"points": 123,
				"coordinates": [
					11.185455322265625,
					46.20264638061019
				]
			}
		}
	]
    }


### User login 
```
  POST /api/users/{ownerId}/{userId}/login
```
#### Body
    {
        "name": "michele",
    	"surname": "nori",
    	"displayName": "micnori"
    }
    
#### Result - UserData


### ChargingPoint Search
```
  GET /api/chargingPoints/{ownerId}
```

#### Params
  - **position**: string, optional, "lng,lat"
  - **radius**: double, optional, search radius in KM

#### Result
    [
    	{
    		"ownerId": "DEMO",
    		"objectId": "cp1",
    		"creationDate": 1469705192874,
    		"lastUpdate": 1469705192874,
    		"name": "trento",
    		"description": "test",
    		"imageUrl": "http://...",
    		"poiList": [
      			"poi1",
      			"poi2"
    		],
    		"coordinates": [
      			11.121940612792967,
      			46.061320531569244
    		]
  	},...
   ]

### Stop Search
```
  GET /api/stop/{ownerId}/{routeId}
```

#### Result
		[
    {
        "ownerId": "TEST",
        "objectId": "616a7b30-adc2-4585-896a-740d2cf0a9ea",
        "creationDate": 1454598659112,
        "lastUpdate": 1454598659112,
        "name": "Fermata 1",
        "routeId": "695b4e34-25f0-4cb0-b8fe-4855c4028d9f",
        "departureTime": "07:47",
        "start": true,
        "destination": false,
        "school": false,
        "geocoding": [
            11.116912,
            46.122709
        ],
        "distance": 0,
        "wsnId": "id1",
        "position": 1,
        "passengerList": [
            "6f2cd4dc-0eb7-4920-95f7-414cc9f5a509",
            "1bef12e5-1e1d-4afc-a350-8a8145258756",
            "e880773b-9818-44f1-b131-ff177d0e6cbe"
        ]
    }
		]

### Child Search by School
```
  GET /api/child/{ownerId}/{schoolId}
```

#### Result
		[
		{
			"ownerId": "TEST",
			"objectId": "6f2cd4dc-0eb7-4920-95f7-414cc9f5a509",
			"creationDate": 1454598658834,
			"lastUpdate": 1454598658834,
			"externalId": null,
			"name": "Gino Junior",
			"surname": "Rossi",
			"parentName": "Gino Senior",
			"phone": "12345",
			"schoolId": "70b96fe4-0f76-477c-8a09-49911aa5fee2",
			"classRoom": "3C",
			"wsnId": "id1",
			"imageUrl": "/img/photo1.png"
		}
		]

### Child Search by School and ClassRoom
```
  GET /api/child/{ownerId}/{schoolId}/classroom
```

#### Params
  - **classRoom**: string, mandatory

#### Result
		[
		{
			"ownerId": "TEST",
			"objectId": "6f2cd4dc-0eb7-4920-95f7-414cc9f5a509",
			"creationDate": 1454598658834,
			"lastUpdate": 1454598658834,
			"externalId": null,
			"name": "Gino Junior",
			"surname": "Rossi",
			"parentName": "Gino Senior",
			"phone": "12345",
			"schoolId": "70b96fe4-0f76-477c-8a09-49911aa5fee2",
			"classRoom": "3C",
			"wsnId": "id1",
			"imageUrl": "/img/photo1.png"
		}
		]
		
### Anchor Search
```
  GET /api/anchor/{ownerId}
```

#### Result
		[
		{
			"ownerId": "TEST",
			"objectId": "c33259ab-b470-4468-b21b-8cb7d3e76033",
			"creationDate": 1454598659335,
			"lastUpdate": 1454598659335,
			"name": "Fermata 1",
			"geocoding": [
				11.116912,
				46.122709
			],
			"wsnId": "id1"
		}
		]

### Volunteer Search
```
  GET /api/volunteer/{ownerId}/{schoolId}
```

#### Result
		[
		{
			"ownerId": "TEST",
			"objectId": "ded93f02-9986-473a-a202-2a5169ca9834",
			"creationDate": 1454598659514,
			"lastUpdate": 1454598659514,
			"name": "Vol 1",
			"password": "VOL1",
			"address": "via sta cippa 13",
			"phone": "12345",
			"schoolId": "70b96fe4-0f76-477c-8a09-49911aa5fee2",
			"wsnId": "id1"
		}
		]
		
### Volunteer Calendar Search by School
```
  GET /api/volunteercal/{ownerId}/{schoolId}
```
#### Params
  - **dateFrom**: string, mandatory, "yyyy-MM-dd"
  - **dateTo**: string, mandatory, "yyyy-MM-dd"

#### Result
		[
		{
    		"ownerId": "TEST",
    		"objectId": "ed1b0e6d-c8d6-4a91-9179-601525e6b292",
    		"creationDate": 1454598917230,
    		"lastUpdate": 1454598917230,
    		"date": 1456873200000,
    		"schoolId": "70b96fe4-0f76-477c-8a09-49911aa5fee2",
    		"routeId": "695b4e34-25f0-4cb0-b8fe-4855c4028d9f",
    		"driverId": "ded93f02-9986-473a-a202-2a5169ca9834",
    		"helperId": null
  		}
		]

### Volunteer Calendar Search by School and Volunteer
```
  GET /api/volunteercal/{ownerId}/{schoolId}/{volunteerId}
```
#### Params
  - **dateFrom**: string, mandatory, "yyyy-MM-dd"
  - **dateTo**: string, mandatory, "yyyy-MM-dd"

#### Result
		[
		{
    		"ownerId": "TEST",
    		"objectId": "ed1b0e6d-c8d6-4a91-9179-601525e6b292",
    		"creationDate": 1454598917230,
    		"lastUpdate": 1454598917230,
    		"date": 1456873200000,
    		"schoolId": "70b96fe4-0f76-477c-8a09-49911aa5fee2",
    		"routeId": "695b4e34-25f0-4cb0-b8fe-4855c4028d9f",
    		"driverId": "ded93f02-9986-473a-a202-2a5169ca9834",
    		"helperId": null
  		}
		]		

### Download Child image
```
  GET /api/image/download/png/{ownerId}/{childId}
```
