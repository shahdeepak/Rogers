'use strict';

rbi.controller('freeTrialCtrl', function ($scope, $location, $routeParams, $dialog,rbiCommonService, customerService) {
    var eventHandler = new freeTrialEventHandler($scope, $location, $routeParams, $dialog, rbiCommonService, customerService);
    //Omniture
    Omniture.pageName="";
    $scope.omnitureReady=[false];
    //Omniture

    $scope.eventHandler = eventHandler;
    $scope.backButtonLabel = "I just want to Sign In and look around";

    sharedScopeWithMenu($scope, $location);
    intializeBackPathSignup('/home'); // ZOE-35551 - User needs to be taken back to home page
    addToBackPathsSign($location.path());
    
    $scope.createAccountControl = ["account_withSubscription", "account_withoutSubscription"];
    $scope.hasCreditCardOnFile = false;
    $scope.focusIndex = 0;
    init();

    $scope.selectFreeTrialOption = function () {
        //When Existing customer selects free trial it skips add card flow
        if ($scope.hasCreditCardOnFile) {
            switch ($scope.focusIndex) {
                case 0: {
                    // Go directly to Review subscription page
                    rbiCommonService.setSharedItem(SUBSCRIPTION_TYPE, FREE_TRIAL);
                    $location.path("/subscription");
                    break;
                }
                case 1: {
                    // ZOE-30380: No, thanks - Exit sinup flow in this case
                    //goToPreviousPathSign($location, true, rbiCommonService);
                    // ZOE-33373 / 30380 - user needs to be taken to Confirm Subscription screen
                    // When the user comes from Kiosk Checkout -- Add Title -- Subscribe
                    // The user should be taken back to the title details page instead of subscription..
                    // ZOE-36184
                    if(!new RBI.Cart().isEmpty())
                        $location.path(backPaths[backPaths.length - 1]);
                    else
                    $location.path("confirmSubscription/Movie");
                    //Omniture tracking
                    $scope.trackOmniture="noFreeTrial";
                    $scope.omnitureReady=[true];
                    //Omniture end
                    break;
                }
            }

        }
        //users with no no credit card on file
        else {
            processAddCard();
        }
    };

    // Called for users with no credit card on file
    function processAddCard() {
        switch ($scope.focusIndex) {
            case 0: {
                rbiCommonService.setSharedItem(SUBSCRIPTION_TYPE, FREE_TRIAL);
                break;
            }
            case 1: {
                //Omniture start
                $scope.trackOmniture="noFreeTrial";
                $scope.omnitureReady=[true];
                // Omniture end

                rbiCommonService.setSharedItem(SUBSCRIPTION_TYPE, NO_SUBSCRIPTION);
                break;
            }
        }

        // ZOE-30585: set the isFirstCard flag if it has not been set
        if(!rbiCommonService.isSharedItemExist("isFirstCard")) {
            rbiCommonService.setSharedItem("isFirstCard", true);
        }
        $location.path("/account/creditCards/cardDetails/add");
    }

    // Called when the page is loaded
    function init() {
        if(rbiCommonService.isSharedItemExist(SUBSCRIPTION_TYPE)){
            rbiCommonService.removeSharedItem(SUBSCRIPTION_TYPE);
        }

        // ZOE-30398
        // When the page is loaded call getCards to find out if user has added a credit card
        customerService.getCards(rbiCommonService, function (data) {
            $scope.hasCreditCardOnFile = (data.length > 0);
            initOmniture();
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        }, function(data) {
             // Treat user as a new customer
            $scope.hasCreditCardOnFile = false;
            initOmniture();
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        });
    }

    // Omniture start
    function initOmniture () {
        if ($scope.hasCreditCardOnFile) {
            Omniture.pageName=RBI.PlatformConfig.OmnitureTargetDevice + "|create account|reg details";
            $scope.trackOmniture="existing customer3";
            $scope.omnitureReady=[true];
        }
        else {
            Omniture.pageName=RBI.PlatformConfig.OmnitureTargetDevice + "|create account|trial details";
            $scope.trackOmniture="load";
            $scope.omnitureReady=[true];
        }
    }

    var unbindOmniture=$scope.$watch("omnitureReady",function(){
        if($scope.omnitureReady.indexOf(false)<=-1){
            Omniture.Clear();
            if (internetConnected) {
                if ($scope.trackOmniture == "load") {
                    Omniture.Variables.prop1 = RBI.PlatformConfig.OmnitureTargetDevice + "|create account";
                    Omniture.Variables.prop2 = Omniture.pageName;
                    Omniture.Variables.prop3 = Omniture.pageName;
                    Omniture.Variables.eVar54 = "+1";
                    Omniture.Variables.events = ["event9"]
                    Omniture.previousPageName = "";
                    //if(!helper.isUserLoggedIn()){
                    //    Omniture.Variables.events.push("event13");
                    //}
                    Omniture.InvokeOmniture(Omniture.InvokeType.load);
                }
                if ($scope.trackOmniture == "noFreeTrial" || $scope.trackOmniture == "back") {
                    Omniture.Variables.events = ["event29"];
                    var buttonLabel = ($scope.trackOmniture == "noFreeTrial") ? (($scope.hasCreditCardOnFile) ? "No Thanks. Maybe Later." : "I'll just add a credit card to rent or buy movies on demand.") : $scope.backButtonLabel;
                    Omniture.Variables.eVar51 = Omniture.pageName + "|content|" + buttonLabel.toLowerCase();
                    helper.debugLog("eVar51: " + Omniture.Variables.eVar51);
                    Omniture.InvokeOmniture(Omniture.InvokeType.click);
                }
                if ($scope.trackOmniture == "existing customer3") {
                    Omniture.Variables.prop1 = RBI.PlatformConfig.OmnitureTargetDevice + "|create account";
                    Omniture.Variables.prop2 = RBI.PlatformConfig.OmnitureTargetDevice + "|create account|reg details";
                    Omniture.Variables.prop3 = RBI.PlatformConfig.OmnitureTargetDevice + "|create account|reg details";
                    Omniture.Variables.eVar54 = "+1";
                    //if(!helper.isUserLoggedIn()){
                    //    Omniture.Variables.events.push("event13");
                    //}
                    Omniture.InvokeOmniture(Omniture.InvokeType.load);
                }
            }
            $scope.omnitureReady=[false];
        }
    },true);

    if(!RBI.PlatformConfig.OmnitureEnabled){
        unbindOmniture();
    }
    // Omniture end
});