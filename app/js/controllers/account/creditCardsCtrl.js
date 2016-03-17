'use strict';
/**
 * Credit card controller
 * This controller is used to manage user credit cards
 *
 * @param $scope
 * @param $location
 * @param $routeParams
 * @param customerService
 */
rbi.controller('creditCardsCtrl',
    function ($scope, $location, $routeParams, customerService, loginService, $dialog, rbiCommonService) {
        //Omniture
        Omniture.pageName = "";
		$scope.omnitureReady[0] = false;
        //Omniture
        var eventHandler = new CreditCardsEventHandler($scope, $location, $routeParams, $dialog);
        $scope.eventHandler = eventHandler;
        sharedScopeWithMenu($scope, $location);

        $scope.selectedTab = 1;
        $scope.selectedCardIndex = 0;
        $scope.cardAccounts = [];
        $scope.isFirstCard = false;
        $scope.totalCards = true;
        $scope.CurrentTabName = "CREDITCARDS";
        $scope.currentIndex=0;

        $scope.levelMap = {};
        $scope.levelMap["23"] = {

            CurrentIndex: 0,
            MaxElements: 11,
            CanHandleDnKey: true,
            CanHandleUpKey: true,
            FirstElement: 0
        };
        $scope.levelMap["24"] = {

            CurrentIndex: 0,
            MaxElements: 1,
            CanHandleDnKey: true,
            CanHandleUpKey: true,
            FirstElement: 0
        };
        $scope.levelMap["2"] = {
            CurrentIndex: 0,
            MaxElements: accountHelper.numPanes,
            CanHandleDnKey: false,
            CanHandleUpKey: false,
            FirstElement: 0
        };

        //$scope.CurrentLevelIndex = "2";
        $scope.panes = [];
        accountHelper.initializePanes($scope);
        $scope.levelMap["2"].CurrentIndex = 1;
		$scope.CurrentLevelIndex = 24;

        //Omniture start
        $scope.trackOmniture = "load";
        Omniture.pageName = RBI.PlatformConfig.OmnitureTargetDevice + "|account|credit cards";
        $scope.omnitureReady[0] = true;
        //Omniture end

        //Remove flag to maintain the credit card flow for new customer
        platformStorage.removeItem(FROM_NEW_ACCT);
        // Calling Get Customer API so that updated details are passed to Get Cards after Add/Update Credit Card.
        customerService.getCustomer(function(data){
            // ZOE-36007: get a fresh list of cards each time credit card view is refreshed
            accountHelper.clearCardData(rbiCommonService);
            customerService.getCards(rbiCommonService,
                function (data) {
                    if (helper.isDefined(data)) {
                        processCards(data);
                    }
                    else {
                        // no cards
                        showNoCards();
                    }
                    $scope.selectedCardIndex = 0;
                    accountHelper.updatePageFocus($scope);
                },
                function (data) {
                    helper.debugLog("Error occurred with GetCards");
                    helper.showErrorMessage(data, $scope);
                    showNoCards();
                    accountHelper.updatePageFocus($scope);
                }
            );
        },function(data){
            /*helper.debugLog("Error occurred with GetCustomer");
             helper.showErrorMessage(data, $scope);
             showNoCards();
             accountHelper.updatePageFocus($scope);*/
        });

        function processCards(data) {
            $scope.cardAccounts = data;
            if (data.length >= 10) {
                $scope.CurrentLevelIndex = 23;
            }
            else {
                if (data.length == 0) {
                    $scope.isFirstCard = true;
                }
                $scope.totalCards = false;
            }

            $scope.levelMap["23"].MaxElements = data.length;

            if (data.length == 1) {
                helper.SetPreferredCard(rbiCommonService, data[0]);
                if (data[0].getIsSubscriptionPrimary()) {
                    helper.SetSubscriptionCard(rbiCommonService, data[0]);
                }
            }
            else {
                helper.DeletePreferredCard(rbiCommonService);
                helper.DeleteSubscriptionCard(rbiCommonService);
                for (var i = 0; i < data.length; i++) {

                    if (data[i].isPreferred()) {
                        helper.SetPreferredCard(rbiCommonService, data[i]);
                    }
                    if (data[i].getIsSubscriptionPrimary()) {
                        helper.SetSubscriptionCard(rbiCommonService, data[i]);
                    }
                }
            }
        }

        //TODO: Discuss error case w. Sateesh
        function showNoCards() {
            $scope.isFirstCard = true;
            $scope.levelMap["23"].MaxElements = 1;
        }


        // Tab click
        $scope.onTabClick = function (tabId) {
            var newPath = accountHelper.onTabClick($scope, tabId);
            $location.path(newPath);
        };

        // Logout
        function logoutCallback() {
            $location.path('/login/account');
            //reset the menu to the last item in backPath which in this will be account - ZOE-22882
            refreshMainMenu(backPaths[backPaths.length - 1]);
            if (!$scope.$$phase) {
                $scope.$apply();
            }
            //$scope.$apply();
        }

        $scope.logoutUser = function () {
            accountHelper.processLogoutUser(loginService, rbiCommonService, logoutCallback);
        };


        $scope.addCard = function () {
            helper.debugLog("addCard called.");
            addToBackPaths($location.path());
            rbiCommonService.setSharedItem("creditCardHome", "/account/creditCards");
            rbiCommonService.setSharedItem("isFirstCard", $scope.isFirstCard);
            $location.path('/account/creditCards/cardDetails/add');
        };

        $scope.modifyCard = function (accountNo) {
            helper.debugLog("modifyCard called. accountNo = " + accountNo);
            addToBackPaths($location.path());
            rbiCommonService.setSharedItem("creditCardHome", "/account/creditCards");
            rbiCommonService.setSharedItem("isFirstCard", $scope.isFirstCard);
            rbiCommonService.setSharedItem("subscriptionReferenceNo", $scope.subscriptionReferenceNo);
            $location.path('/account/creditCards/cardDetails/modify/' + accountNo);
        };


        //Omniture
        var unbindOmniture = $scope.$watch("omnitureReady", function () {
            if ($scope.omnitureReady.indexOf(false) <= -1) {
                Omniture.Clear();
                if (internetConnected) {
                    if ($scope.trackOmniture == "load") {
                        Omniture.Variables.prop1 = RBI.PlatformConfig.OmnitureTargetDevice + "|account";
                        Omniture.Variables.prop2 = Omniture.pageName;
                        Omniture.Variables.prop3 = Omniture.pageName;
                        Omniture.Variables.prop23 = Omniture.previousPageName;
                        Omniture.Variables.eVar54 = "+1";
                        Omniture.InvokeOmniture(Omniture.InvokeType.load);
                    }
                }
                $scope.omnitureReady[0]=false;
            }

        }, true);
        if (!RBI.PlatformConfig.OmnitureEnabled) {
            unbindOmniture();
        }
        //Omniture
    });



