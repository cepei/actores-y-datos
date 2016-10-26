'use strict';

angular.module('myApp.countries', ['ngRoute'])
.controller('CountriesCtrl', ["$scope", "$routeParams", "$http", function($scope, $routeParams, $http) {
	$scope.data = [];
	var ods_totals = [];

	$http.get("countries/data/allcountries.csv").then(
	function(response){
		$scope.data = d3.csv.parse(response.data);
		for(var i = 1; i <=17; i++){
			ods_totals[i] = $scope.data.filter(function(obj){
					return obj["ODS"].split(" ")[0] == i;
				}).length
		}

		console.info(ods_totals);
		// console.info(ods_totals.map())

	});

	$scope.countByType = function(type){
		return $scope.data.filter(function(obj){
			return obj["TIPO DE FUENTE"] == type;
		}).length
	}

	$scope.countByCountry = function(country){
		return $scope.data.filter(function(obj){
			return obj["PAÍS"] == country;
		}).length
	}

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
		$scope.countryId =  $routeParams.countryId;
		$scope.name = country["País"];
		$scope.pib = country["PIB (Miles de Millones)"];
		$scope.incomeLevel =  country["Nivel de renta"];
		$scope.population = country["Población (Millones)"];
		$scope.structure = getStructure(country);
		$scope.incidenceOfPoverty = country["Tasa de incidencia de la pobreza sobre la base de la línea nacional"];
		$scope.hdi = country["Índice de Desarrollo Humano"];
		$scope.hdiRank = country["Posición en el Indice de Desarrollo Humano"];
		$scope.actions = country["Acciones implementadas"];
		$scope.ods_indices = d3.range(1,18);


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