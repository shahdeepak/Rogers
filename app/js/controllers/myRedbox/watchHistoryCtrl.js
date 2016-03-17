/**
 * Watch History Controller
 * Controller for watch history tab view.
 * app path = Home/My Redbox/Dashboard/Watch History
 */

'use strict';

rbi.controller('watchHistoryCtrl',
    function ($scope, $location, $routeParams, $timeout, $http, $route, myRedboxService, ratingReviewService, rbiCommonService) {

        //Omniture
        Omniture.pageName = "";
        $scope.omnitureReady = [false];
        // Omniture end

        $scope.canMoveFocus = false;
        $scope.isLastRecord = false;
        $scope.pageCount = 1;
		$scope.menuCurrentIndex=1;
        $scope.currentLevelIndex = 0;
        $scope.currentIndex = 0;
        $scope.helpOverLay = 'hidden';
        $scope.showMainMenu = false;
        $scope.watchItems = [];
        $scope.isNoItemsInWatchHistory = false;
        $scope.startTime = new Date().getMilliseconds();
        $scope.dataLoaded = false;
        $scope.progressbarStatus = '';
        $scope.canIamDone = true;

        $scope.panes = [
            { title: "DASHBOARD", content: "views/myRedbox/dashboard.html", key: "dashboard" },
            { title: "WATCH HISTORY", content: "views/myRedbox/watchHistory.html", key: "watchhistory" },
            { title: "BOOKMARKS", content: "views/myRedbox/bookmarks.html", key: "bookmarks" },
            { title: "PURCHASES", content: "views/myRedbox/purchases.html", key: "purchases" }
        ];


        var data2 = [];
        $('.wh-items').focus();

        hideMainMenu();

        if (!helper.isUserLoggedIn()) {
            $location.path('/login/myredbox/watchhistory');
        }

        $scope.getWatchHistory = function () {
            try {
                $scope.canMoveFocus = false;
                $scope.dataLoaded = false;
                myRedboxService.getWatchHistory(false, WATCH_HISTORY_PAGESIZE, $scope.pageCount,
                    function (data) {
                        $scope.canMoveFocus = true;
                        $scope.isLastRecord = data.watchHistories == 0 ? true : false;
                        $scope.watchItems.length == 0 ? $scope.watchItems = data.watchHistories : $.merge($scope.watchItems, data.watchHistories);
                        $scope.totalWatchItems = isDefined($scope.totalWatchItems) && $scope.totalWatchItems > 0 ? data.watchHistories.length + $scope.totalWatchItems : data.watchHistories.length;
                        data2 = $scope.watchItems;

                        if($scope.watchItems.length == 0){
                            $scope.isNoItemsInWatchHistory = true;
                        }

                        $scope.dataLoaded = true;
                        setPageSectionFocus();
                        // Omniture start
                        $scope.omnitureReady = [true];
                        // Omniture end
                       
                    },
                    function (data) {
                        $scope.isNoItemsInWatchHistory = true;
                        $scope.canMoveFocus = true;
                        errorPopup(data);
                        $scope.dataLoaded = true;
                    });
            }
            catch (data) {
                $scope.isNoItemsInWatchHistory = true;
                errorPopup(data);
            }
        };

        function setPageSectionFocus() {   // if no items in any section set focus to dashboard menu with
            // dashboard selected
            if ($scope.watchItems.length == 0) {
                $scope.levelMap[0].CurrentIndex = 1;
                $scope.currentLevelIndex = 0;
                $scope.isNoItemsInWatchHistory = true;
            }
            else {   // 1st movie in list title section
                $scope.currentLevelIndex = 1;
                $scope.isNoItemsInWatchHistory = false;
            }
        }

        // adjust red progress bar ...called from view
        $scope.styleRedProgressBar = function (index) {
            $scope.progressbarStatus = (data2[index].watchedProgress < 100)? 'INCOMPLETE': 'COMPLETE';
            return { width: data2[index].progressBarWidth + 'px' };
        };

        $scope.styleRating = function ($index) {

            var convertedRating;
            var pngOffset;
            var whichBackground;

            if (data2[$index].CustomerRating != undefined &&
                data2[$index].CustomerRating != 0
                ) {

                convertedRating = helper.calcAvgUserRating(data2[$index].CustomerRating);
                pngOffset = helper.getAvgUserPngOffset(convertedRating);
                whichBackground = 'url(images/stars-medium-sprite-red.png)';
            }
            else if (data2[$index].AverageUserRating != undefined) {
                convertedRating = helper.calcAvgUserRating(data2[$index].AverageUserRating);
                pngOffset = helper.getAvgUserPngOffset(convertedRating);
                whichBackground = 'url(images/stars-medium-sprite.png)';
            }

            return { "background-position": pngOffset, "background-image": whichBackground };
        };

        $scope.eventHandler = new WatchHistoryEventHandler($scope, $location);
        sharedScopeWithMenu($scope, $location);
        $scope.getWatchHistory();

        $scope.selectedTitleIndex = 0;
        $scope.levelMap = [];

        /* top dashboard level */
        $scope.levelMap[0] = {
            currentIndex: 1,
            maxElements: 3,
            canHandleDnKey: true,
            canHandleUpKey: true,
            firstElement: 1
        };

        /* movie Title level */
        $scope.levelMap[1] = {
            currentIndex: 0,
            maxElements: $scope.totalWatchItems,
            canHandleDnKey: true,
            canHandleUpKey: true,
            firstElement: 1
        };

        /* options popup level */
        $scope.levelMap[2] = {
            currentIndex: 0,
            maxElements: 4,
            canHandleDnKey: false,
            canHandleUpKey: false,
            firstElement: 0
        };

        /* I'm done popup level */
        $scope.levelMap[3] = {
            currentIndex: 0,
            maxElements: 4,
            canHandleDnKey: false,
            canHandleUpKey: false,
            firstElement: 0
        };

        /*  Rate title popup level */
        $scope.levelMap[4] = {
            currentIndex: 0,
            maxElements: 4,
            canHandleDnKey: false,
            canHandleUpKey: false,
            firstElement: 0
        };

        /*  Rate blackout popup level */
        $scope.levelMap[5] = {
            currentIndex: 0,
            maxElements: 0,
            canHandleDnKey: false,
            canHandleUpKey: false,
            firstElement: 0
        };

        // Error popup level
        $scope.levelMap[10] = {
            currentIndex: 0,
            maxElements: 0,
            canHandleDnKey: false,
            canHandleUpKey: false,
            firstElement: 0
        };

        // root popup menu ...home/browse/myredbox/search etc.
        $scope.levelMap[50] = {
            currentIndex: 0,
            maxElements: 0,
            canHandleDnKey: false,
            canHandleUpKey: false,
            firstElement: 0
        };

        $scope.levelMap[100] = {
            currentIndex: 0,
            maxElements: 0,
            canHandleDnKey: false,
            canHandleUpKey: false,
            firstElement: 0
        };

        /* init popup menus */
        $scope.uiFilterPopupOpen = false;
        $scope.uiAreYouSurePopup = false;
        $scope.uiRatePopup = false;
        $scope.uiBlackOutPopup = false;


        /* init watch history movie level */
        $scope.levelMap[1].maxElements = $scope.totalWatchItems;

        //goto to title details page
        $scope.getTitleDetails = function () {
            if (data2[$scope.selectedTitleIndex].BlackoutIndicator == 'TRUE') {
                $scope.uiBlackOutPopup = true;
                $scope.movieTitle = data2[$scope.selectedTitleIndex].Title;
                $scope.popUpTitle = "Title Unavailable";
                $scope.popUpURL = data2[$scope.selectedTitleIndex].URL;
                
                $scope.currentLevelIndex = 5;

            }
            else {
                if (data2[$scope.selectedTitleIndex].ProductID != undefined) {
                    // Omniture start
                    $scope.omnitureOnItemClick($scope.selectedTitleIndex);
                    popMyredboxBackEntry();
                    addToBackPaths($location.path());
                    
                    // Omniture end
                    $location.path("/titledetail/" + data2[$scope.selectedTitleIndex].ProductID);
                }
            }
        };

        $scope.getSelectedTitleRating = function () {

            var rating = data2[$scope.selectedTitleIndex].Rating;
            if (rating == undefined)
                rating = "";

            return rating;
        }

        $scope.showOptionsPopup = function () {
            $scope.popUpURL = data2[$scope.selectedTitleIndex].URL;
            $scope.popUpTitle = data2[$scope.selectedTitleIndex].Title;
            angular.element(document.getElementsByClassName("wh-popup-redbar")).css('width', data2[$scope.selectedTitleIndex].progressBarWidth );
            $scope.canIamDone = (data2[$scope.selectedTitleIndex].watchedProgress < 100 )? true : false;
            $scope.uiFilterPopupOpen = true;
            $scope.popUpRemainingTime = data2[$scope.selectedTitleIndex].RemainingTime;
        };

        $scope.hideOptionsPopup = function () {
            $scope.uiFilterPopupOpen = false;
        };

        $scope.showDonePopup = function () {
            $scope.popUpURL = data2[$scope.selectedTitleIndex].URL;
            $scope.popUpTitle = "Are you sure?";
            $scope.uiAreYouSurePopup = true;
        };

        $scope.hideDonePopup = function () {
            $scope.uiAreYouSurePopup = false;
        };

        $scope.showRatePopup = function () {
            $scope.popUpURL = data2[$scope.selectedTitleIndex].URL;
            $scope.popUpTitle = "Rate this title";
            $scope.numStarsTmp = 0;
            //clear it out first
            for (var j = 0; j < 5; j++) {
            	$('#4_' + j + ' div').removeClass('whHalfStar');
            	$('#4_' + j + ' div').removeClass('whWholeStar');
            }
            setRating();

            $scope.uiRatePopup = true;
        };

        $scope.hideRatePopup = function () {
            $scope.uiRatePopup = false;
            data2[$scope.selectedTitleIndex].isStarInit = false;
        };

        $scope.hideErrorPopup = function () {
            $scope.uiErrorPopup = false;
        };

        $scope.goHome = function () {
            $scope.uiErrorPopup = false;
            $location.path("/home");
        };

        function errorPopup(data) {

            helper.showErrorMessage(data, $scope);
            // $scope.popUpTitle = errorMsg;
            $scope.currentLevelIndex = 10;
            // $scope.uiErrorPopup = true;
        }

        $scope.hideBlackOutPopup = function () {
            $scope.uiBlackOutPopup = false;
        };

        $scope.isSubscriptionTitle = function(title) {
            var isSubscription = (title.PurchaseOptionName.toLowerCase() == RBI.Product.Defines.DELIVERY_TYPE_SUBSCRIPTION.toLowerCase())? true:false;
            return isSubscription;
        }

        $scope.playTitle = function () {

            $scope.currentLevelIndex = 1;
            var whTitle = data2[$scope.selectedTitleIndex];
            var productID = whTitle.ProductID;
            var purchaseOptionID = whTitle.PurchaseOptionID;
            // ZOE 2445 - Find out if the title is HD or SD and pass that information to the player
            var isHD = ($scope.isSubscriptionTitle(whTitle) || (whTitle.FormatType.indexOf(RBI.Product.Defines.MEDIA_FORMAT_TYPE_HD) != -1)) ? true : false;
            rbiCommonService.setSharedItem("HD_ASSET", isHD);
            rbiCommonService.setSharedItem(RATING, whTitle.Rating);
            $location.path('/player/' + productID + '/' + purchaseOptionID); // need

        };

        // ******************************   functions for rating popup

        $scope.stars = ['', '', '', '', ''];   //populate the ng-repeat with 5 elements
		$scope.squares = ['', '', '', '', '', , '', '', '', '', '' ];
        $scope.whNoStarOnOff = true;
        $scope.whHalfStarOnOff = false;
        $scope.whWholeStarOnOff = false;
        $scope.numStarsTmp = 0;

        $scope.cancelRating = function () {
            $scope.numStarsTmp = helper.calcAvgUserRating(data2[$scope.selectedTitleIndex].CustomerRating)
        };

        $scope.increaseRating = function () {

            if ($scope.numStarsTmp < 5)
                $scope.numStarsTmp += 0.5;

            var wholeStars = Math.floor($scope.numStarsTmp / 1);
            for (var i = 0; i < wholeStars; i++) {
                $('#4_' + i + ' div').addClass('whWholeStar');
            }

            if ($scope.numStarsTmp - wholeStars > 0) {
                $('#4_' + i + ' div').addClass('whHalfStar');
            }
        };

        $scope.decreaseRating = function () {
            if ($scope.numStarsTmp > 0)
                $scope.numStarsTmp -= 0.5;

            var ele = (Math.floor($scope.numStarsTmp / 1));
            var wholeStars = Math.floor($scope.numStarsTmp / 1);

            $('#4_' + ele + ' div').removeClass('whWholeStar');
            $('#4_' + ele + ' div').removeClass('whHalfStar');

            if (($scope.numStarsTmp - wholeStars) > 0) {
                $('#4_' + ele + ' div').addClass('whHalfStar');
            }

        };

        $scope.saveRating = function () {

            var rateVal = getRateVal();

            data2[$scope.selectedTitleIndex].CustomerRating = rateVal;
            updateUserRatingInView(rateVal, $scope.selectedTitleIndex, true);

            var params = {
                productID: data2[$scope.selectedTitleIndex].ProductID,
                altCode: data2[$scope.selectedTitleIndex].AltCode,
                rating: rateVal,
                productTitle: data2[$scope.selectedTitleIndex].Title,
                productUrl:"" // not available in watch history data received from the server
            };

            ratingReviewService.RateProduct(params, function (data) {
                    if (data.value.ResultInfo.ResultCode == 0) {
                        helper.debugLog('rateProduct succeeded');
                    }
                    else {
                        helper.debugLog('rateProduct failed');
                    }
                },
                function (data) {
                    errorPopup(data);
                });
        };

        function getRateVal() {
            return ($scope.numStarsTmp * 10);
        }

        function setRating() {
            //if customer has rated this title previously update popup
            if (data2[$scope.selectedTitleIndex].CustomerRating != undefined) {
                var convertedRating = helper.calcAvgUserRating(data2[$scope.selectedTitleIndex].CustomerRating);
                $scope.numStarsTmp = convertedRating;
                var wholeStars = Math.floor(convertedRating / 1);
                var halfStars = convertedRating - wholeStars;
                //clear it out first
                for (var j = 0; j < 5; j++) {
                    $('#4_' + j + ' div').removeClass('whHalfStar');
                    $('#4_' + j + ' div').removeClass('whWholeStar');
                }

                for (var i = 0; i < wholeStars; i++) {
                    $('#4_' + i + ' div').addClass('whHalfStar');
                    $('#4_' + i + ' div').addClass('whWholeStar');
                }
                if (halfStars > 0) { $('#4_' + i + ' div').addClass('whHalfStar'); }
            }
        }

        function updateUserRatingInView(rateVal, selectedIndex, isCustomerRating) {
            var convertedRating = helper.calcAvgUserRating(rateVal);
            var pngOffset = helper.getAvgUserPngOffset(convertedRating);

            if (convertedRating != null && convertedRating != 0) {
                $('#1_' + selectedIndex + " .wh-rating").css('background-image', 'url(images/stars-medium-sprite-red.png)');
                $('#1_' + selectedIndex + " .wh-rating").css('backgroundPosition', pngOffset);
            }
        }

        $scope.moveTitleToBottom = function () {
            var productID = data2[$scope.selectedTitleIndex].ProductID;
            var purchaseOptionID = data2[$scope.selectedTitleIndex].PurchaseOptionID;
            var deviceID = platformInfo.getDeviceID();
            var deviceSpec = RBI.PlatformConfig.deviceSpec;

            //update the db
            myRedboxService.completedWatch(productID, purchaseOptionID, deviceID, deviceSpec, function (data) {
                helper.debugLog('completedWatch success');
                //move movie title item to end of view ng-repeat
                var titleToMove = $scope.watchItems[$scope.selectedTitleIndex];

                // Mark the title as completely watched
                titleToMove.progressBarWidth = RED_LOADING_BAR_WIDTH;
                titleToMove.watchedProgress = 100;
                
                $scope.watchItems.splice($scope.watchItems.indexOf(titleToMove), 1);  //delete from array
                $scope.watchItems.splice($scope.watchItems.length, 0, titleToMove);  //add to bottom of array
            },
                function (data) {
                    helper.debugLog('completedWatch failure');
                }
            );
        }
        // ZOE 24873 - Need to check billing transaction for subscription titles
        $scope.canPlayTitle = function () {
            var canPlayTitle = false;
            if (helper.isDefined(data2[$scope.selectedTitleIndex])) {
                canPlayTitle = data2[$scope.selectedTitleIndex].canPlayTitle;
            }
            return canPlayTitle;
        }

        $scope.isExpired = function (item) {
            return (item.isExpired == 'visible') ? true : false;
        }

        $scope.isTitleExpired = function () {
            var isExpired = false;
            if (helper.isDefined(data2[$scope.selectedTitleIndex])) {
                isExpired = $scope.isExpired(data2[$scope.selectedTitleIndex]);
            }
            return isExpired;
        }

        $scope.isUnavailable = function (item) {
            return (item.isUnavailable == 'visible')? true:false;
        }


        $scope.isTitleUnavailable = function () {
            var isUnavailable = false;
            if (helper.isDefined(data2[$scope.selectedTitleIndex])) {
                isUnavailable = $scope.isUnavailable(data2[$scope.selectedTitleIndex]);
            }
            return isUnavailable;
        }


        // Omniture start
        var unbindOmniture=$scope.$watch("omnitureReady",function(){
            if($scope.omnitureReady.indexOf(false) == -1){
                $scope.omnitureCollectOnLoad();
                $scope.omnitureReady = [false];   // reset for a new page load
            }
        });

        $scope.omnitureCollectOnLoad = function () {
            Omniture.Clear();

            Omniture.pageName = RBI.PlatformConfig.OmnitureTargetDevice + "|my redbox|watch history";
            Omniture.Variables.prop1 = RBI.PlatformConfig.OmnitureTargetDevice + "|my redbox";
            Omniture.Variables.prop2 = RBI.PlatformConfig.OmnitureTargetDevice + "|my redbox|watch history"
            Omniture.Variables.prop3 = RBI.PlatformConfig.OmnitureTargetDevice + "|my redbox|watch history";
            Omniture.Variables.eVar54 = "+1";
            if (Omniture.previousPageName != "") {
                Omniture.Variables.prop23 = Omniture.previousPageName;
            }

            //TODO: Not part of Top 40 vars
            //s.eVar19* = [number of movies purchased]

            helper.debugLog("omnitureOnLoad:");
            helper.debugLog("prop1: " + Omniture.Variables.prop1);
            helper.debugLog("prop2: " + Omniture.Variables.prop2);
            helper.debugLog("prop3: " + Omniture.Variables.prop3);
            helper.debugLog("prop23: " + Omniture.Variables.prop23);
            helper.debugLog("eVar54: " + Omniture.Variables.eVar54);
            Omniture.InvokeOmniture(Omniture.InvokeType.load);
        };


        $scope.omnitureOnTabClick = function (tabIndex) {
            Omniture.Clear();
            Omniture.Variables.eVar51 = Omniture.pageName + "|main nav|" + helper.getMyRedboxTabName(tabIndex);
            helper.debugLog("omnitureOnTabClick:");
            helper.debugLog("eVar51: " + Omniture.Variables.eVar51);
            Omniture.InvokeOmniture(Omniture.InvokeType.click);
        };

        $scope.omnitureOnItemClick = function (titleSelected) {

            var title = $scope.watchItems[titleSelected].Title;
            var productID = $scope.watchItems[titleSelected].ProductID;
            Omniture.Clear();

            Omniture.Variables.eVar3 = Omniture.pageName + "|" + title + "|watch history";
            Omniture.Variables.prop12 = Omniture.pageName + "|watch history";
            Omniture.Variables.products = productID;
            Omniture.Variables.eVar51 = Omniture.pageName + '|content|' + title;
            helper.debugLog("omnitureOnItemClick:");
            helper.debugLog("eVar3: " + Omniture.Variables.eVar3);
            helper.debugLog("prop12: " + Omniture.Variables.prop12);
            helper.debugLog("products: " + Omniture.Variables.products);
            helper.debugLog("eVar51: " + Omniture.Variables.eVar51);
            Omniture.InvokeOmniture(Omniture.InvokeType.click);
        };

        if(!RBI.PlatformConfig.OmnitureEnabled){
            unbindOmniture();
        }
        // Omniture end
    });

