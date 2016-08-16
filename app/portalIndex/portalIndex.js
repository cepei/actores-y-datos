'use strict';

angular.module('myApp.portalIndex', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/portalIndex', {
    templateUrl: 'portalIndex/portalIndex.html',
    controller: 'PortalIndexCtrl'
  });
}])

.controller('PortalIndexCtrl', [function() {

}]);