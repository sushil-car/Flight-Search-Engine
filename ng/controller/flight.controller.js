angular.module('flightEngine')
    .controller('flightCtrl', function($scope,
        $rootScope,
        $http,
        $filter) {

        $scope.oneWay = true;
        $scope.formSubmitted = false;
        $scope.flight = {};
        $scope.formattedFlightData = [];
        $scope.extraOrOneWayFlights = [];
        $scope.format = 'yyyy/MM/dd';
        $scope.date = new Date();
        $scope.calOneOpen = false;
        $scope.calTwoOpen = false;
        $scope.availableDepartFlights = [];
        $scope.availableReturnFlights = [];
        var flightsDataTemp,
            userOrigin,
            userDestination,
            objDepartDate,
            objArriveDate,
            userDapartDate,
            availableDepartFlightsSorted,
            availableReturnFlightsSorted;

        $scope.airportsList = [{
            "airport": "Mumbai",
            "code": "MUM"
        }, {
            "airport": "Pune",
            "code": "PNQ"
        }, {
            "airport": "Kolkata",
            "code": "CCU"
        }, {
            "airport": "Delhi",
            "code": "DEL"
        }, {
            "airport": "Srinagar",
            "code": "SXR"
        }, {
            "airport": "Banglore",
            "code": "BLR"
        }];

        $scope.calOne = function() {
            $scope.calOneOpen = true;
        };

        $scope.calTwo = function($event) {
            $scope.calTwoOpen = !$scope.calTwoOpen;
            $event.preventDefault();
            $event.stopPropagation();
        };

        $scope.priceRange = {};

        endListener = function(sliderId) {
            if ($scope.oneWay) {
                $scope.extraOrOneWayFlights = filterArray($scope.availableDepartFlights);
            } else {
                $scope.flightsData = filterArray(flightsDataTemp);
                $scope.processData();
            }
        };

        $scope.priceRange.slider = {
            min: 100,
            max: 50000,
            options: {
                floor: 0,
                ceil: 50000,
                id: 'sliderA',
                onEnd: endListener,
                step: 100
            }
        };

        var filterArray = function(arr) {
            var returnArr = _.filter(arr, function(obj) {
                return obj.fare <= $scope.priceRange.slider.max &&
                    obj.fare >= $scope.priceRange.slider.min;
            });
            return returnArr;
        };

        $scope.changeFlightMode = function(type) {
            if (type) {
                $scope.oneWay = true;
                $scope.flight.returnDate = '';
            } else {
                $scope.oneWay = false;
            };

            $scope.priceRange.slider.min = 100;
            $scope.priceRange.slider.max = 50000;
            flightsDataTemp
            $scope.formSubmitted = false;
            resetFlightsData();
        };

        var resetFlightsData = function() {
            $scope.formattedFlightData = [];
            $scope.extraFlights = [];
            $scope.availableReturnFlights = [];
            $scope.availableDepartFlights = [];
            $scope.allFlightsSorted = [];
            $scope.extraOrOneWayFlights = [];
        };

        $scope.processData = function() {
            resetFlightsData();
            $scope.availableDepartFlights = _.filter($scope.flightsData, function(obj) {

                objDepartDate = new Date(obj.departureDate);
                objArriveDate = new Date(obj.arrivalDate);
                obj.departTime = $filter('date')(objDepartDate, 'dd MMM yyyy h:mma');
                obj.arriveTime = $filter('date')(objArriveDate, 'dd MMM yyyy h:mma');
                obj.fare = Number(obj.fare);
                obj.duration = ((objArriveDate - objDepartDate) % 86400000) / 3600000;;

                return obj.origin === userOrigin &&
                    obj.destination === userDestination &&
                    objDepartDate.getDate() === userDapartDate.getDate();
            });

            availableDepartFlightsSorted = angular.copy($scope.availableDepartFlights.sort(function(current, next) {
                return current.fare - next.fare;
            }));

            if (!$scope.oneWay) {
                var userReturnDate = new Date($scope.flight.returnDate);

                _.forEach($scope.flightsData, function(obj) {

                    objDepartDate = new Date(obj.departureDate);
                    objArriveDate = new Date(obj.arrivalDate);

                    if (obj.destination === userOrigin && obj.origin === userDestination && objDepartDate >= userReturnDate) {
                        obj.departTime = $filter('date')(objDepartDate, 'dd MMM yyyy h:mma');
                        obj.arriveTime = $filter('date')(objArriveDate, 'dd MMM yyyy h:mma');
                        obj.fare = Number(obj.fare);
                        obj.return = true;
                        obj.duration = Math.round(((objArriveDate - objDepartDate) % 86400000) / 3600000);;
                        $scope.availableReturnFlights.push(obj)
                    }
                });

                availableReturnFlightsSorted = angular.copy($scope.availableReturnFlights.sort(function(current, next) {
                    return current.fare - next.fare;
                }));

                var rLength = availableReturnFlightsSorted.length;

                var dLength = availableDepartFlightsSorted.length;

                var diff = rLength > dLength ? (rLength - dLength) : (dLength - rLength)

                if (rLength > dLength) {
                    $scope.extraOrOneWayFlights = availableReturnFlightsSorted.splice(rLength - diff, diff); //Extra flights to depart if any 
                } else if (dLength > rLength) {
                    $scope.extraOrOneWayFlights = availableDepartFlightsSorted.splice(dLength - diff, diff); //Extra flights to arrive if any
                }

                $scope.allFlightsSorted = availableReturnFlightsSorted.reduce(function(arr, v, i) {
                              return arr.concat(v, availableDepartFlightsSorted[i]); 
                           }, []);

                // mergeAlternately(availableReturnFlightsSorted, availableDepartFlightsSorted);

                for (i = 0; i < $scope.allFlightsSorted.length; i += 2) {
                    $scope.formattedFlightData.push($scope.allFlightsSorted.slice(i, i + 2)) //Flights combined acoording to low price total
                }
            } else {
                $scope.extraOrOneWayFlights = angular.copy(availableDepartFlightsSorted);
            }
        };

        $scope.searchFlight = function() {
            $scope.priceRange.slider.min = 100;
            $scope.priceRange.slider.max = 50000;
            $scope.originCity = angular.copy($scope.flight.origin);
            $scope.destinationCity = angular.copy($scope.flight.destination);
            $scope.formSubmitted = true;

            userOrigin = $scope.flight.origin.match(/\((.*)\)/)[1];
            userDestination = $scope.flight.destination.match(/\((.*)\)/)[1];
            userDapartDate = new Date($scope.flight.departureDate);

            $http.get('data.json').then(function(response) {
                $scope.flightsData = response.data;
                flightsDataTemp = angular.copy(response.data);
                $scope.processData();
            });
        };
    });