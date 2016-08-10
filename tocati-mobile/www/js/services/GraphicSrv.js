angular.module('tocati.services.graphic', [])

.factory('GraphicSrv', function () {
	var graphicService = {};

	graphicService.getMyPositionMarkerIcon = function () {
		return {
			iconUrl: '/img/markers/you.png',
			iconSize: [30, 30]
		};
	};

	var poiGraphic = {
		'eventi': {
			icon: {
				iconUrl: '/img/markers/eventi.png',
				iconSize: [50, 50],
				iconAnchor: [25, 49]
			},
			icon_c: '/img/icons/c/eventi.png',
			icon_w: '/img/icons/w/eventi.png'
		},
		'giochi': {
			icon: {
				iconUrl: '/img/markers/giochi.png',
				iconSize: [50, 50],
				iconAnchor: [25, 49]
			},
			icon_c: '/img/icons/c/giochi.png',
			icon_w: '/img/icons/w/giochi.png'
		},
		'incontri': {
			icon: {
				iconUrl: '/img/markers/incontri.png',
				iconSize: [50, 50],
				iconAnchor: [25, 49]
			},
			icon_c: '/img/icons/c/incontri.png',
			icon_w: '/img/icons/w/incontri.png'
		},
		'progetti_collaterali': {
			icon: {
				iconUrl: '/img/markers/progetti_collaterali.png',
				iconSize: [50, 50],
				iconAnchor: [25, 49]
			},
			icon_c: '/img/icons/c/progetti_collaterali.png',
			icon_w: '/img/icons/w/progetti_collaterali.png'
		},
		'sapori': {
			icon: {
				iconUrl: '/img/markers/sapori.png',
				iconSize: [50, 50],
				iconAnchor: [25, 49]
			},
			icon_c: '/img/icons/c/sapori.png',
			icon_w: '/img/icons/w/sapori.png'
		},
		'suoni': {
			icon: {
				iconUrl: '/img/markers/suoni.png',
				iconSize: [50, 50],
				iconAnchor: [25, 49]
			},
			icon_c: '/img/icons/c/suoni.png',
			icon_w: '/img/icons/w/suoni.png'
		}
	};

	// FIXME dev only
	poiGraphic['cat1'] = poiGraphic['eventi'];

	graphicService.getChargingPointMarkerIcon = function () {
		return {
			iconUrl: '/img/markers/colonnina.png',
			iconSize: [50, 50],
			iconAnchor: [21, 49]
		};
	};

	graphicService.getPoiMarkerIcon = function (poiCategory) {
		if (!!poiGraphic[poiCategory]) {
			return poiGraphic[poiCategory].icon;
		}
		return null;
	};

	graphicService.getPoiIconC = function (poiCategory) {
		if (!!poiGraphic[poiCategory]) {
			return poiGraphic[poiCategory].icon_c;
		}
		return null;
	};

	return graphicService;
});
