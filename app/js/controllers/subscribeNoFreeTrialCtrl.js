'use strict';
/**
 * subscribeNoFreeTrialCtrl
 *
 * Handles subscription for existing accounts with no free trial (inline subscription upgrade from Title details page)
 *
 * Refactored by Peter Rajcani, 11/7/2013
 */

rbi.controller('subscribeNoFreeTrialCtrl', function ($scope, $location, $routeParams, $dialog, rbiCommonService, customerService) {

    //Omniture
    Omniture.pageName = RBI.PlatformConfig.OmnitureTargetDevice + "|create account|reg details";
    $scope.omnitureReady=[true];
    //Omniture

    $scope.createAccountControl = ["dvdSubscription", "bluraySubscription","streamingOnly"];
    $scope.focusIndex = 0;   //initial focus set
    var eventHandler = new subscribeNoFreeTrialEventHandler($scope, $location, rbiCommonService);
    $scope.eventHandler = eventHandler;
    $scope.hasCards = false;
    sharedScopeWithMenu($scope, $location);

    //call init function
    hideMainMenu();
    init();

    var unbindOmniture=$scope.$watch("omnitureReady",function(){
        if($scope.omnitureReady.indexOf(false)<=-1){
            Omniture.Clear();
            if (internetConnected) {
                Omniture.Variables.prop1 = RBI.PlatformConfig.OmnitureTargetDevice + "|create account";
                Omniture.Variables.prop2 = RBI.PlatformConfig.OmnitureTargetDevice + "|create account|reg details";
                Omniture.Variables.prop3 = RBI.PlatformConfig.OmnitureTargetDevice + "|create account|reg details";
                Omniture.Variables.eVar54 = "+1";
                Omniture.Variables.events = ["event37", "event38"];
                Omniture.InvokeOmniture(Omniture.InvokeType.load);
            }
            $scope.omnitureReady[0]=false;
        }
    });
    if(!RBI.PlatformConfig.OmnitureEnabled){
        unbindOmniture();
    }

    /**
     * add back path for sign-up
     */
    intializeBackPathSignup('/home'); // ZOE-35551 - User needs to be taken back to home page
    addToBackPathsSign($location.path());

    
    /**
     * Get Cards for the current customer and checks for preferred card
     */
    function getCardsForCurrentCustomer() {
        customerService.getCards(rbiCommonService, function (data) {
            helper.debugLog(data);
            if (data.length >= 1) {
                $scope.hasCards = true;
            }
        }, function (data) {
            helper.debugLog(data);
            helper.showErrorMessage(data, $scope);
        });
    }

    /**
     * Calls the get cards api
     */
    function init() {
        getCardsForCurrentCustomer();
    }

});