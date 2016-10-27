angular.module('flightEngine')
    .directive('flightDisplay', function() {
        return {
            restrict: "E",
            scope: {
                flightObj: '=',
                fluidDisplay: '='
            },
            templateUrl: 'directive/flight.display.directive.html'
        };
    })