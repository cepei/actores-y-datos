'use strict';

angular.module('myApp.countries', ['ngRoute'])
.controller('CountriesCtrl', ["$scope", "$routeParams", "$http", function($scope, $routeParams, $http) {
	$scope.data = [];
	var ods_totals = [0];
	var max_total_ods = 0;

	$http.get("countries/data/allcountries.csv").then(
	function(response){
		$scope.data = d3.csv.parse(response.data);
		for(var i = 1; i <=17; i++){
			ods_totals[i] = $scope.data.filter(function(obj){
					return obj["ODS"].split(" ")[0] == i;
				}).length
		}

		max_total_ods = Math.max.apply(null,ods_totals)

		function calculateBars()
		{
			d3.selectAll(".barra-ods")
			  .each(function(d,i){
			  	d3.select(this).style("height",null);
			  	var height = 280;
			  	// var height = d3.select(this).node().getBoundingClientRect().height;
		      	var odsIndex = d3.select(this).attr("id").split("-")[1];


				d3.select(this)
			    .select(".barra-value-ods")
			  	.html(ods_totals[odsIndex])
				.transition()
				.delay(750)
				.style("top", -height*($scope.relPercentODS(odsIndex)) + "px");

			  	d3.select(this)

				.transition()
				.delay(750)
			    .style("height", function(d){
			      	return height*($scope.relPercentODS(odsIndex)) + "px";
			    })
			  	.style("margin-top", function(d){
			      	return height*(1-$scope.relPercentODS(odsIndex)) + "px";
			    })
			    .style("padding-top", function(d){
			      	return height*($scope.relPercentODS(odsIndex)-0.1) + "px";
			    })



			  })


			  d3.selectAll(".barra-ods-res")
			  .each(function(d,i){
			  	d3.select(this).style("width",null);
			  	var width = d3.select(this).node().getBoundingClientRect().width;
		      	var odsIndex = d3.select(this).attr("id").split("-")[1];
			  	d3.select(this)
				    .style("width", function(d){
				      	return width*($scope.relPercentODS(odsIndex)) + "px";
				    })

				    .select(".barra-value-ods") 
			  		.html(ods_totals[odsIndex]);

			  })}

		calculateBars();
		d3.select(window).on('resize', calculateBars); 



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

	$scope.relPercentODS = function(odsIndex){
		return ods_totals[odsIndex]/max_total_ods;
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