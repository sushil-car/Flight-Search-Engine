var app = angular.module('flightEngine',['ui.router', 'rzModule', 'ui.bootstrap']);

app.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
	.state('flight', {
		url: "/fligh/search",
		templateUrl: "template/flight.html",
		controller: "flightCtrl"
	});

	$urlRouterProvider.otherwise("/fligh/search");
});