'use strict';

describe('myApp.network-viz module', function() {
    var $httpBackend, $rootScope, createController, authRequestHandler, $routeParams;
    beforeEach(module('myApp.network-viz'));


    describe('network-viz controller on existent country visualization', function() {
        beforeEach(inject(function($injector) {
            // Set up the mock http service responses
            $httpBackend = $injector.get('$httpBackend');
            // Get hold of a scope (i.e. the root scope)
            $rootScope = $injector.get('$rootScope');
            $routeParams = {
                "country": "any_country_id"
            };
            // backend definition common for all tests
            authRequestHandler = $httpBackend.when('GET', "network-viz/data/" + $routeParams.country + ".csv")
                .respond("DATOS,ODS,FUENTE\ndato1,2 ODS,fuente1\ndato1,1 ODS,fuente1\ndato2,1 ODS,fuente1\ndato1,10 ODS,fuente1\n")

            $httpBackend.when('GET', "network-viz/data/country_names.json")
                .respond({
                    "any_country_id": "Country Name"
                });

            $httpBackend.when('GET', "network-viz/data/ODSs.csv")
                .respond("ODS\n1 ODS\n2 ODS\n10 ODS\n");

            $httpBackend.when('GET', "network-viz/data/laws/" + $routeParams.country + "_laws.csv")
                .respond("NORMA,DESCRIPCIÓN,LINK\nnorma1,descripción,link");

            // The $controller service is used to create instances of controllers
            var $controller = $injector.get('$controller');
            var timerCallback = jasmine.createSpy("timerCallback");
            jasmine.clock().install();
            createController = function() {
                return $controller('NetworkVizCtrl', {
                    '$scope': $rootScope,
                    '$routeParams': $routeParams
                });
            };
        }));
        afterEach(function() {
            jasmine.clock().uninstall();
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();

        });
        describe('d3 network visualization', function() {
            it('should open right country data file', inject(function($controller) {
                //spec body 

                var networkCtrl = createController();
                $httpBackend.expectGET("network-viz/data/" + $routeParams.country + ".csv");
                $httpBackend.flush();
            }));


            it('should open right ODSs data file', inject(function($controller) {
                //spec body 

                var networkCtrl = createController();
                $httpBackend.expectGET("network-viz/data/ODSs.csv");
                $httpBackend.flush();
            }));

            it('should be nodeName empty string by default', inject(function($controller) {
                //spec body 
                var networkCtrl = createController();
                expect($rootScope.nodeName).toBe("");
                $httpBackend.flush();

            }));

            it('should put correct name in scope when clicked', inject(function($controller) {
                //spec body 
                var networkCtrl = createController();
                $httpBackend.flush();
                var datum = {
                    "name": "node name",
                    "type": "type"
                }
                $rootScope.clickNode(datum);
                jasmine.clock().tick(100);
                expect($rootScope.nodeName).toBe("node name");
            }));

            it('should put correct odsIndex in scope when clicked an ods', inject(function($controller) {
                //spec body 
                var networkCtrl = createController();
                $httpBackend.flush();
                var datum = {
                    "name": "10 ODS",
                    "type": "ods"
                }
                $rootScope.clickNode(datum);
                jasmine.clock().tick(100);
                expect($rootScope.odsIndex).toBe(10);
            }));

            it('should put empty string in nodeName when clicked outside a node after a node was selected', inject(function($controller) {
                //spec body 
                var networkCtrl = createController();
                $httpBackend.flush();
                var datum = {
                    "name": "node name",
                    "type": "type"
                }
                $rootScope.clickNode(datum);
                jasmine.clock().tick(100);
                $rootScope.clickOutsideNode();
                expect($rootScope.nodeName).toBe("");
            }));

            it('should put correct type in scope when clicked', inject(function($controller) {
                //spec body 
                var networkCtrl = createController();
                $httpBackend.flush();
                var datum = {
                    "name": "node name",
                    "type": "type"
                }
                $rootScope.clickNode(datum);
                jasmine.clock().tick(100);
                expect($rootScope.nodeType).toBe("type");
            }));

            it('should put correct name in scope when clicked, given integer as parameter and type is ods', inject(function($controller) {
                //spec body 
                var networkCtrl = createController();
                $httpBackend.flush();
                var datum = {
                    "name": 10,
                    "type": "ods"
                }
                $rootScope.clickNode(datum);
                jasmine.clock().tick(100);
                expect($rootScope.nodeName).toBe("10 ODS");
            }));


            it('should open country_names.json file', inject(function($controller) {
                //spec body 

                var networkCtrl = createController();
                $httpBackend.expectGET("network-viz/data/country_names.json");
                $httpBackend.flush();
            }));

            it('should put correct country name in scope', inject(function($controller) {
                //spec body 
                var networkCtrl = createController();
                $httpBackend.expectGET("network-viz/data/country_names.json");
                $httpBackend.flush();
                expect($rootScope.countryName).toBe("Country Name");
            }));

            it('getAssociatedRowsInDB should det associated rows to a ODS in database', inject(function($controller) {
                var networkCtrl = createController();
                $httpBackend.expectGET("network-viz/data/country_names.json");
                $httpBackend.expectGET("network-viz/data/ODSs.csv");
                $httpBackend.flush();
                var datum = {
                    "name": "1 ODS",
                    "type": "ods"
                }
                var associated = $rootScope.getAssociatedRowsInDB(datum);
                expect(associated).toEqual([{
                    "DATOS": "dato1",
                    "ODS": "1 ODS",
                    "FUENTE": "fuente1"
                }, {
                    "DATOS": "dato2",
                    "ODS": "1 ODS",
                    "FUENTE": "fuente1"
                }, ])
            }));

            it('should put relatedToNode names in scope correctly', inject(function($controller) {
                //spec body 
                var networkCtrl = createController();
                $httpBackend.expectGET("network-viz/data/country_names.json");
                $httpBackend.expectGET("network-viz/data/ODSs.csv");
                $httpBackend.flush();
                var datum = {
                    "name": "fuente1",
                    "type": "fuente"
                }
                $rootScope.clickNode(datum);
                jasmine.clock().tick(100);
                expect($rootScope.relatedToNode).toEqual([{
                    "DATOS": "dato1",
                    "ODS": "2 ODS",
                    "FUENTE": "fuente1"
                }, {
                    "DATOS": "dato1",
                    "ODS": "1 ODS",
                    "FUENTE": "fuente1"
                }, {
                    "DATOS": "dato2",
                    "ODS": "1 ODS",
                    "FUENTE": "fuente1"
                }, {
                    "DATOS": "dato1",
                    "ODS": "10 ODS",
                    "FUENTE": "fuente1"
                }, ]);
            }));


            it('should put rows in relatedToNode in scope correctly when typedata is dato', inject(function($controller) {
                //spec body 
                var networkCtrl = createController();
                $httpBackend.expectGET("network-viz/data/country_names.json");
                $httpBackend.expectGET("network-viz/data/ODSs.csv");
                $httpBackend.flush();
                var datum = {
                    "name": "dato1",
                    "type": "datos"
                }
                $rootScope.clickNode(datum);
                jasmine.clock().tick(100);
                expect($rootScope.relatedToNode).toEqual([{
                    "DATOS": "dato1",
                    "ODS": "2 ODS",
                    "FUENTE": "fuente1"
                }, {
                    "DATOS": "dato1",
                    "ODS": "1 ODS",
                    "FUENTE": "fuente1"
                }, {
                    "DATOS": "dato1",
                    "ODS": "10 ODS",
                    "FUENTE": "fuente1"
                }, ]);
            }));

            it('summarizeData should summarize data in order to avoid repeated DATOS', inject(function($controller) {
                //spec body 
                var networkCtrl = createController();
                $httpBackend.expectGET("network-viz/data/country_names.json");
                $httpBackend.expectGET("network-viz/data/ODSs.csv");
                $httpBackend.flush();
                var datum = {
                    "name": "fuente1",
                    "type": "fuente"
                }
                $rootScope.clickNode(datum);
                jasmine.clock().tick(100);
                expect($rootScope.summarizedData).toEqual([{
                    "DATOS": "dato1",
                    "ODS": ["1 ODS", "2 ODS", "10 ODS"],
                    "FUENTE": "fuente1"
                }, {
                    "DATOS": "dato2",
                    "ODS": ["1 ODS"],
                    "FUENTE": "fuente1"
                }, ]);
            }));
        });


        // describe: network-viz controller - laws modal
        describe('Laws Modal', function() {
            it('should open right laws data file', inject(function($controller) {
                //spec body 

                var networkCtrl = createController();
                $httpBackend.expectGET("network-viz/data/laws/" + $routeParams.country + "_laws.csv");
                $httpBackend.flush();
            }));

            it('should open right laws data file', inject(function($controller) {
                //spec body 
                var networkCtrl = createController();
                $httpBackend.expectGET("network-viz/data/country_names.json");
                $httpBackend.flush();
                expect($rootScope.laws).toEqual([{
                    "NORMA": "norma1",
                    "DESCRIPCIÓN": "descripción",
                    "LINK": "link"
                }]);
            }));


        });

    });

});