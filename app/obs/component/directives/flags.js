
(function () {
	angular.module('reportingApp').directive('flags', function (Definitions) {
		var directive = {};

		directive.restrict = 'E';
		directive.templateUrl = "/app/obs/component/directives/flags.html";

		directive.scope = {
			attributes: '=',
			acl: '='
		};

		directive.link = function ($scope, element, attrs) {
            $scope.allAttributes  = Definitions.getComponentAttributes();

		};

		return directive;
	});

})();






(function () {
	angular.module('reportingApp').directive('flag', function () {
		var directive = {};

		directive.restrict = 'E';
		directive.template = '<span><a href="/app/obs#!/search/flag/{{attribute}}"><span ng-transclude></span></a></span>';
		directive.transclude=true;
		directive.scope = {
			attribute: '@'
		};

		directive.link = function ($scope, element, attrs) {

		};

		return directive;
	});

})();