'use strict';
/**
 * Create Account Ctrl to faciliate account creation.
 *
 * @param $scope
 * @param $location
 * @param $routeParams
 * @param customerService
 */

rbi.controller("confirmSubscriptionCtrl", function ($scope, $location, $routeParams, productService, rbiCommonService) {

    //Omniture
    Omniture.pageName = "";

    //Omniture
    var eventHandler = new confirmSubscriptionEventHandler($scope, $location, rbiCommonService);

    $scope.eventHandler = eventHandler;
    $scope.callOmniture = function () {
       if(RBI.PlatformConfig.OmnitureEnabled == true)
        {
            if ($scope.omnitureReady.length > 0 && $scope.omnitureReady.indexOf(false) <= -1) {
                Omniture.Clear();
                if (internetConnected) {
                    if ($scope.trackOmniture[0] == OMNITURE_SUBSCRIPTION.PAGE_LOAD_WITH_FREE_TRIAL) {
                        if ($scope.subscriptionType == FREE_TRIAL) {

                            Omniture.pageName = RBI.PlatformConfig.OmnitureTargetDevice + "|create account|trial welcome";
                            Omniture.Variables.prop1 = RBI.PlatformConfig.OmnitureTargetDevice + "|create account";
                            Omniture.Variables.prop2 = RBI.PlatformConfig.OmnitureTargetDevice + "|create account|trial welcome";
                            Omniture.Variables.prop3 = RBI.PlatformConfig.OmnitureTargetDevice + "|create account|trial welcome";
                            Omniture.Variables.eVar39 = "subscriber";
                            Omniture.Variables.eVar54 = "+1";
                            Omniture.Variables.events = ["event12"];
                        }
                        else {
                            Omniture.pageName = RBI.PlatformConfig.OmnitureTargetDevice + "|create account|reg welcome";
                            Omniture.Variables.prop1 = RBI.PlatformConfig.OmnitureTargetDevice + "|create account";
                            Omniture.Variables.prop2 = RBI.PlatformConfig.OmnitureTargetDevice + "|create account|reg welcome";
                            Omniture.Variables.prop3 = RBI.PlatformConfig.OmnitureTargetDevice + "|create account|reg welcome";
                            Omniture.Variables.eVar39 = "subscriber";
                            Omniture.Variables.eVar54 = "+1";
                            Omniture.Variables.events = ["event22"];
                        }
                        Omniture.InvokeOmniture(Omniture.InvokeType.load);
                    }
                    else if ($scope.trackOmniture[0] == OMNITURE_SUBSCRIPTION.START_WATCH_CLICK) {
                        Omniture.Variables.eVar51 = Omniture.pageName + "|content|start watching";
                        Omniture.InvokeOmniture(Omniture.InvokeType.click);
                    }
                    else if ($scope.trackOmniture[0] == OMNITURE_SUBSCRIPTION.SUBSCRIBE_CLICK) {
                        Omniture.Variables.eVar51 = Omniture.pageName + "|content|subscribe";
                        Omniture.InvokeOmniture(Omniture.InvokeType.click);
                    }
                    else if ($scope.trackOmniture[0] == OMNITURE_SUBSCRIPTION.THUMBNAIL_CLICK) {
                        var index = $scope.levelMap[$scope.LEVEL_IMG].CurrentIndex;
                        var elementID = $scope.LEVEL_IMG + "_" + index;
                        var pid = $("#" + elementID).attr("pid");
                        var movieName = $("#" + elementID).attr("postertitle");
                        // For FT / subscription thumbnail index starts at 3
                        // For no subscription images index starts at 0
                        var thumbnailPos = ($scope.subscriptionType != NO_SUBSCRIPTION) ? index - 2 : index + 1;
                        Omniture.Variables.eVar3 = Omniture.pageName + "|" + movieName + "|hero images";
                        Omniture.Variables.prop12 = Omniture.pageName + "|hero images";
                        Omniture.Variables.products = pid;
                        Omniture.Variables.eVar51 = Omniture.pageName + "|" + "displayed:" + "rw01" + "|c0" + thumbnailPos + "|p00" + thumbnailPos + "|" + movieName.toLowerCase();
                        Omniture.InvokeOmniture(Omniture.InvokeType.click);
                    }
                    else if ($scope.trackOmniture[0] == OMNITURE_SUBSCRIPTION.SHOW_MORE_CLICK) {
                        if ($scope.subscriptionType != NO_SUBSCRIPTION) {
                            Omniture.Variables.eVar51 = Omniture.pageName + "|content|show more subscription";
                        }
                        else {
                            Omniture.Variables.eVar51 = Omniture.pageName + "|content|show more rental";
                        }
                        Omniture.InvokeOmniture(Omniture.InvokeType.click);
                    }
                }
            }
            $scope.omnitureReady[0] = false;
        }
    };
    /**
     * Add button Level
     */
    $scope.LEVEL_BOTTOM = 3;
    $scope.LEVEL_IMG = 2;
    $scope.LEVEL_BUTTONS = 1;

    clearBackPathsSignup();     // Clear the back paths for signup since we do not need them anymore
    $scope.checkDvd = false;
    $scope.Availability = {
        Subscription: 1,
        atBox: 2,
        RentBuy: 3,
        All: 4
    };

    $scope.trackOmniture = [];
    $scope.omnitureReady = [];
    $scope.omnitureReady[0] = false;

    $scope.subscriptionType = NO_SUBSCRIPTION;
    if (rbiCommonService.isSharedItemExist(SUBSCRIPTION_TYPE)) {
        $scope.subscriptionType = rbiCommonService.getSharedItem(SUBSCRIPTION_TYPE);
        rbiCommonService.removeSharedItem(SUBSCRIPTION_TYPE);
    }


    $scope.init = function () {

        switch ($scope.subscriptionType) {
            case FREE_TRIAL:
                $scope.packageDescription = "1 month free and 4 DVD";
                $scope.packageType = "Free Trial";
                break;
            case DVD_SUBSCRIPTION:
                $scope.packageDescription = "4 DVD";
                $scope.packageType = "Subscription";
                break;
            case BLURAY_SUBSCRIPTION:
                $scope.packageDescription = "4 Blu-ray";
                $scope.packageType = "Subscription";
                break;
            default:
                $scope.packageDescription ="";
                $scope.packageType = "Subscription";

        }

        $scope.hasCredits = ($scope.packageDescription != "")? true:false;

        loadFilters();

        // Omniture start
        $scope.trackOmniture[0] = OMNITURE_SUBSCRIPTION.PAGE_LOAD_WITH_FREE_TRIAL;
        $scope.omnitureReady[0] = true;
        $scope.callOmniture();
        // Omniture end
    };
    /**
     * Level map define
     */
    $scope.levelMap = [];
    $scope.CurrentLevelIndex = 1;
    $scope.levelMap[$scope.LEVEL_BUTTONS] = {
        CurrentIndex: 0,
        MaxElements: 1,
        CanHandleRightKey: false,
        CanHandleLefttKey: false,
        FirstElement: 1
    };
    $scope.levelMap[$scope.LEVEL_IMG] = {
        CurrentIndex: 0,
        MaxElements: 3,
        CanHandleRightKey: false,
        CanHandleLefttKey: false,
        FirstElement: 1
    };
    $scope.levelMap[$scope.LEVEL_BOTTOM] = {
        CurrentIndex: 0,
        MaxElements: 2,
        CanHandleRightKey: false,
        CanHandleLefttKey: false,
        FirstElement: 1
    };
    var params = [];

    //This method loads the filters to select EST/KIOSK/SUBSCRIPTION accordingly
    function loadFilters() {
        productService.LoadFilters(RBI.PlatformConfig.deviceType, $routeParams.productType, function (data) {
            $scope.availabilities = productService.Availabilities();
            $scope.sorts = productService.Sorts();

            var ESTID = "";
            var VODID = "";
            var SubscriptionID = "";
            var KioskID = "";

            $scope.titles = null;
            for (var i = 0; i < $scope.availabilities.length; i++) {
                switch ($scope.availabilities[i].name) {
                    case 'Subscription':
                    {
                        SubscriptionID = $scope.availabilities[i].id;
                        break;
                    }

                    case 'Kiosk':
                    {
                        KioskID = $scope.availabilities[i].id;
                        break;
                    }
                    case 'EST':
                    {
                        ESTID = $scope.availabilities[i].id;
                        break;
                    }
                    case 'VOD':
                    {
                        VODID = $scope.availabilities[i].id;
                        break;
                    }
                }
            }

            //when navigated from Subscription screen it opens the Subscription and DVD/Blu-Ray select screen
            if ($scope.subscriptionType != NO_SUBSCRIPTION)  {
                var filterTermSubscription = SubscriptionID;
                var filterTermKiosk = KioskID;
                getTitles("", filterTermSubscription, 1, 3, function (data) {
                    $scope.subscriptionTitles = data.getProducts();
                }, function (data) {
                    helper.showErrorMessage(data, $scope);
                });
                getTitles("", filterTermKiosk, 1, 3, function (data) {
                    $scope.kioskTitles = data.getProducts();
                }, function (data) {
                    helper.showErrorMessage(data, $scope);
                });
            }
            //when navigated from free trial screen it opens the Rent/Buy and subscription select screen
            else {
                var filterTerm = ESTID + ',' + VODID;
                getTitles("", filterTerm, 1, 3, function (data) {
                    $scope.rentTitles = data.getProducts();
                }, function (data) {
                    helper.showErrorMessage(data, $scope);
                });
            }

        }, function (data) {

        });
    }

    //This method brings the list of titles
    function getTitles(search, filter, pageNum, pageSize, successCallBack, failureCallBack) {
        productService.productSearchWithLimitedTitle(search, filter, pageNum, pageSize, $routeParams.productType,
            function (data) {
                //success
                successCallBack(data);

            },
            function (data) {
                // failure
                failureCallBack(data);

            });
    }

    //Navigates to rent/Buy
    $scope.goToShowRentBuy = function () {

        // Omniture start
        $scope.trackOmniture[0] = OMNITURE_SUBSCRIPTION.SHOW_MORE_CLICK;
        $scope.omnitureReady[0] = true;
        $scope.callOmniture();
        // Omniture end

        helper.clearSignupFlags(rbiCommonService);
        rbiCommonService.setSharedItem(BROWSE_FILTER, "rent");
        $location.path("/browse/" + $routeParams.productType);
    };

    //Navigates to subscription
    $scope.goToSubscription = function () {

        // Omniture start
        $scope.trackOmniture[0] = OMNITURE_SUBSCRIPTION.SHOW_MORE_CLICK;
        $scope.omnitureReady[0] = true;
        $scope.callOmniture();
        // Omniture end

        helper.clearSignupFlags(rbiCommonService);
        rbiCommonService.setSharedItem(BROWSE_FILTER, "subscription");
        $location.path("/browse/" + $routeParams.productType);
    };

    //Navigates to home or Player
    $scope.navigateToHome = function () {
        // Omniture start
        $scope.trackOmniture[0] = OMNITURE_SUBSCRIPTION.START_WATCH_CLICK;
        $scope.omnitureReady[0] = true;
        $scope.callOmniture();
        // Omniture end

        // checking playback title URL is enough here.
        // Both of these are removed in the player
        if (rbiCommonService.isSharedItemExist(PLAYBACK_TITLE_URL) && $scope.subscriptionType != NO_SUBSCRIPTION) {
            $location.path(rbiCommonService.getSharedItem(PLAYBACK_TITLE_URL));
        }
        else {
            helper.clearSignupFlags(rbiCommonService);
            $location.path("/home");
        }
    };

    //Navigates to subscription
    $scope.navigateToSubscription = function () {
        // Omniture start
        $scope.trackOmniture[0] = OMNITURE_SUBSCRIPTION.SUBSCRIBE_CLICK;
        $scope.omnitureReady[0] = true;
        $scope.callOmniture();
        // Omniture end

        if (helper.isFreeTrialUsed()) {
            // This case will most likely not occur
            $location.path("/subscribeNoFreeTrial");
        }
        else {
            // since free trial is not used, user automatically gets the free trial
            rbiCommonService.setSharedItem(SUBSCRIPTION_TYPE, FREE_TRIAL);
            $location.path("/subscription");
        }

    };

    $scope.goToTitleDetails = function(title) {
        // Omniture start
        $scope.trackOmniture[0] = OMNITURE_SUBSCRIPTION.THUMBNAIL_CLICK;
        $scope.omnitureReady[0] = true;
        $scope.callOmniture();
        // Omniture end

        helper.clearSignupFlags(rbiCommonService);
        $location.path("/titledetail/" + title.getProductID());
    }

    $scope.showSubscription = function() {
        return ($scope.subscriptionType != NO_SUBSCRIPTION)? true:false;
    };

    $scope.showDVD = function() {
        return ($scope.subscriptionType==FREE_TRIAL||$scope.subscriptionType==DVD_SUBSCRIPTION)? true:false;
    };

    $scope.showBluRay = function() {
        return ($scope.subscriptionType == BLURAY_SUBSCRIPTION)? true:false;
    };

    $scope.init();

    //Tracking Omniture details for the confirm subscription page





});