'use strict';
/**
 * Paren
 *
 * @param $scope
 * @param $location
 * @param $routeParams
 * @param customerService
 */
rbi.controller('parentCtrl', function ($scope, $location, $routeParams,$templateCache) {
	$scope.parentobj = {};
    $scope.parentobj.titleDetailState=null;
    //helper.debugLog('REMOVE CACHE FIRE: ' + JSON.stringify($templateCache.info()));
    //$templateCache.removeAll();


        $scope.omnitureReady=[];
        $scope.trackOmniture=[];

        //Initialize omniture data collection
        Omniture.Init();


   }
);