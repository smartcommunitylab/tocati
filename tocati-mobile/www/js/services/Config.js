angular.module('tocati.services.config', [])

.factory('Config', function () {
	var configService = {};

	configService.SERVER_URL = CONF.SERVER_URL;
	configService.OWNER_ID = CONF.OWNER_ID;

	configService.HTTP_CONFIG = {
		timeout: 5000,
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			'X-ACCESS-TOKEN': CONF['X-ACCESS-TOKEN']
		}
	};

	var verona = {
		lat: 45.438665,
		lng: 10.992737
	};

	var povo = {
		lat: 46.067703,
		lng: 11.151393
	};

	configService.MAP_DEFAULT_ZOOM = 15;

	configService.MAP_DEFAULT_CENTER = {
		lat: verona.lat,
		lng: verona.lng,
		zoom: configService.MAP_DEFAULT_ZOOM
	};

	return configService;
});
