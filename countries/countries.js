'use strict';

angular.module('myApp.countries', ['ngRoute'])
.controller('CountriesCtrl', [function() {

}])
.controller('CountryCtrl', ["$scope", "$routeParams", "$http",function($scope, $routeParams, $http) {

	function getStructure(country){
		var structure = {"head":[],"list":[]}
		country["Composición de la estructura institucional"]
				.split("\n")
				.forEach(function(elem){
					if(elem.startsWith("-"))
						structure.list.push(elem.substring(1,elem.length));
					else{
							if(elem.toLowerCase().indexOf(country["País"].toLowerCase()) == -1 && elem!="")
								structure.head.push(elem);
					}
				})
		console.log(structure);
		return structure
	}

	$http.get("countries/countries.csv").then(function(response){

		var country = d3.csv.parse(response.data)
						.find(function(country){
								return country.id == $routeParams.countryId;
							});
		console.log(country);
		$scope.name = country["País"];
		$scope.pib = country["PIB (Miles de Millones)"];
		$scope.incomeLevel =  country["Nivel de renta"];
		$scope.population = country["Población (Millones)"];
		$scope.structure = getStructure(country);
		$scope.incidenceOfPoverty = country["Tasa de incidencia de la pobreza sobre la base de la línea nacional"];
		$scope.hdi = country["Índice de Desarrollo Humano"];
		$scope.hdiRank = country["Posición en el Indice de Desarrollo Humano"];
		$scope.actions = country["Acciones implementadas"];


		});		
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
}]);