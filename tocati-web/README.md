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

#### Result - List<ChargingPoint>
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

### Get Pois by ChargingPoint
```
  GET /api/chargingPoints/{ownerId}/{pointId}/pois
```

#### Result - List<Poi>
	[
  	{
    		"ownerId": "DEMO",
    		"objectId": "poi1",
    		"creationDate": 1469631864657,
    		"lastUpdate": 1469631864657,
    		"name": "uno1",
    		"description": "test",
    		"imageUrl": "http://...",
    		"category": "cat1",
    		"when": "dfsdfsd",
    		"opening": "dvfdgdg",
    		"points": 123,
    		"coordinates": [
      			11.185455322265625,
      			46.20264638061019
    		]
  	},...
	]
		]

### User checkin
```
  GET /api/chargingPoints/{ownerId}/{userId}/{pointId}/pois/{poiId}/checkin
```

#### Result - UserData


### User Ranking
```
  GET /api/classification/{ownerId}/{userId}
```

#### Params
  - **start**: integer, optional, starting page (default = 1)
  - **count**: integer, optional, max items per page (default = 10)

#### Result - MyRanking
```
{
  "position": 1,
  "points": 177,
  "ranking": [
    {
      "data": {
        "ownerId": "DEMO",
        "objectId": "899f1eaf-7d7a-4f62-ac9f-ac99e131da11",
        "creationDate": 1469632767395,
        "lastUpdate": 1469632909029,
        "userId": "mic",
        "name": "michele",
        "surname": "nori",
        "displayName": "micnori",
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
          },
          {
            "timestamp": 1469632909029,
            "poi": {
              "ownerId": "DEMO",
              "objectId": "poi2",
              "creationDate": 1469631864681,
              "lastUpdate": 1469631864681,
              "name": "due2",
              "description": "test",
              "imageUrl": "http://...",
              "category": "cat1",
              "when": "\"dfsdfsd\"",
              "opening": "\"dvfdgdg\"",
              "points": 54,
              "coordinates": [
                11.185989081859589,
                46.203013943262654
              ]
            }
          }
        ],
        "points": 177
      },
      "position": 1,
      "points": 177
    },
    {
      "data": {
        "ownerId": "DEMO",
        "objectId": "a3b0e1ee-a281-466c-95a5-b892c3ecb49d",
        "creationDate": 1469696315211,
        "lastUpdate": 1469697087280,
        "userId": "test1",
        "name": "test",
        "surname": "test",
        "displayName": "test1",
        "checkinList": [
          {
            "timestamp": 1469697087280,
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
        ],
        "points": 123
      },
      "position": 2,
      "points": 123
    }
  ]
}
```
		
