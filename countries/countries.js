'use strict';

angular.module('myApp.countries', ['ngRoute'])
.controller('CountriesCtrl', [function() {
	console.log("Countries")
}])
.controller('CountryCtrl', ["$scope", "$routeParams", function($scope, $routeParams) {
	console.log($routeParams)
}])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  	.when('/countries', {
    	templateUrl: 'countries/countries.html',
    	controller: 'CountriesCtrl'
  	})
  	.when('/countries/:countryId', {
    	templateUrl: 'countries/country.html',
    	controller: 'CountryCtrl'	
  	});
}])

;