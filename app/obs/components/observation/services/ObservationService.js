(function () {

	angular.module('reportingApp')
		.service('ObservationService', function (RestService,Definitions,Functions,$rootScope,$location,$q) {

			function Observation() {
				this.involved = [];
				this.when = new Date();
				this.location={};
				this.organization={};
				this.organization.hl=[];
				this.organization.hm=[];
				this.organization.hfl=[];
				this.rating = {};
				this.weather = {};
				this.components = [];
				this.files=[];
				this.related = [];
				this.tags = [];
				this.comments = [];
				this.actions = {};
				this.type = 'near_miss';
			};

			
			this.initObservation = function(observation){

				var prototypeObs = new Observation();

				for(var k in prototypeObs){
					if(angular.isUndefined(observation[k])){
						observation[k]=prototypeObs[k];
					}
				}
				
			};

			var initObservationFn = this.initObservation;

			var observation = new Observation();

			this.setObservation = function (selectedObservation) {
				observation = selectedObservation;
			};
			this.getObservation = function () {
				return observation;
			};




			this.getObservationById = function (id) {
				return RestService.getObservationById(id)
					.then(function(obs){
						initObservationFn(obs);
						return obs;
					});
			};


			this.createObservation = function () {



			};

			this.editObservation = function (_id) {
				RestService.getObservation(_id).then(function (item) {
					if (item.workflow.state == 'closed') {
						$location.path("/observation/report/" + item.id);
					}
					else {
						$location.path("/observation/" + item.id);
					}
				});

			};





			var clearFullname = function(person){
				if(person) {
					delete person.open;
					delete person.fullname;
				}
			};

			function clearFullnameFromObservation(observation){
				angular.forEach(observation.involved,clearFullname);
				angular.forEach(observation.organization.hl,clearFullname);
				angular.forEach(observation.organization.hm,clearFullname);
				angular.forEach(observation.organization.hfl,clearFullname);
				angular.forEach(observation.organization.pilot,clearFullname);
				angular.forEach(observation.components,function(comp){
				angular.forEach(comp.involved,clearFullname);
				});


			};


			this.updateObservation = function (observation) {

				clearFullnameFromObservation(observation);

				var _id = observation._id;
				var id = observation.id;
				var _etag = observation._etag;

				var observationDto = {};
				Functions.copy(observation,observationDto);

				delete observationDto.id;
				delete observationDto.reporter;
				delete observationDto.owner;
				delete observationDto.wilfull;

				delete observationDto.title;
				delete observationDto._updated;
				delete observationDto._latest_version;
				delete observationDto.audit;
				delete observationDto.watchers;
				delete observationDto._version;
				delete observationDto.workflow;
				delete observationDto._links;
				delete observationDto._created;
				delete observationDto._status;
				delete observationDto._etag;
				delete observationDto._id;

				$rootScope.error = null;

				return RestService.updateObservation(observationDto, _id, _etag)
					.then(function(obs){
						return RestService.getObservation(id)
							.then(function(updated){
								clearFullnameFromObservation(updated);
								return updated;
							});
					});
			};

			this.clearObservation = function () {
				observation = new Observation();
			};

			/**
			 * Change workflow state if access
			 * 
			 * 
			 */
			this.changeWorkflowState = function (objectId, action, comment,callback){
				
				RestService.changeWorkflowState(objectId, action, comment)
				.then(function(data){
					RestService.getObservation(objectId)
						.then(function(updated){
							callback(updated);

						});
				},function(error){
						console.log(error);
						$rootScope.error=error;
						RestService.getObservation(objectId)
							.then(function(updated){
								callback(updated);

							});
					});
			};
			
			/**
			 * Watching start/stop
			 */
			
			this.isWatching = function(objectId) {
				
				
			};
			
			this.stopWatching = function(objectId) {
				
			};


			this.searchByTag = function(page,maxResults,sort,tag){
				var quotedTag = '"'+tag+'"';

				var where = 'where={"$or":[{"tags":'+quotedTag+'},{"components.tags":'+quotedTag+'},{"components.what":'+quotedTag+'},{"components.where.at":'+quotedTag+'}]}';
				return RestService.getAllObservations(page,maxResults,sort,where);
			};

			this.searchByFlag = function(page,maxResults,sort,flag){
				var where = 'where={"$or":[{"components.attributes.'+flag+'":true}]}';
				return RestService.getAllObservations(page,maxResults,sort,where);
			};

		});


})();
