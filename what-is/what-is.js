'use strict';

angular.module('myApp.what-is', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/what-is', {
    templateUrl: 'what-is/what-is.html',
    controller: 'WhatIs2Ctrl'
  });
}])

.controller('WhatIs2Ctrl', [function() {

}]);