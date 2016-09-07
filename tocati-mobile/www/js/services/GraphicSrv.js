angular.module('tocati.services.graphic', [])

.factory('GraphicSrv', function () {
	var graphicService = {};

	graphicService.getMyPositionMarkerIcon = function () {
		return {
			iconUrl: 'img/markers/you.png',
			iconSize: [30, 30]
		};
	};

	var poiGraphic = {
		'EVENTS': {
			icon: {
				iconUrl: 'img/markers/eventi.png',
				iconSize: [50, 50],
				iconAnchor: [25, 49]
			},
			icon_c: 'img/icons/c/eventi.png',
			icon_w: 'img/icons/w/eventi.png',
			color: '#419F36'
		},
		'GAMES': {
			icon: {
				iconUrl: 'img/markers/giochi.png',
				iconSize: [50, 50],
				iconAnchor: [25, 49]
			},
			icon_c: 'img/icons/c/giochi.png',
			icon_w: 'img/icons/w/giochi.png',
			color: '#CD1521'
		},
		'SERVICES': {
			icon: {
				iconUrl: 'img/markers/servizi.png',
				iconSize: [50, 50],
				iconAnchor: [25, 49]
			},
			icon_c: 'img/icons/c/servizi.png',
			icon_w: 'img/icons/w/servizi.png',
			color: '#1B3D78'
		}
//      'AVVENIMENTI': {
//			icon: {
//				iconUrl: 'img/markers/eventi.png',
//				iconSize: [50, 50],
//				iconAnchor: [25, 49]
//			},
//			icon_c: 'img/icons/c/eventi.png',
//			icon_w: 'img/icons/w/eventi.png',
//			color: '#419F36'
//		},
//		'I GIOCHI': {
//			icon: {
//				iconUrl: 'img/markers/giochi.png',
//				iconSize: [50, 50],
//				iconAnchor: [25, 49]
//			},
//			icon_c: 'img/icons/c/giochi.png',
//			icon_w: 'img/icons/w/giochi.png',
//			color: '#CD1521'
//		},
//		'GIOCHI DA TAVOLIERE': {
//			icon: {
//				iconUrl: 'img/markers/giochi.png',
//				iconSize: [50, 50],
//				iconAnchor: [25, 49]
//			},
//			icon_c: 'img/icons/c/giochi.png',
//			icon_w: 'img/icons/w/giochi.png',
//			color: '#CD1521'
//		},
//		'GIOCHI TRADIZIONALI CINESI': {
//			icon: {
//				iconUrl: 'img/markers/giochi.png',
//				iconSize: [50, 50],
//				iconAnchor: [25, 49]
//			},
//			icon_c: 'img/icons/c/giochi.png',
//			icon_w: 'img/icons/w/giochi.png',
//			color: '#CD1521'
//		},
//		'GIOCHI TRADIZIONALI ITALIANI': {
//			icon: {
//				iconUrl: 'img/markers/giochi.png',
//				iconSize: [50, 50],
//				iconAnchor: [25, 49]
//			},
//			icon_c: 'img/icons/c/giochi.png',
//			icon_w: 'img/icons/w/giochi.png',
//			color: '#CD1521'
//		},
//		'PROGETTI COLLATERALI': {
//			icon: {
//				iconUrl: 'img/markers/incontri.png',
//				iconSize: [50, 50],
//				iconAnchor: [25, 49]
//			},
//			icon_c: 'img/icons/c/incontri.png',
//			icon_w: 'img/icons/w/incontri.png',
//			color: '#1B3D78'
//		},
//		'_progetti_collaterali': {
//			icon: {
//				iconUrl: 'img/markers/progetti_collaterali.png',
//				iconSize: [50, 50],
//				iconAnchor: [25, 49]
//			},
//			icon_c: 'img/icons/c/progetti_collaterali.png',
//			icon_w: 'img/icons/w/progetti_collaterali.png',
//			color: '#9A9B9A'
//		},
//		'_sapori': {
//			icon: {
//				iconUrl: 'img/markers/sapori.png',
//				iconSize: [50, 50],
//				iconAnchor: [25, 49]
//			},
//			icon_c: 'img/icons/c/sapori.png',
//			icon_w: 'img/icons/w/sapori.png',
//			color: '#EF7B2F'
//		},
//		'_suoni': {
//			icon: {
//				iconUrl: 'img/markers/suoni.png',
//				iconSize: [50, 50],
//				iconAnchor: [25, 49]
//			},
//			icon_c: 'img/icons/c/suoni.png',
//			icon_w: 'img/icons/w/suoni.png',
//			color: '#FCD019'
//		}
	};

	// FIXME dev only
	poiGraphic['cat1'] = poiGraphic['suoni'];

	graphicService.getChargingPointMarkerIcon = function (active) {
		if (!!active) {
			return {
				iconUrl: 'img/markers/colonnina_active.png',
				iconSize: [50, 50],
				iconAnchor: [21, 49]
			};
		}

		return {
			iconUrl: 'img/markers/colonnina.png',
			iconSize: [50, 50],
			iconAnchor: [21, 49]
		};
	};

	graphicService.getPoiGraphic = function (poiCategory) {
		if (!!poiGraphic[poiCategory]) {
			return poiGraphic[poiCategory];
		}
		return null;
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

	graphicService.getPoiIconW = function (poiCategory) {
		if (!!poiGraphic[poiCategory]) {
			return poiGraphic[poiCategory].icon_w;
		}
		return null;
	};

	graphicService.getPoiColor = function (poiCategory) {
		if (!!poiGraphic[poiCategory]) {
			return poiGraphic[poiCategory].color;
		}
		return null;
	};

	return graphicService;
});
