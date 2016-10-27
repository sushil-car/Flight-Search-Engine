describe('flightCtrl ', function() {
    beforeEach(module('flightEngine'));

    var $controller,
        controller,
        scope,
        $httpBackend;

    var dataResponse = [{
        "fare": "9500",
        "flightNumber": "AI-255",
        "departureDate": "Fri Nov 11 2016 13:40:52",
        "arrivalDate": "Fri Nov 11 2016 15:50:52",
        "origin": "DEL",
        "destination": "PNQ",
        "city": "Delhi",
        "img": "6"
    }, {
        "fare": "9500",
        "flightNumber": "AI-204",
        "departureDate": "Fri Nov 11 2016 13:40:52",
        "arrivalDate": "Fri Nov 11 2016 15:50:52",
        "origin": "DEL",
        "destination": "PNQ",
        "city": "Delhi",
        "img": "7"
    }, {
        "fare": "18500",
        "flightNumber": "AI-266",
        "departureDate": "Fri Nov 11 2016 18:40:52",
        "arrivalDate": "Fri Nov 11 2016 20:50:52",
        "origin": "DEL",
        "destination": "PNQ",
        "city": "Delhi",
        "img": "8"
    }];

    beforeEach(inject(function($rootScope, _$controller_, _$filter_, _$httpBackend_) {
        $controller = _$controller_;
        scope = $rootScope.$new();
        $httpBackend = _$httpBackend_;
        $filter = _$filter_;
    }));

    beforeEach(function() {
        createController = function() {
            return $controller('flightCtrl', {
                $scope: scope
            });
        };
    });

    it('should exist', function() {
        controller = createController();
        expect(controller).toBeDefined();
    });

    it('calOne should open calendar one and calTwo should open calendar two', function() {
        controller = createController();

        var e = jasmine.createSpyObj('e', ['preventDefault', 'stopPropagation']);

        scope.calOneOpen = false;
        scope.calTwoOpen = false;
        scope.calOne();
        scope.calTwo(e);

        expect(scope.calOneOpen).toBe(true);
        expect(scope.calTwoOpen).toBe(true);
        expect(e.preventDefault).toHaveBeenCalled();
    });

    describe('changeFlightMode should change flight mode and reset the variables ', function() {
        it('when passed true', function() {
            controller = createController();

            scope.flight = {};

            scope.changeFlightMode(true);

            expect(scope.oneWay).toBe(true);
            expect(scope.flight.returnDate).toEqual('');
        });

        it('when passed true', function() {
            controller = createController();

            scope.changeFlightMode(false);

            expect(scope.oneWay).toBe(false);
        });
    });

    it('searchFlight should fetch data from data.json, stores it in flightsData, and calls processData function ', function() {
        controller = createController();

        scope.flight = {
            "origin": "Delhi (DEL)",
            "destination": "Pune (PNQ)",
            "departureDate": "2016/11/11",
            "returnDate": "2016/11/11"
        };

        scope.searchFlight();

        $httpBackend.expectGET("data.json").respond(200, dataResponse);

        $httpBackend.flush();

        expect(scope.flightsData.length).toEqual(dataResponse.length);
        expect(scope.extraOrOneWayFlights.length).toEqual(3); // As all three flights flying from Delhi to Pune 
    });

    it('processData retrives available depart flights and available return flights from flightsData  ', function() {
        controller = createController();

        scope.flight = {
            "origin": "Delhi (DEL)",
            "destination": "Pune (PNQ)",
            "departureDate": "2016/11/11",
            "returnDate": "2016/11/11"
        };

        scope.oneWay = false;

        scope.searchFlight();

        $httpBackend.expectGET("data.json").respond(200, dataResponse);

        $httpBackend.flush();

        expect(scope.flightsData.length).toEqual(dataResponse.length);
        expect(scope.availableDepartFlights.length).toEqual(3); // As all three flights flying from Delhi to Pune 
        expect(scope.availableReturnFlights.length).toEqual(0); // As there is no return flight from Pune to Delhi
    });
});