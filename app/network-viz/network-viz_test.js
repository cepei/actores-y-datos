'use strict';

describe('myApp.network-viz module', function() {
   	var $httpBackend, $rootScope, createController, authRequestHandler, $routeParams;
	beforeEach(module('myApp.network-viz'));


  describe('network-viz controller on existent country', function(){
   	beforeEach(inject(function($injector) {
     // Set up the mock http service responses
     $httpBackend = $injector.get('$httpBackend');
      // Get hold of a scope (i.e. the root scope)
     $rootScope = $injector.get('$rootScope');
     $routeParams = {"country":"any_country_id"};
     // backend definition common for all tests
     authRequestHandler = $httpBackend.when('GET', "network-viz/data/" + $routeParams.country + ".csv")
                            .respond("DATOS,ODS,FUENTE\ndato1,2 ODS,fuente1\ndato1,1 ODS,fuente1\ndato2,1 ODS,fuente1\ndato1,10 ODS,fuente1\n")

                          $httpBackend.when('GET', "network-viz/data/country_names.json")
                            .respond({"any_country_id":"Country Name"});

                          $httpBackend.when('GET', "network-viz/data/ODSs.csv")
                            .respond("ODS\n1 ODS\n2 ODS\n10 ODS\n");

     // The $controller service is used to create instances of controllers
     var $controller = $injector.get('$controller');
     var timerCallback = jasmine.createSpy("timerCallback");
    jasmine.clock().install();
     createController = function() {
       return $controller('NetworkVizCtrl', {'$scope' : $rootScope , '$routeParams': $routeParams});
     };
   }));
   	afterEach(function() {
     jasmine.clock().uninstall();
     $httpBackend.verifyNoOutstandingExpectation();
     $httpBackend.verifyNoOutstandingRequest();

   });

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
      var datum = {"name":"node name", "type": "type"}
      $rootScope.clickNode(datum);
      jasmine.clock().tick(100);
      expect($rootScope.nodeName).toBe("node name");
      

    }));

    it('should put correct odsIndex in scope when clicked an ods', inject(function($controller) {
      //spec body 
      var networkCtrl = createController();
      $httpBackend.flush();
      var datum = {"name":"10 ODS", "type": "ods"}
      $rootScope.clickNode(datum);
      jasmine.clock().tick(100);
      expect($rootScope.odsIndex).toBe(10);
      

    }));

    it('should put empty string in nodeName when clicked outside a node after a node was selected', inject(function($controller) {
      //spec body 
      var networkCtrl = createController();
      $httpBackend.flush();
      var datum = {"name":"node name", "type": "type"}
      $rootScope.clickNode(datum);
      jasmine.clock().tick(100);
      $rootScope.clickOutsideNode();
      expect($rootScope.nodeName).toBe("");

    }));

    it('should put correct type in scope when clicked', inject(function($controller) {
      //spec body 
      var networkCtrl = createController();
      $httpBackend.flush();
      var datum = {"name":"node name", "type": "type"}
      $rootScope.clickNode(datum);
      jasmine.clock().tick(100);
      expect($rootScope.nodeType).toBe("type");

    }));

    it('should put correct name in scope when clicked, given integer as parameter and type is ods', inject(function($controller) {
      //spec body 
      var networkCtrl = createController();
      $httpBackend.flush();
      var datum = {"name":10, "type": "ods"}
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

    it('should put relatedToNode names in scope correctly', inject(function($controller) {
      //spec body 
      var networkCtrl = createController();
      $httpBackend.expectGET("network-viz/data/country_names.json");
      $httpBackend.expectGET("network-viz/data/ODSs.csv");
      $httpBackend.flush();     
      var datum = {"name":"1 ODS", "type": "ods"}
      $rootScope.clickNode(datum);
      jasmine.clock().tick(100);
      expect($rootScope.relatedToNode).toEqual({"datos":["dato1","dato2"], "fuente":["fuente1"], "ods":[1]});
    }));

    it('should put sorted ODSs in relatedToNode in scope correctly', inject(function($controller) {
      //spec body 
      var networkCtrl = createController();
      $httpBackend.expectGET("network-viz/data/country_names.json");
      $httpBackend.expectGET("network-viz/data/ODSs.csv");
      $httpBackend.flush();     
      var datum = {"name":"dato1", "type": "datos"}
      $rootScope.clickNode(datum);
      jasmine.clock().tick(100);
      expect($rootScope.relatedToNode).toEqual({"datos":["dato1"], "fuente":["fuente1"], "ods":[1, 2, 10]});
    }));

  });
});