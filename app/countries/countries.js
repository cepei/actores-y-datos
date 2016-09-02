'use strict';

angular.module('myApp.countries', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/countries', {
    templateUrl: 'countries/countries.html',
    controller: 'CountriesCtrl'
  });
}])

.controller('CountriesCtrl', [function() {

}]);