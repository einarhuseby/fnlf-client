angular.module('reportingApp').directive('involvedSummary', function () {

	var directive = {};

	directive.restrict = 'E';
	directive.template = '<table class="table"><tr ng-repeat="person in observation.involved"><td><span><involvedpersonsummary person="person"></involvedpersonsummary> &nbsp;</span> </td></tr></table>';

	directive.scope = {
		observation: '='
	};

	directive.link = function ($scope, element, attrs) {

	};

	return directive;
});

(function () {

	var involvedpersonselector = function (RestService, $aside, $rootScope, $window) {
		var directive = {};

		directive.restrict = 'E';
//		directive.templateUrl = "components/observation/directives/involvedpersonselector.html";
		directive.template = function(tElement, tAttrs) { 
			
			return '<button type="button" class="btn btn-default pull-right col-xs-12" ng-click="openInvolvedAside()"><i class="fa fa-plus fa-fw"></i>Involverte personer og utstyr</button>';
		};

		directive.scope = {
			observation: '='
		};
		
		directive.controller = function ($scope, $rootScope, $location, $aside) {
			
			$scope.openInvolvedAside = function() {
				$location.path('/observation/modal-route', false);
			    $scope.involvedAside = $aside({
			        scope: $scope,
			        title: 'Involverte personer',
			        //content: 'My Content', //Static custom content
			        show: true,
			        contentTemplate: '/app/obs/components/observation/directives/involvedpersonselector.html',
			        template: '/shared/partials/aside.html',
			        placement: 'full-left',
			        container: 'body',
			        backdrop: 'static',
			        animation: 'am-slide-left'
			        });   
			};
			
			// Needs to manually close aside on back button
			$rootScope.$on('$routeChangeStart', function(event, next, current) {
			  if($scope.involvedAside) {
				if($scope.involvedAside.$scope.$isShown && $location.path().indexOf('/modal-route') == -1) {
				  $scope.involvedAside.hide(); 
				}
			  }
			});
			
			$scope.$on('aside.hide', function() {
			  if($location.path().indexOf('/modal-route') != -1) {
				  $window.history.back();
			  };
			});

			$scope.onSelect = function(item,model){
				console.log("OnSelect "+item)
				item.open=true;
			}

		}

		directive.link = function ($scope, element, attrs) {
			
			
			$scope.personsFromDb = [];

			$scope.getPersonsByName = function (name) {
					RestService.getUserByName(name)
					.then(function (response) {
						$scope.personsFromDb = response._items;
					});
			};

			var nonMemberId = function(){
				return Math.floor(Math.random()*10000)*-1;
			};

			$scope.tagTransform = function(itemText){
				return {fullname:itemText,tmpname:itemText,id:nonMemberId()}
			};

		};

		return directive;
	};

	angular.module('reportingApp').directive('involvedpersonselector', involvedpersonselector);

})();