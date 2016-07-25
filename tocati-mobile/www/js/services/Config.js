angular.module('tocati.services.config', [])

.factory('Config', function () {
	var configService = {};

	var verona = {
		lat: 45.438665,
		lng: 10.992737
	};

	var povo = {
		lat: 46.067703,
		lng: 11.151393
	};

	configService.mapDefaultZoom = 15;

	configService.mapDefaultCenter = {
		lat: verona.lat,
		lng: verona.lng,
		zoom: configService.mapDefaultZoom
	};

	return configService;
});
