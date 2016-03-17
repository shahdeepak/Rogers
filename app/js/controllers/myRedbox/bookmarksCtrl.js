/**
 * Bookmarks Controller
 * This controller is responsible for retrieving the bookmarks and
 * displaying the data on the UI.
 */

'use strict';

rbi.controller('bookmarksCtrl', function ($scope, $location, $routeParams, myRedboxService) {

    //Omniture
    Omniture.pageName = "";
    //Omniture

    var LEVEL_MENU = 1;
    var LEVEL_LIST = 2;
    $scope.row=1;

    // Omniture start
    $scope.omnitureReady = [false];
    // Omniture end

    $scope.menuCurrentIndex = 2;
    $scope.PreviousLevelIndex=null;
    $scope.showMainMenu = false;
    $scope.TempCurrentIndex = 5;
    $scope.focusIndex = 0;
    $scope.title_list_margin = 0;
    // offset to increase margin top of MLT
    $scope.top_margin_offset = 110 * 3;

    //offset to increase margin top of MLT
    $scope.top_margin_const_offset = 310;

    //offset to increase margin top of MLT
    $scope.first_page_margin_offset = 30;

    hideMainMenu();

    $scope.helpOverLay = 'hidden';

    var eventHandler = new bookmarksEventHandler($scope, $location, $routeParams);
    sharedScopeWithMenu($scope, $location);
    $scope.CurrentLevelIndex = 1;
    $scope.maxelements = 100;
    $scope.eventHandler = eventHandler;
    $scope.IsMenubarVisible = true;
    $scope.levelMap = [];

    $scope.levelMap[LEVEL_LIST] = {
        CurrentIndex: 0,
        MaxElements: 3,
        CanHandleRightKey: false,
        CanHandleLeftKey: false,
        FirstElement: 1
    };

    $scope.levelMap[LEVEL_MENU] = {
        CurrentIndex: 0,
        MaxElements: 4,
        CanHandleDnKey: false,
        CanHandleUpKey: false,
        FirstElement: 0
    };

    $scope.panes = [
        { title: "DASHBOARD", content: "views/myRedbox/dashboard.html", key: "dashboard" },
        { title: "WATCH HISTORY", content: "views/myRedbox/watchHistory.html", key: "watchHistory", active: true },
        { title: "BOOKMARKS", content: "views/myRedbox/bookmarks.html", key: "bookmarks" },
        { title: "PURCHASES", content: "views/myRedbox/purchases.html", key: "purchases" }
    ];

    if (!helper.isUserLoggedIn()) {
        $location.path('/login/myredbox/bookmarks');

    }

    var popUpKey = 'Error_PopUp';

    myRedboxService.getBookmarks(false, function (bookmarks) {

        $scope.bookmarks = bookmarks;
        $scope.totalBookmarks = bookmarks.length;

        $scope.levelMap[LEVEL_MENU].maxelements = bookmarks.length;

        if ($scope.totalBookmarks > 5) {
            $scope.dropShadowBtm = {display : true};
        }

        if ($scope.totalBookmarks > 0) {
            $scope.CurrentLevelIndex = 2;
        }
        else {
            $scope.CurrentLevelIndex = 1;
            $scope.setMenuFocus('menu_2');
        }

        $scope.top_margin_const_offset = 307;
        $scope.maxelements = $scope.bookmarks.length;
        $scope.totRows=Math.ceil($scope.bookmarks.length/6);
        $scope.eventHandler = eventHandler;
        $scope.IsMenubarVisible = true;
        $scope.levelMap = [];


        $scope.levelMap[LEVEL_LIST] = {
            CurrentIndex: 0,
            MaxElements: $scope.totalBookmarks,
            CanHandleRightKey: false,
            CanHandleLeftKey: false,
            FirstElement: 1
        };

        $scope.levelMap[LEVEL_MENU] = {
            CurrentIndex: 2,
            MaxElements: 4,
            CanHandleDnKey: false,
            CanHandleUpKey: false,
            FirstElement: 0
        };

        if ($scope.totalBookmarks == 0) {
            $scope.currentLevelIndex = 1;

        }
        if ($scope.totalBookmarks > 0) {
            helper.SetFocus('2_0');
        }

        else {
            helper.SetFocus('1_0');
        }

        // Omniture start
        $scope.omnitureReady = [true];
        // Omniture end

    }, function (bookmarks) {
        // error
        helper.showErrorMessage(bookmarks,$scope);
    });

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
        return item.isKiosk == 'Kiosk'; //Kiosk
    };
    //for Badge information of VOD
    $scope.showVOD = function (item) {
        return item.isVOD == 'vod';    //bookmark
    };
    //for Badge information of subscription
    $scope.showSubscription = function (item) {
        return item.isSubscribe == 'Subscription';      //play
    };


    $scope.titleWidth = function (title) {
        var numBadges = getNumBadges(title);
        var width = (numBadges > 0) ? helper.getTitleWidth(IMAGE_POSTER_WIDTH, numBadges, MEDIA_FORMAT_BADGE_WIDTH) : IMAGE_POSTER_WIDTH;
        return width + "px";
    };

    function getNumBadges(title) {
        var numBadges = 0;
        if ($scope.showKiosk(title)) { numBadges++; }
        if ($scope.showSubscription(title)) { numBadges++; }
        if ($scope.showVOD(title)) { numBadges++; }
        return numBadges;
    }

    // Determine if the title needs to scroll
    // The title needs to be selected and overflow the available space
    $scope.scrollTitle = function (isSelected, item) {
        var scroll = false;
        if (isSelected) {
            var numBadges = getNumBadges(item);
            if (helper.needsScroll(item.title, numBadges, false)) {
                scroll = true;
            }
        }
        return scroll;
    };

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
            Omniture.pageName = RBI.PlatformConfig.OmnitureTargetDevice + "|my redbox|bookmarks";
            Omniture.Variables.prop1 = RBI.PlatformConfig.OmnitureTargetDevice + "|my redbox";
            Omniture.Variables.prop2 = RBI.PlatformConfig.OmnitureTargetDevice + "|my redbox|bookmarks"
            Omniture.Variables.prop3 = RBI.PlatformConfig.OmnitureTargetDevice + "|my redbox|bookmarks";
            Omniture.Variables.eVar54 = "+1";
            if (Omniture.previousPageName != "") {
                Omniture.Variables.prop23 = Omniture.previousPageName;
            }

            //TODO: Not part of Top 40 vars
            //s.eVar18* = [number of movies bookmarked]

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

    $scope.omnitureOnItemClick = function (titleSelected) {
        Omniture.Clear();
        if (internetConnected) {
            var title = $scope.bookmarks[titleSelected].title;
            var productID = $scope.bookmarks[titleSelected].productId;
            var thumbnailPos = helper.getThumbnailPosition(titleSelected + 1, 6);

            Omniture.Variables.eVar3 = Omniture.pageName + "|" + title + "|bookmarks";
            Omniture.Variables.prop12 = Omniture.pageName + "|bookmarks";
            Omniture.Variables.products = productID;
            Omniture.Variables.eVar51 = Omniture.pageName + '|' + thumbnailPos + "|" + title;

            helper.debugLog("omnitureOnItemClick:");
            helper.debugLog("eVar3: " + Omniture.Variables.eVar3);
            helper.debugLog("prop12: " + Omniture.Variables.prop12);
            helper.debugLog("products: " + Omniture.Variables.products);
            helper.debugLog("eVar51: " + Omniture.Variables.eVar51);
            Omniture.InvokeOmniture(Omniture.InvokeType.click);
        }
    };

    if(!RBI.PlatformConfig.OmnitureEnabled){
        unbindOmniture();
    }
    // Omniture end
});