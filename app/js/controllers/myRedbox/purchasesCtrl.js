/**
 * purchases Controller
 * This controller is responsible for retrieving the purchases and
 * displaying the data on the UI.
 */

'use strict';

rbi.controller('purchasesCtrl', function ($scope, $location, $routeParams, myRedboxService) {

    //Omniture
    Omniture.pageName = "";

    var LEVEL_MENU = 1;
    var LEVEL_LIST = 2;
    $scope.showMainMenu = false;
    $scope.menuCurrentIndex=3;
    $scope.PreviousLevelIndex =null;
    // Omniture start
    $scope.omnitureReady = [false];
    // Omniture end

    $scope.TempCurrentIndex = 5;
    $scope.focusIndex = 0;
    $scope.title_list_margin = 0;
    $scope.helpOverLay = 'hidden';

    // offset to increase margin top of MLT
    $scope.top_margin_offset = 110 * 3;

    //offset to increase margin top of MLT
    $scope.top_margin_const_offset = 310;

    //offset to increase margin top of MLT
    $scope.first_page_margin_offset = 30;

    hideMainMenu();

    var eventHandler = new purchasesEventHandler($scope, $location, $routeParams);
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
        CurrentIndex: 3,
        MaxElements: 4,
        CanHandleDnKey: false,
        CanHandleUpKey: false,
        FirstElement: 0
    };

    $scope.panes = [
        { title: "DASHBOARD", content: "views/myRedbox/dashboard.html", key: "dashboard", active: true },
        { title: "WATCH HISTORY", content: "views/myRedbox/watchHistory.html", key: "watchHistory" },
        { title: "BOOKMARKS", content: "views/myRedbox/bookmarks.html", key: "bookmarks" },
        { title: "PURCHASES", content: "views/myRedbox/purchases.html", key: "purchases" }
    ];

    if (!helper.isUserLoggedIn()) {
        $location.path('/login/myredbox/purchases');
    }

    var popUpKey = 'Error_PopUp';

    myRedboxService.getPurchases(false, function (purchases) {
        $scope.purchases=[];
        $scope.purchases = purchases;
        $scope.totalPurchases = purchases.length;

        if ($scope.totalPurchases > 5) {
            //$(".drop-shadow-bottom").show();
            $scope.dropShadowBtm = {display : true};
        }

        if($scope.totalPurchases > 0)
            $scope.CurrentLevelIndex = 2;
        else
            $scope.CurrentLevelIndex=1;

        $scope.top_margin_const_offset = 307;
        $scope.maxelements = $scope.purchases.length;
        $scope.eventHandler = eventHandler;
        $scope.IsMenubarVisible = true;
        $scope.levelMap = [];


        $scope.levelMap[LEVEL_LIST] = {
            CurrentIndex: 0,
            MaxElements: $scope.purchases.length,
            CanHandleRightKey: false,
            CanHandleLeftKey: false,
            FirstElement: 1
        };

        $scope.levelMap[LEVEL_MENU] = {
            CurrentIndex: 3,
            MaxElements: 4,
            CanHandleDnKey: false,
            CanHandleUpKey: false,
            FirstElement: 0
        };

        if($scope.totalPurchases > 0) {
            helper.SetFocus('2_0');
        }
        else {
            helper.SetFocus('1_0');
            $scope.setMenuFocus('menu_3');

        }

        // Omniture start
        $scope.omnitureReady = [true];
        // Omniture end

    }, function (purchases) {
        // error
        helper.showErrorMessage(purchases,$scope);
    });

    $scope.setMenuFocus = function (menu_item)
    {
        $('#' + menu_item).addClass("tab-1High");
        $('#' + menu_item).addClass("list-item-img-highlight");

    }


    // Determine if the title needs to scroll
    // The title needs to be selected and overflow the available space
    $scope.scrollTitle = function (isSelected, item) {
        var scroll = false;
        if (isSelected) {
            // no badges on purchases page
            if (helper.needsScroll(item.title, 0, false)) {
                scroll = true;
            }
        }
        return scroll;
       };

       $scope.titleWidth = function (title) { // added to fix ZOE-36125
		// no badges on purchases section grid
       	return "150px";
       };

    // Omniture start
    var unbindOmniture=$scope.$watch("omnitureReady",function(){
        if($scope.omnitureReady.indexOf(false) == -1){
            $scope.omnitureCollectOnLoad();
            $scope.omnitureReady = [false];   // reset for a new page load
        }
    });

    $scope.omnitureCollectOnLoad = function () {
        Omniture.Clear();
        if (internetConnected) {
            Omniture.pageName = RBI.PlatformConfig.OmnitureTargetDevice + "|my redbox|purchases";
            Omniture.Variables.prop1 = RBI.PlatformConfig.OmnitureTargetDevice + "|my redbox";
            Omniture.Variables.prop2 = RBI.PlatformConfig.OmnitureTargetDevice + "|my redbox|purchases"
            Omniture.Variables.prop3 = RBI.PlatformConfig.OmnitureTargetDevice + "|my redbox|purchases";
            Omniture.Variables.eVar54 = "+1";
            if (Omniture.previousPageName != "") {
                Omniture.Variables.prop23 = Omniture.previousPageName;
            }

            //TODO: Not part of Top 40 vars
            //s.eVar20* = [number of movies purchased]

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
            var title = $scope.purchases[titleSelected].title;
            var productID = $scope.purchases[titleSelected].productId;
            Omniture.Variables.eVar3 = Omniture.pageName + "|" + title + "|purchases";
            Omniture.Variables.prop12 = Omniture.pageName + "|purchases";
            Omniture.Variables.products = productID;
            Omniture.Variables.eVar51 = Omniture.pageName + '|content|' + title;

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