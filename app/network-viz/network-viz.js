'use strict';

angular.module('myApp.network-viz', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/network-viz/:country?', {
    templateUrl: 'network-viz/network-viz.html',
    controller: 'NetworkVizCtrl'
  });
}])

.controller('NetworkVizCtrl', ["$scope", "$routeParams", "$http",  function($scope, $routeParams, $http) {
	$scope.countryId =  $routeParams.country;
	$scope.data = ["relax", "expand"];
	$scope.nodeName = "";
	$http.get("network-viz/data/country_names.json").then(
	function(response){
		$scope.countryName = response.data[$scope.countryId ]
	});
	create_graph("network-viz/data/" + $routeParams.country + ".csv");
	var force, 
		data = [];

	$scope.clickNode = function(d){
	    	var associated = $scope.getAssociatedNodes(d);
	    	var associatedList = associated.ods.concat(associated.fuente.concat(associated.datos))
	    	associated.ods = associated.ods.map(function(d){return parseInt(d.split(" ")[0])});
	    	$scope.relatedToNode = associated;
	    	$scope.nodeName = d.name;
	    	$scope.nodeType = d.type;
	    	$scope.$apply()

	    	d3.selectAll(".node")
	    	.classed("highligthed", function(d){ return associatedList.indexOf(d.name) != -1})	
	    	d3.selectAll(".link").classed("highligthed", 
	    								function(d){ 
	    									var is_source_associated = associatedList.indexOf(d.source.name) != -1;
	    									var is_target_associated = associatedList.indexOf(d.target.name) != -1;
	    									return is_source_associated && is_target_associated})

	}


	$scope.getAssociatedNodes = function(nodedata){
		var associated = {"datos":[],"fuente":[],"ods":[]};
	    	data.filter(function(obj){
	    		return obj[nodedata.type.toUpperCase()] == nodedata.name
	    	}).forEach(function(d){
	    		if(associated.ods.indexOf(d.ODS)==-1)
	    			associated.ods.push(d.ODS);

	    		if(associated.fuente.indexOf(d.FUENTE)==-1)
	    			associated.fuente.push(d.FUENTE);
	    		
	    		if(associated.datos.indexOf(d.DATOS)==-1)
	    			associated.datos.push(d.DATOS);

	    	})
	    return associated;
	}

	$scope.clickOutsideNode = function(){
		$scope.nodeName = "";
    	d3.selectAll(".node").classed("highligthed", true);	
    	d3.selectAll(".link").classed("highligthed", true);
    	$scope.$apply();	
	}

	function create_graph(filename){
		$http.get(filename).then(
			function(response){
			var rawdata = d3.csv.parse(response.data);
			
			var width = 1000,
			    height = 1000
			var x_center = 350;
			var y_center = 350;
			var base_node = {
				"base_radius":{"ods":0, "fuente":3, "datos":3},
				"charge":{"ods":-50, "fuente":-20, "datos":-5}
			}
			$http.get("network-viz/data/ODSs.csv").then(function(response){		
				var ODSs = d3.csv.parse(response.data);
				data = rawdata.filter(rowContainsValidODS);
				var ocurrences = getNodesOcurrencesInDatabase(data, ODSs);
				var nodes = createNodes(data, ODSs);
				var links = createLinks(data);
				var positions = getNodesPositions(nodes, data, ocurrences, x_center, y_center);
				setInitialNodePositions(nodes)

				if(force)
					force.stop()

				force = d3.layout.force()
				    .nodes(d3.values(nodes))
				    .links(links)
				    .size([width, height])
				    .linkDistance(60)
				    .linkStrength(0)
				    .friction(0.9)
				    .gravity(0)
				    .charge(calculateCharge)
				    .chargeDistance(50)
				    .on("tick", moveToRadial)
				    .start()

				var tip = d3.select("body").append("div")	
					.attr("class", "tooltip")				
					.style("opacity", 0);
				


				d3.select("#forcemap").html("")

				var svg = d3.select("#forcemap").append("svg")
				    .attr("width", width)
				    .attr("height", height);

				var path = svg.append("g").selectAll("path")
				    .data(force.links())
				  .enter().append("path")
				    .attr("class", function(d) { return "link highligthed " + d.type; })
				    .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });
				

				var nodeEnter = svg.append("g")
								.selectAll("g")
								.data(force.nodes())
								.enter().append("g")
								.attr("class", "node highligthed")
								.call(force.drag)
								.on("click", $scope.clickNode)
								.on("mouseover",function(d){

									tip	.html("<b>" + d.type.toUpperCase() + "</b>: " + d.name)	
										.style("left", (d3.event.pageX) + 10 +"px")		
										.style("top", (d3.event.pageY) + 10 +"px");	

									tip.transition()		
										.duration(200)		
										.style("opacity", .7);		



								})
								.on("mouseout", function(d) {
									tip	.html("<b>" + d.type.toUpperCase() + "</b>: " + d.name)	
										.style("left", -100 + "px")		
										.style("top", -100 + "px")	
										.style("opacity", 0);	
										
								})



				var circle = nodeEnter.append("svg:circle")
						.attr("class", function(d) { return d.type; })
						.attr("r", calculateNodeRadius)
						.on("click", $scope.clickNode)

				var images = nodeEnter
						.filter(function(d){return d.type=="ods"})
						.append("svg:image")
						.attr("xlink:href",  function(d) { if(d.type=="ods")
																var ods_number = d.name.split(" ")[0]
																return "images/ODS/Images_ODS-"+ ods_number +".png";
															return ""})
						.attr("x", calculateODSImageOfsett)
						.attr("y", calculateODSImageOfsett)
						.attr("height", calculateODSImageSize)
						.attr("width", calculateODSImageSize)
						.on("click", $scope.clickNode);


				d3.select("body").on("click",function(){

				    if (!d3.select(d3.event.target.parentElement).classed("node")) {
				    	$scope.clickOutsideNode();
				    }
				});



				function rowContainsValidODS(row){
					var ods_index = parseInt(row.ODS.split(" ")[0]);
					return ods_index > 0 && ods_index <=17;
				}


				function createNodes(data, ODSs){
					var nodes = {}
					ODSs.forEach(function(d,i){
						nodes[d.ODS] = {name: d.ODS, type: "ods", node_index: -i}
					})

					data
					.forEach(function(d,i) {
						nodes[d.ODS] = {name: d.ODS, type: "ods", node_index: i}	
						nodes[d.FUENTE] = {name: d.FUENTE, type: "fuente", node_index: i}	
						nodes[d.DATOS] = {name: d.DATOS, type: "datos", node_index: i}	

					});

					return nodes

				}

				function createLinks(data){
						var links = [];
						data
						.forEach(function(d,i) {
						  links.push({"source": nodes[d.ODS], "target":nodes[d.DATOS], "type": "ods-fuente"});
						  links.push({"source": nodes[d.DATOS], "target":nodes[d.FUENTE], "type": "fuente-datos"});

						})

						return links
				}

				function calculateODSImageOfsett(nodedata){
					return -calculateODSImageSize(nodedata)/2;
				}

				function calculateODSImageSize(nodedata){
					var weight = (1 + ocurrences[nodedata.type][nodedata.name]/ocurrences[nodedata.type]["__max"]);
					return 30 * weight
				}

				function calculateNodeRadius(nodedata){
					var weight = (1 + 3*ocurrences[nodedata.type][nodedata.name]/ocurrences["fuente"]["__max"]);
			    	return base_node.base_radius[nodedata.type] * weight;

				}

				function calculateCharge(nodedata){
			    	return base_node.charge[nodedata.type];
				}

				function getNodesPositions(nodes, data, ocurrences, x_center, y_center){
						var positions = {"ods":{}, "fuente":{}, "datos":{}}		
						setODSNodesOnCircularPositions(positions, nodes, ocurrences);
						setNodesPositionsByODSAfinity(positions, nodes, data, x_center, y_center);
						return positions;
				}

				function setODSNodesOnCircularPositions(positions, nodes, ocurrences){
					var orderedOcurencies = [];
					for(var k in ocurrences.ods){
						if(k!="__max")
							orderedOcurencies.push({"key":k,"value":ocurrences.ods[k]})

					}
					orderedOcurencies.sort(function(a,b){return a.value < b.value})
									 .forEach(function(d,i){
									 	var node = nodes[d.key];
									 	positions["ods"][node.node_index] = getODSNodePosition(node, i);
									 })
				}

				function setNodesPositionsByODSAfinity(positions, nodes, data, x_center, y_center){
						for(var key in nodes){
							var node = nodes[key];
							if(node.type != "ods"){
							    positions[node.type][node.node_index] = getNodePositionByODSAfinity(node, 
							    																	data, 
							    																	x_center, 
							    																	y_center, 
							    																	positions)
							}
						}
				}

				function getNodePositionByODSAfinity(node, data, x_center, y_center, positions){
					var coordinates = {x:x_center,y:y_center};
					var type = node.type;
					var name = node.name;
			    	data.filter(function(datanode){
				    		return datanode[type.toUpperCase()] == name && datanode.ODS != "";
				    	}).forEach(function(d, i, arr){
				    		var weight = 1 / (arr.length * (type=="fuente"?1.6:1.3));
				    		var ods_coordinates = positions.ods[nodes[d.ODS].node_index];
		    				coordinates.x += (ods_coordinates.x - x_center) * weight;	
		    				coordinates.y += (ods_coordinates.y - y_center) * weight;									
				    	})
				    return coordinates

				}

				function getODSNodePosition(node, index){
					// var i = parseInt(node.name.split(" ")[0])
					var i = index;
					var increment_angle = 360/17
					var radius = 250;
					var offsetAngle = -90;
					var currentAngleRadians = (offsetAngle + (increment_angle * i)) * Math.PI / 180 ;
					return {
							  x: x_center + (radius * Math.cos(currentAngleRadians)),
							  y: y_center + (radius * Math.sin(currentAngleRadians))
							};			
				}


				function getNodesOcurrencesInDatabase(data, ODSs){
					var ocurrences = {"ods":{"__max":0}, "fuente":{"__max":0}, "datos":{"__max":0}}

					ODSs.forEach(function(d){
						ocurrences["ods"][d.ODS] = 0;
					})
					
					data.forEach(function(d){
						for(var key in ocurrences){
							if(!ocurrences[key][d[key.toUpperCase()]])
								ocurrences[key][d[key.toUpperCase()]] = 0;
							ocurrences[key][d[key.toUpperCase()]]++;
							if(ocurrences[key][d[key.toUpperCase()]] > ocurrences[key]["__max"])
								ocurrences[key]["__max"] = ocurrences[key][d[key.toUpperCase()]]
						}
					})

					return ocurrences;

				}

				function setInitialNodePositions(nodes){
						var  D2R = Math.PI / 180;		
						for(var key in nodes){
							var tetha = Math.random() * 360 * D2R					
							var r = (100 + Math.random() * data.length * 0.1) //* (1 - Math.cos((tetha + Math.PI/2) * 3));
							nodes[key].x = 400 + (r * Math.cos(tetha));
							nodes[key].y = 400 + (r * Math.sin(tetha));
						}
						
				}

				function moveToRadial(e) {
					path.attr("d", linkArc);
				  nodeEnter.each(function(d,i) { radial(d,i,e.alpha); });
					

					nodeEnter.attr("transform", transform)
				}

				// functions 
				function linkArc(d) {
				  return "M" + d.source.x + "," + d.source.y + "L" + d.target.x + "," + d.target.y;

				}

				function transform(d) {
				  return "translate(" + d.x + "," + d.y + ")";
				}

				function radial(data, index, alpha) {
					var radialPoint = positions[data.type][data.node_index]
					var affectSize = alpha * 0.1 ;
					data.x += (radialPoint.x - data.x) * affectSize;
					data.y += (radialPoint.y - data.y) * affectSize;


				}

			})
		})
	}
}]);