'use strict';

// ............... NOT TESTED
angular.module('myApp.sidebar',['ngRoute'])
.controller('SidebarCtrl', ['$location', '$scope' , "$routeParams", function($location, $scope, $routeParams) {
	
	$scope.path = $location.path();
	$scope.$on('$routeChangeStart', function(next, current) { 
		// console.log(current)
		$scope.path = $location.path();
		$scope.countryId = current.params.countryId;
		// console.log($routeParams)
 });

	

}])
.directive("sidebar", function(){
	return{
		templateUrl: "components/sidebar/sidebar.html"
	}
});