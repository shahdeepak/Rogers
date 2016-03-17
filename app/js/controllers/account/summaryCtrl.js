'use strict';
/**
 * Controller  for the  account summary page
 * This controller is used to manage user subscriptions, preferences and credit cards
 *
 * @param $scope
 * @param $location
 * @param $routeParams
 * @param customerService
 */
rbi.controller('summaryCtrl',
    function ($scope, $location, $routeParams, customerService, loginService, $dialog, rbiCommonService) {
        $scope.renderPage = helper.isUserLoggedIn();

        // If user is not logged in, redirect user to the login page
        if (!helper.isUserLoggedIn()) {
            $location.path('/login/account');
            return;
        }

        //Omniture
        Omniture.pageName = "";
		$scope.omnitureReady[0] = false;
        //Omniture

    	var eventHandler = new AccountSummaryEventHandler($scope, $location);
        $scope.eventHandler = eventHandler;
    	sharedScopeWithMenu($scope, $location);
        $scope.currentCreditBalance = 0;
        $scope.selectedTab = 0;
        $scope.CurrentTabName = 'SUMMARY';
		helper.removeTitleDetailState($scope);

        //TODO: find out where is this flag used
        if(isDefined(platformStorage.getItem("checkouttype")))
            platformStorage.removeItem("checkouttype");

        var customerSubscription;
        var isFreeTrialUsed;
        var aniversaryDate;
        // ZOE-30088 Removed as suggested in issue
        //$scope.nextPaymentText = "Please login to your Account on redboxinstant.com to view billing information";
        hideMainMenu();
        addToBackPaths($location.path());

        $scope.binaryVersion = platformInfo.getFirmware();
        $scope.platform = platformInfo.getPlatform();
        $scope.appVersion = config.appVersion;

        //TODO: refactor level maps
        $scope.levelMap = {};

        $scope.levelMap["2"] = {
            CurrentIndex: 0,
            MaxElements: accountHelper.numPanes,
            CanHandleDnKey: false,
            CanHandleUpKey: false,
            FirstElement: 0
        };

        $scope.CurrentLevelIndex = "2";
        $scope.panes = [];
        accountHelper.initializePanes($scope);

        $scope.initSummaryTab = function () {
            //Omniture
            Omniture.pageName = RBI.PlatformConfig.OmnitureTargetDevice + "|account|personal info"
            //Omniture

            $scope.levelMap["2"].CurrentIndex = 0;
            $scope.isRedboxPolicyOpen=false;
            // To handle scrolling of the privacy policy page
            // TODO: Move this into a separate event handler
            // This code is repeated on 3 other pages - eula, impNotice and title details
            $scope.startpos = 0;
            $scope.offset = 150;
            $scope.scrollDown = 500;
            $scope.maxHeight=15400;     //ZOE-31323
        }

        $scope.trackOmniture="load";
        $scope.initSummaryTab();

        accountHelper.updatePageFocus($scope);

        if (helper.isUserLoggedIn()) {

            var apiFailureCallback = function (data) {
                helper.debugLog("ERROR OCCURRED IN API CALL " + data);
                helper.showErrorMessage(data, $scope);
            }

            customerService.getCustomer(
                function (customer) {
                    helper.debugLog(customer, "getCustomer Success = " + customer);
                    $scope.processCustomer(customer);

                    customerService.getCreditBalance(
                        function (credits) {
                            helper.debugLog(credits, "Available credit balance = " + credits.getTotalCredits());
                            $scope.processCreditBalance(credits);

                            // collect Omniture data after the page is loaded
                            $scope.omnitureReady[0] = true;
                        }, apiFailureCallback);

                },
                apiFailureCallback);
        }


        // Function to process credit balance for the user
        $scope.processCreditBalance = function (credits) {
            if (!isDefined(credits.getTotalCredits()) || credits.getTotalCredits() == 0) {
                helper.debugLog("No Credits available for the user");
                $scope.currentCreditBalance = 0;
            }
            else {
                $scope.currentCreditBalance = credits.getTotalCredits();
            }

            $scope.currentCreditPlural = $scope.currentCreditBalance == 1 ? '' : 's';

            if ($scope.currentCreditBalance < 1) 
                return;
            
            //Evaluate different types of credits
            $scope.credits=[];
            for(var i= 0; i < credits.credits.length; i++){
                var creditPlural = credits.credits[i].value.Quantity == 1 ? "credit":"credits";
                var ExpirationDate = helper.formatDate(credits.credits[i].value.ExpirationDate);
                var creditTypeStr = credits.credits[i].value.CreditType;
                var creditType = "";
                if(creditTypeStr.toLowerCase().indexOf("blu-ray") != -1){
                    creditType = "Blu-ray";
                }else if (creditTypeStr.toLowerCase().indexOf("dvd") != -1){
                    creditType = "DVD";
                }else{
                    creditType = creditTypeStr;
                }
                $scope.credits.push({CreditType:creditType, Quantity:credits.credits[i].value.Quantity, CreditPlural:creditPlural, ExpireDate:ExpirationDate});
            	}

            // Evaluate the Expiration date for user credits
            var creditsAvailable = credits.getCredits();
            var length = creditsAvailable.length;
            var expiry;
            if (length < 2) {
                var ExpirationDate = creditsAvailable[0].getExpirationDate();
                expiry = helper.formatDate(ExpirationDate);
            } else {
                var creditBalance = 0;
                var ExpirationDate;
                for (var index = 0; index < length; index++) {
                    creditBalance = creditBalance
                        + parseInt(creditsAvailable[index].getQuantity());
                    ExpirationDate = creditsAvailable[index].getExpirationDate();
                }
                expiry = helper.formatDate(ExpirationDate);
            }
            $scope.creditsUseBy = expiry;
        };

        //Function to process getCustomer for the user
        $scope.processCustomer = function (customer) {

            //Store the values in the local storage
            $scope.customer = customer;
            //var email = customer.getEmailAddress();
            //helper.SetUserId(email);  // Not needed here - set in login service

            customerSubscription = customer.getSubscription();
            $scope.subscriptionReferenceNo = customer.getSubscriptionBillingAccountReference();
            isFreeTrialUsed = customer.isFreeTrialUsed();

            var s = customer.getBillingServiceAgreementDate() + "";

            if (isDefined(s)) {
                var a = s.split(/[^0-9]/);
                var date = new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
                var month = date.getMonth() + 1;
                if (!isNaN(month)) {
                    aniversaryDate = month + "/" + date.getDate() + "/" + date.getFullYear();
                } else {
                    aniversaryDate = "- / - / - ";
                }
            }

            customerService.getSubscriptions(
                function (subscription) {
                    helper.debugLog("getSubscriptions Success - " + subscription);
                    $scope.processSubscriptions(subscription);
                }, function (subscription) {
                    helper.debugLog("getSubscriptions Fail - " + subscription);
                });

            // ZOE-36007: get a fresh list of cards each time summary controller is called.
            accountHelper.clearCardData(rbiCommonService);
            customerService.getCards(rbiCommonService,
                function (data) {
                    $scope.processSummaryCreditCard(data);
                    accountHelper.updatePageFocus($scope);
                },
                function (data) {
                    helper.debugLog("Error occurred with GetCards");
                    helper.showErrorMessage(data, $scope);
                }

            );
        };

        // Process the Subscriptions and match them with the User subscriptions applicable in his account
        $scope.processSubscriptions = function (subscription) {
            var creditOptions = subscription.getCreditOptions();
            var packages = subscription.getPackages();
            helper.debugLog("creditOptions - " + creditOptions.length + " packages - " + packages.length);
            var packageText = "";
            var totalPrice = 0;
            var packageDesc = "";
            var creditOptionDesc = "";
            $scope.packageText = "";
            if ($scope.customer.value.Subscription.PackageID != null) {
                for (var index = 0; index < creditOptions.length; index++) {
                    var dataCop = creditOptions[index];

                    if (dataCop.getId() == $scope.customer.value.Subscription.CreditOptionID) {
                        if(dataCop.getName() == "DVDs"){
                            packageText += "4 DVD Credits " + "+ ";
                        }
                        else if(dataCop.getName() == "Blu-rays"){
                            packageText += "4 Blu-ray™ & DVD Credits " + "+ ";
                        }
                        creditOptionDesc = dataCop.getDescription();
                    }
                }

                for (var index = 0; index < packages.length; index++) {
                    var dataPkg = packages[index];

                    if (dataPkg.getId() == $scope.customer.value.Subscription.PackageID) {
                        if(dataPkg.getName() == "Unlimited Streaming") {
                            packageText += "Streaming Library of Hits";
                            packageDesc = dataPkg.getDescription();
                        }

                    }
                }

                $scope.packageText = packageText;

            } else if ($scope.customer.isSubscriptionCancelled() == "true") {
                $scope.lastPaymentText = "Subscription Cancelled";
                // Check if we need to show the subscription button
            } else if ($scope.customer.isFreeTrialUsed() == "true") {
                $scope.lastPaymentText = "Subscription Cancelled";
                // Show Make changes button if valid
            } else {
                $scope.lastPaymentText = "You have no billing activity";
            }

            rbiCommonService.setSharedItem("SUBSCRIPTION",$scope.packageText);
        };


        $scope.processSummaryCreditCard = function (cardAccounts) {
            var length = cardAccounts.length;
            if (isDefined($scope.subscriptionReferenceNo)) {
                for (var index = 0; index < length; index++) {
                    var card = cardAccounts[index];
                    if (card.getAccountNumber() == $scope.subscriptionReferenceNo) {
                        $scope.lastPaymentText = "Last payment charged on " + aniversaryDate + " to credit card ending " + card.getLastFour();
                        //
                        var s = $scope.customer.getSubscriptionAnniversaryDate() + "";
                        if (null == s || "" == s) break; // user has credit card but no subscription
                        var a = s.split(/[^0-9]/);
                        var aniv_date = new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
                        var month = aniv_date.getMonth() + 1;
                        var year = aniv_date.getFullYear();
                        //TODO: Review requirements to check if this needs to be added
                        //$scope.nextPaymentText = "Next scheduled payment on " + month + "/" + aniv_date.getDate() + "/" + year;
                    }
                }
            }
        };

        // Tab click
        $scope.onTabClick = function (tabId) {
            var newPath = accountHelper.onTabClick($scope, tabId)
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
        }

        //Omniture
        var unbindOmniture = $scope.$watch("omnitureReady", function () {
            if ($scope.omnitureReady.indexOf(false) <= -1) {
                Omniture.Clear();
                if (internetConnected) {
                    Omniture.Variables.prop1 = RBI.PlatformConfig.OmnitureTargetDevice + "|account";
                    Omniture.Variables.prop2 = Omniture.pageName;
                    Omniture.Variables.prop3 = Omniture.pageName;
                    Omniture.Variables.prop23 = Omniture.previousPageName;
                    Omniture.Variables.eVar54 = "+1";
                    Omniture.InvokeOmniture(Omniture.InvokeType.load);
                }
                $scope.omnitureReady[0] = false;
            }
        }, true);

        if (!RBI.PlatformConfig.OmnitureEnabled) {
            unbindOmniture();
        }
        //Omniture
    });



