angular.module('reportingApp').directive('weatherSummary', function () {

	var directive = {};

	directive.restrict = 'E';
	directive.templateUrl = "observation/directives/weatherSummary.html";

	directive.scope = {
		observation: '=',
		acl: '='
	};

	directive.link = function ($scope, element, attrs) {

	};

	return directive;
});


(function () {

	var weather = function (RestService, $rootScope, $window) {
		var directive = {};
		

		directive.restrict = 'E';
		directive.templateUrl = '/app/obs/observation/directives/weather.html';


		directive.scope = {
			observation: '=',
			acl: '='
		};

		directive.controller = function ($scope, $rootScope, $location, $http, $q) {
			
			var urlBase = '/api/v1';

			
			$scope.setMetar = function(code) {
				
				getAero(code,'metar').then(function(response){
					$scope.observation.weather.auto['metar'] = response.metar;
				});
			};
			$scope.setTaf = function(code) {
				
				getAero(code,'taf').then(function(response){
					$scope.observation.weather.auto['taf'] = response.taf;
				});
			};
			$scope.setYr = function(county, municipality, name) {
				
				getYr('now', county, municipality, name).then(function(response){
					$scope.observation.weather.auto['yr'] = response;
				});
			};
			
			
			
			function getYr(what, county, municipality, name) {
				
				var request = $http({
					method : "get",
					url : urlBase + '/weather/yr/' + county + '/' + municipality + '/' + name + '/' + what
				});
				return (request.then(handleSuccess, handleError));
			};
			
			function getAero(code, type) {
				
				var request = $http({
					method : "get",
					url : urlBase + '/weather/aero/' + code + '/' + type
				});
				return (request.then(handleSuccess, handleError));
			};
			
			function handleError(response) {
				if (!angular.isObject(response.data) || !response.data.message) {
					return ($q.reject("An unknown error occurred."));
				}
				return ($q.reject(response.data.message));
			}
			function handleSuccess(response) {
				return (response.data);
			};
			
		};
		
		/**
		 * @todo: Get parameters from club and club.locations
		 */
		directive.link = function ($scope, element, attrs) {
			if(!$scope.observation.weather.auto) $scope.observation.weather['auto'] = {};
			
			
			/** Change if club changes! **/
			$scope.$watch('observation.club',function(newValue,oldValue) {
				
				if(newValue &&  newValue != oldValue) {
					
					
					
				};
			});
			/** Change if location changes! **/
			$scope.$watch('observation.location',function(newValue,oldValue) {
				
				if(newValue && newValue.nickname != oldValue.nickname) {
					//Reset
					$scope.observation.weather.auto = {};
					
					$scope.setMetar($scope.observation.location.icao);
					$scope.setTaf($scope.observation.location.icao);
					
					$scope.setYr($scope.observation.location.county,$scope.observation.location.municipality,$scope.observation.location.name);
				}
			});
			
		};

		return directive;
	};

	angular.module('reportingApp').directive('weather', weather);

})();