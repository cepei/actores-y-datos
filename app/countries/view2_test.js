'use strict';

describe('myApp.countries module', function() {
  var $httpBackend, $rootScope, createController, authRequestHandler;
  beforeEach(module('myApp.countries'));

  describe('countries controller', function(){
	   	beforeEach(inject(function($injector) {
	     // Set up the mock http service responses
	     $httpBackend = $injector.get('$httpBackend');
	      // Get hold of a scope (i.e. the root scope)
	     $rootScope = $injector.get('$rootScope');
	     // $routeParams = {"country":"any_country_id"};
	     // backend definition common for all tests
	     authRequestHandler = $httpBackend.when('GET', "countries/data/allcountries.csv")
	                            .respond("DATOS,ODS,FUENTE,TIPO DE FUENTE,PAÍS\ndato1,2 ODS,fuente1,Tipo1,Pais1\ndato1,1 ODS,fuente1,Tipo2,Pais1\ndato2,1 ODS,fuente1,Tipo2,Pais2\ndato1,10 ODS,fuente1,Tipo2,Pais2,\n")


	    //  // The $controller service is used to create instances of controllers
	     var $controller = $injector.get('$controller');
	    //  var timerCallback = jasmine.createSpy("timerCallback");
	    // jasmine.clock().install();
	     createController = function() {
	       return $controller('CountriesCtrl', {'$scope' : $rootScope});
	     };
	   }));

    it('should ....', inject(function($controller) {
      //spec body
      var CountriesCtrl = createController();
      expect(CountriesCtrl).toBeDefined();
    }));

    it('should open right data file', inject(function($controller) {
      //spec body 

      var CountriesCtrl = createController();
      $httpBackend.expectGET("countries/data/allcountries.csv");
      $httpBackend.flush();
    }));

    it('should put data file in scope', inject(function($controller) {
      //spec body 

      var CountriesCtrl = createController();
      $httpBackend.expectGET("countries/data/allcountries.csv");
      $httpBackend.flush();
      expect($rootScope.data).toEqual([{ DATOS: 'dato1', ODS: '2 ODS', FUENTE: 'fuente1', 'TIPO DE FUENTE': 'Tipo1', PAÍS: 'Pais1' }, 								 { DATOS: 'dato1', ODS: '1 ODS', FUENTE: 'fuente1', 'TIPO DE FUENTE': 'Tipo2', PAÍS: 'Pais1' }, 
      								   { DATOS: 'dato2', ODS: '1 ODS', FUENTE: 'fuente1', 'TIPO DE FUENTE': 'Tipo2', PAÍS: 'Pais2' },
      								   { DATOS: 'dato1', ODS: '10 ODS', FUENTE: 'fuente1', 'TIPO DE FUENTE': 'Tipo2', PAÍS: 'Pais2' } ] 
									);
    }));

    it('should count by source type correctly', inject(function($controller) {
      //spec body 

      var CountriesCtrl = createController();
      $httpBackend.expectGET("countries/data/allcountries.csv");
      $httpBackend.flush();
      expect($rootScope.countByType('Tipo1')).toEqual(1);
    }));

    it('should count by country correctly', inject(function($controller) {
      //spec body 

      var CountriesCtrl = createController();
      $httpBackend.expectGET("countries/data/allcountries.csv");
      $httpBackend.flush();
      expect($rootScope.countByCountry('Pais1')).toEqual(2);
    }));


    it('should get relative percent of ODSs', inject(function($controller) {
      //spec body 

      var CountriesCtrl = createController();
      $httpBackend.expectGET("countries/data/allcountries.csv");
      $httpBackend.flush();
      expect($rootScope.relPercentODS(10)).toEqual("25%");
    }));

  });
});

