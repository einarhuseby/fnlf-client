/**
 *
 *
 */
(function () {

	var reportingApp = angular.module('reportingApp', 
			['ngRoute', 'ngSanitize', 'ngCookies',
			 'ui.bootstrap', 'ui.select',
			 'angular-loading-bar',
			 'fnlf-login',
			 'resolve',
			 'inlinehelp',
			 'fnlf-services',
			 'fnlf-directives',
			 'angularFileUpload',
			 'ui.bootstrap.datetimepicker',
			 'ngMap',
			 'angular-confirm',
			 'ngTable',
			 'truncate','nl2br',
			 'angularMoment',
			 'angled-navbar.directives',
			 'config'

			 ]);

	reportingApp.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
		cfpLoadingBarProvider.includeBar = true;
		cfpLoadingBarProvider.includeSpinner = true;
	}]);
	
	reportingApp.run(function ($rootScope, $location, $cookieStore, amMoment,ENV) {
		$rootScope.ENVname = ENV.name;
		amMoment.changeLocale('nb');
		
		$rootScope.$on('$viewContentLoaded', function () {
			delete $rootScope.error;
		});

		$rootScope.initialized = true;
	});
 
	
	/**
	 * Aside/modal route and back button hack
	 * 
	 */
	
	reportingApp.run(['$route', '$rootScope', '$location', function ($route, $rootScope, $location) {
        var original = $location.path;
        $location.path = function (path, reload) {
            if (reload === false) {
                var lastRoute = $route.current;
                var un = $rootScope.$on('$locationChangeSuccess', function () {
                    $route.current = lastRoute;
                    un();
                });
            }

            return original.apply($location, [path]);
        };
    }]);
	
	reportingApp.factory('DoNotReloadCurrentTemplate', ['$route', function($route) {
		  return function(scope) {
		    var lastRoute = $route.current;
		    scope.$on('$locationChangeSuccess', function() {
		      if (lastRoute.$$route.templateUrl === $route.current.$$route.templateUrl) {
		        $route.current = lastRoute;
		      }
		    });
		  };
		}]);
	/** End aside/modal hack **/
	
})();