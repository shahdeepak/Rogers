'use strict';
/**
 * Account controller to manage user subscriptions, preferences and credit cards
 *
 * @param $scope
 * @param $location
 * @param $routeParams
 * @param customerService
 */
rbi.controller('dashboardCtrl',
    function ($scope, $location, $routeParams, myRedboxService, rbiCommonService) {

        //Omniture
        Omniture.pageName = "";

        //Omniture
        helper.showSpinner(config.SPINNER_FADEOUT_MS, config.spinnerPosition);
        disableHttpSpinner = true;

        addToBackPaths($location.path());

        //var LEVEL_MENU = 1;
        var LEVEL_LIST = 2;
        var count = 0;
        $scope.isLoading = 'visible';
        //addToBackPaths($location.path());
        $scope.helpOverLay = 'hidden';
$scope.menuCurrentIndex=0;
        if (platformStorage.getItem("is_Helpoverlayeopen") != "false") {
            $scope.helpOverLay = 'visible';
            // Omniture start
            $scope.omnitureReady = [true];
            // Omniture end
        }
        else {
            $scope.helpOverLay = 'hidden';
            // Omniture start
            $scope.omnitureReady = [false];
            // Omniture end
        }
		$scope.currentIndex  = 0;
        $scope.showGradient = 0;
        $scope.canMoveHighlight = false;
        $scope.titles = [];
        $scope.isDashboardEnd = false;
        $scope.scrollCount = 0;
        $scope.lastLevelIndex = 0;
        $scope.lastLevel= 0;
        $scope.levelMap = new Array();
        $scope.focusIndex = 0;

        $scope.levelMap[1] = {
            CurrentIndex: 0,
            MaxElements: 2,
            CanHandleDnKey: false,
            CanHandleUpKey: false,
            FirstElement: 0
        };

        $scope.TempCurrentIndex = 3;

        $scope.TITLE_LIST_MARGIN = 0;
        // offset to increase margin top of MLT
        $scope.TOP_MARGIN_OFFSET = 340;


        $scope.RemindersLeftMargin = 10;
        $scope.ReminderLeftMarginOffset = 1140;

        //offset to increase margin top of MLT
        $scope.TOP_MARGIN_CONSTANT_OFFSET = 200;

        //offset to increase margin top of MLT
        $scope.FIRST_PAGE_MARGIN_OFFSET = 30;

        if (!helper.isUserLoggedIn()) {
            $location.path('/login/myredbox/dashboard');
            disableHttpSpinner = false;
            return;
        }

        var eventHandler = new dashboardEventHandler($scope, $location, $routeParams);
        sharedScopeWithMenu($scope, $location);
        $scope.CurrentLevelIndex = 1;
        $scope.maxelements = 100;
        $scope.eventHandler = eventHandler;
        $scope.IsMenubarVisible = true;
        $scope.errorMessageShown = false;

        $scope.ImageType = RBI.Product.Defines.POSTER_IMAGE_TYPE;

        var data2 = new Object();
        $scope.panes = [
            { title: "DASHBOARD", content: "views/myRedbox/dashboard.html", key: "dashboard", active: true },
            { title: "WATCH HISTORY", content: "views/myRedbox/watchHistory.html", key: "watchhistory" },
            { title: "BOOKMARKS", content: "views/myRedbox/bookmarks.html", key: "bookmarks" },
            { title: "PURCHASES", content: "views/myRedbox/dashboard.html", key: "dashborad" }
        ];
        $scope.bookmarks = [];
        $scope.reminders = [];
        $scope.watchItems = [];
        $scope.purchases = [];

        var username = "dit1@9.com";
        var password = "123456";

        $scope.height = 230;
        $scope.width = 163;

        hideMainMenu();

        myRedboxService.getRemindersByCustomer(false, function (watchHistory) {
            $scope.reminders = watchHistory;
            $scope.showGradient = Math.floor(watchHistory.length / 6);
            $scope.totalWatchItems = watchHistory.length;
            count++;
            CheckAllServiceCalled();
        }, function (data) {
            count++;
            helper.debugLog("getRemindersByCustomer failure");
            helper.hideSpinner();
            if (!$scope.errorMessageShown) {
                helper.showErrorMessage(data, $scope);
                $scope.errorMessageShown = true;
            }

            CheckAllServiceCalled();
        });

        myRedboxService.getWatchHistory(true, 6, 1, function (watchHistory) {
            $scope.watchItems = watchHistory.watchHistories;
            $scope.totalWatchItems = watchHistory.watchHistories.length;
            data2 = watchHistory.watchHistories;
            count++;
            CheckAllServiceCalled();
        }, function (data) {
            count++;
            $scope.totalWatchItems = 0;
            helper.hideSpinner();
            if (!$scope.errorMessageShown) {
                helper.showErrorMessage(data, $scope);
                $scope.errorMessageShown = true;
            }

            CheckAllServiceCalled();
            helper.debugLog("watchHistoryService.GetWatchHistory failure");
        });

        myRedboxService.getBookmarks(true, function (bookmarks) {
            $scope.bookmarks = bookmarks;
            count++;
            CheckAllServiceCalled();
        }, function (data) {
            // error
            count++;
            helper.debugLog("getBookmarks failure");
            helper.hideSpinner();
            if (!$scope.errorMessageShown) {
                helper.showErrorMessage(data, $scope);
                $scope.errorMessageShown = true;
            }
            CheckAllServiceCalled();
        });

        myRedboxService.getPurchases(true, function (purchases) {
            $scope.purchases = purchases;
            count++;
            CheckAllServiceCalled();
        }, function (data) {
            // error
            count++;
            helper.debugLog("getPurchases failure");
            helper.hideSpinner();
            if (!$scope.errorMessageShown) {
                helper.showErrorMessage(data, $scope);
                $scope.errorMessageShown = true;
            }
            CheckAllServiceCalled();
        });


        $scope.maxelements = 6;
        $scope.eventHandler = eventHandler;
        $scope.IsMenubarVisible = true;

        for (var i = 2; i < 8; i++) {

            $scope.levelMap[i] = {
                CurrentIndex: 0,
                MaxElements: 6,
                CanHandleRightKey: false,
                CanHandleLefttKey: false,
                FirstElement: 1
            };
        }

        function CheckAllServiceCalled() {
            if (count == 4 || $scope.errorMessageShown) {
                helper.hideSpinner();
                setPageSectionFocus();

                $scope.dbNoReminders = ($scope.reminders.length == 0) ? true : false;
                $scope.dbNoWatchHistory = ($scope.watchItems.length == 0) ? true : false;
                $scope.dbNoBookmarks = ($scope.bookmarks.length == 0) ? true : false;
                $scope.dbNoPurchases = ($scope.purchases.length == 0) ? true : false;

                $scope.levelMap[2].MaxElements = $scope.reminders.length;
                $scope.levelMap[3].MaxElements = $scope.watchItems.length;
                $scope.levelMap[4].MaxElements = $scope.bookmarks.length;
                $scope.levelMap[5].MaxElements = $scope.purchases.length;

                $scope.isLoading = 'hidden';
                $scope.canMoveHighlight = true;
                // Omniture start
                $scope.omnitureReady = [true];
                // Omniture end
            }
        }

        function setPageSectionFocus() {   // if no items in any section set focus to dashboard menu with
            // dashboard selected
            if (($scope.reminders.length +
                $scope.watchItems.length +
                $scope.bookmarks.length +
                $scope.purchases.length) == 0) {
               // $scope.setMenuFocus('menu_0');
             //   $('#menu_0').addClass("list-item-img-highlight");
                $scope.levelMap[1].CurrentIndex = 0;
            }
            else if ($scope.reminders.length == 0) {
                //$scope.setMenuFocus('menu_0');
             //   $('#menu_0').addClass("list-item-img-highlight");
                $scope.levelMap[1].CurrentIndex = 0;
            }
            else {
                setTitleFocus();
            }
        }

        function setTitleFocus() {
            if ($scope.reminders.length > 0) {
                $scope.CurrentLevelIndex = 2;
                $scope.focusIndex = 0;
            //    angular.element('#' + $scope.CurrentLevelIndex + 'imgid_' + '0').addClass("list-item-img-highlight");
            }
        }

        $scope.playTitle = function () {
        	var selectedTitle = data2[$scope.currentIndex];
            var productID = selectedTitle.ProductID;
            var purchaseOptionID = selectedTitle.PurchaseOptionID;
            disableHttpSpinner = false;
            // ZOE 24873 - Need to check billing transaction for subscription titles - canPlayTitle flag
            if (selectedTitle.isExpired == "visible" || !selectedTitle.canPlayTitle || selectedTitle.isUnavailable == 'visible') {
                $location.url("/titledetail/" + productID);
            }
            else {
                // ZOE 24445 - Find out if the title is HD or SD and pass that information to the player
                var isSubscription = (selectedTitle.PurchaseOptionName.toLowerCase() == RBI.Product.Defines.DELIVERY_TYPE_SUBSCRIPTION.toLowerCase());
                var isHD = (isSubscription || (selectedTitle.FormatType.indexOf(RBI.Product.Defines.MEDIA_FORMAT_TYPE_HD) != -1)) ? true : false;
                rbiCommonService.setSharedItem(RATING, selectedTitle.Rating);
                rbiCommonService.setSharedItem("HD_ASSET", isHD);
                $location.path('/player/' + productID + '/' + purchaseOptionID); // need
            }

            // Omniture  start
            $scope.omnitureOnItemClick($scope.CurrentLevelIndex, $scope.currentIndex, productID);
            // Omniture end
        };

        $scope.gotoTitleDetails = function () {

            var titleSelected = $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex;
            var productID;
            disableHttpSpinner = false;
            switch ($scope.CurrentLevelIndex) {
                case 2:
                    productID = $scope.reminders[titleSelected].productId;
                    break;
                case 4:
                    productID = $scope.bookmarks[titleSelected].productId;
                    break;
                case 5:
                    productID = $scope.purchases[titleSelected].productId;
                    break;
            }
            // Omniture start
            $scope.omnitureOnItemClick($scope.CurrentLevelIndex, titleSelected, productID);
            // Omniture end
            $location.url("/titledetail/" + productID);
        };


        $scope.isVOD = function (item) {
            return item.isVOD == 'vod' ? "display" : "none";
        };

        $scope.isSubscription = function (item) {
            return item.isSubscribe == 'Subscription' ? "display" : "none";
        };

        $scope.isKiosk = function (item) {
            return item.isKiosk == 'Kiosk' ? "display" : "none";
        };

       

        //for Badge information  of Kiosk
        $scope.showKiosk = function (item) {
            return item.isKiosk == 'Kiosk' ; //Kiosk
        };
        //for Badge information of VOD
        $scope.showVOD = function (item) {
            return item.isVOD == 'vod';    //bookmark
        };
        //for Badge information of subscription
        $scope.showSubscription = function (item) {
            return item.isSubscribe == 'Subscription';      //play
        };
       //for Badge information of dvd
    	$scope.isDvd = function (item) {
    		if (isDefined(item.purchaseOptionType)&& item.purchaseOptionType.toLowerCase().indexOf("dvd") >= 0) {
    			return true;       //dvd
    		}
    		return false;
    	};

    	//for Badge information of blueray
    	$scope.isBluray = function (item) {
    		if (isDefined(item.purchaseOptionType) && item.purchaseOptionType.toLowerCase().indexOf("blu") >= 0) {
    			return true;       //blueray
    		}
    		return false;
    	};

        $scope.titleWidth = function (title) {
            var numBadges = getNumBadges(title);
            var badgeWidth = ($scope.isDvd(title) || $scope.isBluray(title)) ? KIOSK_BADGE_WIDTH : MEDIA_FORMAT_BADGE_WIDTH;
            var width = (numBadges > 0) ? helper.getTitleWidth(IMAGE_POSTER_WIDTH, numBadges, badgeWidth) : IMAGE_POSTER_WIDTH - 5;
            return width + "px";            
        };

        $scope.getReminderWidth = function (title) {
            var numBadges = 0;
            // only need to check DVD and Blu-Ray badges b/c other badging does not apply
            if ($scope.isDvd(title)) numBadges++;
            if ($scope.isBluray(title)) numBadges++;
            var width = (numBadges > 0) ? helper.getTitleWidth(IMAGE_POSTER_WIDTH, numBadges, KIOSK_BADGE_WIDTH) : IMAGE_POSTER_WIDTH;
            return width + "px";
        };

        function getNumBadges(title) {
            var numBadges = 0;
            if ($scope.showKiosk(title)) { numBadges++; }
            if ($scope.showSubscription(title)) { numBadges++; }
            if ($scope.showVOD(title)) { numBadges++; }
            if ($scope.isDvd(title)) { numBadges++; }
            if ($scope.isBluray(title)) { numBadges++; }            
            return numBadges;
        }

        // Determine if the title needs to scroll - bookmarks and purchases
        // The title needs to be selected and overflow the available space
        $scope.scrollTitle = function (isSelected, item, hasBadges) {
            var scroll = false;
            if (isSelected) {
                var numBadges = (hasBadges)? getNumBadges(item):0;
                if (helper.needsScroll(item.title, numBadges, false)) {
                    scroll = true;
                }
            }
            return scroll;
        };

        // for watch history:
        $scope.scrollWHTitle = function (isSelected, title) {
            var scroll = false;
            if (isSelected) {
                if (helper.needsScroll(title, 0, false)) {
                    scroll = true;
                }
            }
            return scroll;
        };

        // reminders
        $scope.scrollReminderTitle = function (isSelected, item) {
            var scroll = false;
            var reminderText = item.reminderText + ' ' + item.reminderDaysLeft;
            if (isSelected) {
                var numBadges = ($scope.showProgressBar(item))? 0:getNumBadges(item);
                if (helper.needsScroll(reminderText, numBadges, true)) {
                    scroll = true;
                }
            }
            return scroll;
        };

        $scope.showProgressBar = function(item) {
            return (item.remiderType == "VOD" ||  item.remiderType == "VOD Expiring")? true:false;
        }

        // Omniture  start
        var unbindOmniture=$scope.$watch("omnitureReady",function(){
            if($scope.omnitureReady.indexOf(false) == -1){
               $scope.omnitureCollectOnLoad();
               $scope.omnitureReady = [false];   // reset for a new page load
            }
        });

        $scope.omnitureCollectOnLoad = function () {
            Omniture.Clear();
            if (internetConnected) {
                Omniture.pageName = RBI.PlatformConfig.OmnitureTargetDevice + "|my redbox|dashboard";
                Omniture.Variables.prop1 = RBI.PlatformConfig.OmnitureTargetDevice + "|my redbox";
                Omniture.Variables.prop2 = RBI.PlatformConfig.OmnitureTargetDevice + "|my redbox|dashboard"
                Omniture.Variables.prop3 = RBI.PlatformConfig.OmnitureTargetDevice + "|my redbox|dashboard";
                Omniture.Variables.eVar54 = "+1";
                if (Omniture.previousPageName != "") {
                    Omniture.Variables.prop23 = Omniture.previousPageName;
                }

                //TODO: Not part of Top 40 vars
//            if ($scope.helpOverLay.toLowerCase() == 'hidden') {
//                s.eVar18* = [number of movies bookmarked]
//                s.eVar19* = [number of movies in the watch history section]
//                s.eVar20* = [number of movies in the purchase history section]
//            }
                helper.debugLog("omnitureOnLoad:");
                helper.debugLog("prop1: " + Omniture.Variables.prop1);
                helper.debugLog("prop2: " + Omniture.Variables.prop2);
                helper.debugLog("prop3: " + Omniture.Variables.prop3);
                helper.debugLog("prop23: " + Omniture.Variables.prop23);
                helper.debugLog("eVar54: " + Omniture.Variables.eVar54);
                Omniture.InvokeOmniture(Omniture.InvokeType.load);
            }
        };

        $scope.omnitureOnTabClick = function (tabIndex) {
            Omniture.Clear();
            if (internetConnected) {
                Omniture.Variables.eVar51 = Omniture.pageName + "|main nav|" + helper.getMyRedboxTabName(tabIndex);
                helper.debugLog("omnitureOnTabClick:");
                helper.debugLog("eVar51: " + Omniture.Variables.eVar51);
                Omniture.InvokeOmniture(Omniture.InvokeType.click);
            }
        };

        function getNumItems(rowIndex) {
            var numItems;
            switch (rowIndex) {
                case 1:
                    numItems = $scope.reminders.length;
                    break;
                case 2:
                    numItems = $scope.watchItems.length;
                    break;
                case 3:
                    numItems = $scope.bookmarks.length;
                    break;
                case 4:
                    numItems = $scope.purchases.length;
                    break;
            }
            return numItems;
        }

        $scope.omnitureOnItemClick = function (currentLevelIndex, titleSelected, productID) {
            if (internetConnected) {
                var section;
                var title;
                var row = currentLevelIndex - 1;
                var col = titleSelected + 1;
                var gridPos = 0;
                var thumbnailPosition = "rw0" + row + "|c0" + col + "|p";
                helper.debugLog("TIM: debug ~ " + currentLevelIndex + " : " + $scope.reminders[titleSelected].title);
                switch (currentLevelIndex) {
                    case 2:
                        section = "reminders";
                        title = $scope.reminders[titleSelected].title;
                        break;
                    case 3:
                        section = "watch history";
                        title = $scope.watchItems[titleSelected].title;
                        break;
                    case 4:
                        section = "bookmarks";
                        title = $scope.bookmarks[titleSelected].title;
                        break;
                    case 5:
                        section = "purchases";
                        title = $scope.purchases[titleSelected].title;
                        break;
                }

                // Find the grid position
                for (var i = 1; i < row; i++) {
                    gridPos += getNumItems(i);
                }
                gridPos += col;
                if (gridPos < 10) {
                    thumbnailPosition += '00' + gridPos;
                }
                else {
                    thumbnailPosition += '0' + gridPos;
                }

                Omniture.Clear();
                Omniture.Variables.eVar3 = Omniture.pageName + "|" + title + "|" + section;
                Omniture.Variables.prop12 = Omniture.pageName + "|" + section;
                Omniture.Variables.products = productID;
                //Link Name:
                //    [pagename]|watch history:|[thumbnail position]|[movie name]
                Omniture.Variables.eVar51 = Omniture.pageName + "|" + section + ":|" + thumbnailPosition + "|" + title;

                helper.debugLog("omnitureOnItemClick:");
                helper.debugLog("eVar3: " + Omniture.Variables.eVar3);
                helper.debugLog("eVar51: " + Omniture.Variables.eVar51);
                helper.debugLog("prop12: " + Omniture.Variables.prop12);
                helper.debugLog("products: " + Omniture.Variables.products);
                Omniture.InvokeOmniture(Omniture.InvokeType.click);
            }
        };

        if(!RBI.PlatformConfig.OmnitureEnabled){
            unbindOmniture();
        }
        // Onmiture end
    });