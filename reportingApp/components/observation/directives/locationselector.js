angular.module('reportingApp').directive('locationselector', function (LocationService) {
	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl = "reportingApp/components/observation/directives/locationselector.html";

	directive.scope = {
		observation: '='
	};

	directive.link = function ($scope, element, attrs) {

		$scope.locations = [];

		$scope.getLocations = function(name){
			return LocationService.getPlaceNames(name).then(function(response){
				if(response.data._items){

					var array = [].concat(response.data._items);
					return array.map(function(st){
						//@todo: Fix thos to match data from server with geojson!!!
						return {name:st.name, descr:st.geo_type+', '+st.municipality +', ' + st.county ,north:st.geo.coordinates[0],east:st.geo.coordinates[1]};
					});
			}else{
				return {};
			}
			});
		};
		
		$scope.getClubLocations = function() {
			
			
			return LocationService.getClubLocations($scope.observation.club).then(function(response) {
				
				
				
			});
		};

	};

	return directive;
});
