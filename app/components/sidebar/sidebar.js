'use strict';

// ............... NOT TESTED
angular.module('myApp.sidebar',['ngRoute'])
.controller('SidebarCtrl', ['$location', '$scope' ,function($location, $scope) {
	
	$scope.path = $location.path();
	$scope.$on('$routeChangeStart', function(next, current) { 
		$scope.path = $location.path();
 });

}])
.directive("sidebar", function(){
	return{
		templateUrl: "components/sidebar/sidebar.html"
	}
});