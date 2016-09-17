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
                            .respond(

                            	// {userId: 'userX'}, {'A-Token': 'xxx'}
                            	);


     // The $controller service is used to create instances of controllers
     var $controller = $injector.get('$controller');

     createController = function() {
       return $controller('NetworkVizCtrl', {'$scope' : $rootScope , '$routeParams': $routeParams});
     };
   }));
   	afterEach(function() {
     $httpBackend.verifyNoOutstandingExpectation();
     $httpBackend.verifyNoOutstandingRequest();
   });

    it('should open right file', inject(function($controller) {
      //spec body 

      var networkCtrl = createController();
      $httpBackend.expectGET("network-viz/data/" + $routeParams.country + ".csv");
      $httpBackend.flush();
    }));

    it('should put correct name in scope when clicked', inject(function($controller) {
      //spec body 
      var networkCtrl = createController();
      var datum = {"name":"node name", "type": "type"}
      $rootScope.clickNode(datum);
      expect($rootScope.nodeName).toBe("node name");
      $httpBackend.flush();

    }));

    it('should put correct type in scope when clicked', inject(function($controller) {
      //spec body 
      var networkCtrl = createController();
      var datum = {"name":"node name", "type": "type"}
      $rootScope.clickNode(datum);
      expect($rootScope.nodeType).toBe("type");
      $httpBackend.flush();

    }));

    // it('should ....', inject(function($controller) {
    //   //spec body 
    //   var networkCtrl = createController();
    //   $httpBackend.flush();
    // }));



  });
});