'use strict';

angular.module('myApp.ecoView', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/ecoView', {
    templateUrl: 'ecoView/ecoView.html',
    controller: 'EcoViewCtrl'
  });
}])

.controller('EcoViewCtrl', [function() {

}]);