angular.module('flightEngine')
    .directive('typeAhead', function($timeout) {
        return {
            restrict: "E",
            scope: {
                airports: '=',
                model: '='
            },
            templateUrl: 'directive/type.ahead.directive.html',
            link: function(scope, elem, attrs) {
                scope.options = {
                    title: attrs.title
                };

                scope.selected = false;
                scope.filterData = [];

                scope.$watch('model', function() {
                    if (scope.model && !scope.selected) {
                        scope.filterData = scope.airports.filter(function(item) {
                            return item.airport.toLowerCase().indexOf(scope.model.toLowerCase()) != -1 ||
                                item.code.toLowerCase().indexOf(scope.model.toLowerCase()) != -1;
                        });
                    } else {
                        scope.filterData = [];
                    }
                });

                scope.setValue = function(query) {
                    scope.model = query.airport + ' (' + query.code + ')';
                    scope.filterData = [];
                    scope.selected = true;

                    $timeout(function() {
                        scope.selected = false;
                    }, 200);
                };
            }
        };
    });