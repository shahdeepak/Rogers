/**
 * Created with JetBrains WebStorm.
 * User: Vineet-PC
 * Date: 13/8/13
 * Time: 12:27 PM
 * To change this template use File | Settings | File Templates.
 */
var menuMap = ['home', 'browse', 'my redbox', 'search', 'locations', 'account'];
// LG ZOE-34244
var lgBackTitleDetail = false;
var lgBackHome = false;
/**
 * Add a path to the back paths stack
 * @param path
 */
function addToBackPaths(path) {

    var backPathsLen = backPaths.length;
    if (backPaths[backPathsLen - 1] == path)
        return; // prevent duplication

    // ZOE-32241: limit #of entries in the back paths stack
    // clear the back path stack when user comes back to home page
    if (path == '/home') {

        for (var i = 1; i < backPathsLen; i++)  {
            backPaths.pop();
        }
        backPaths[0] = path; // reset the back paths stack
    }
    else {
        if (backPathsLen < MAX_BACK_PATHS_LENGTH) {
            backPaths.push(path);
        }
        else {
            for (var i = 1; i < backPathsLen - 1; i++) {
                backPaths[i] = backPaths[i + 1];  // remove the 2nd entry in the back paths stack (after home page)
            }
            backPaths[backPathsLen] = path;
        }
    }



    helper.debugLog("Add to Back Paths - adding path: " + path);
    helper.debugLog("Back paths stack: " + backPaths);
}

/**
 * Add a path to the back paths stack for signup flow
 * @param path
 */
function addToBackPathsSign(path) {

    if (backPathsSign[backPathsSign.length - 1] == path)
        return; // prevent duplication

    backPathsSign.push(path);
    helper.debugLog("Add to Back Paths sign-up: " + backPathsSign);
}

function checkLogin($location) {
    if (helper.isUserLoggedIn())
        return true;
    else {
        $location.path('/login' + $location.path());
    }
}

function goToPreviousPath($scope, key, $location) {
    if ($location.path() == '/home') return false;

    backPaths.pop(); // lop off the current path

    //Returns to home screen if backpath length is 0
    if (backPaths.length == 0) {
        $location.path("/home");
        return true;
    }

    $location.path(backPaths[backPaths.length - 1]); // go to new last item in array
    refreshMainMenu(backPaths[backPaths.length - 1]); // refresh the menu list items
    return true;
}
function goToPreviousPathSign($location, popBackPaths, rbiCommonService) {

    if (popBackPaths) {
        backPathsSign.pop(); // lop off the current path
    }
    var previousPath = backPathsSign[backPathsSign.length - 1];
    helper.debugLog("Signup flow - goToPreviousPathSign: " + previousPath);
    $location.path(previousPath); // go to new last item in array
    refreshMainMenu(previousPath); // refresh the menu list items

    // if the back paths stack has only one entry in it we are
    if (backPathsSign.length == 1) {
        helper.debugLog("Signup flow - cleaning back paths and signup flags");
        backPathsSign = []; // clean up back paths
        helper.clearSignupFlags(rbiCommonService);
    }
    return true;
}

function popCheckoutBackEntry() {
    if (backPaths[backPaths.length - 1] == '/titleCheckout' || backPaths[backPaths.length - 1] == '/kioskCheckout') {
        backPaths.pop();
    }
}
function popMyredboxBackEntry() {
    if (backPaths[backPaths.length - 1] == '/myredbox/dashboard' || backPaths[backPaths.length - 1] == '/myredbox/watchhistory' || backPaths[backPaths.length - 1] == '/myredbox/purchases' || backPaths[backPaths.length - 1] == '/myredbox/bookmarks') {
        backPaths.pop();
    }
}

function handleMainMenu($scope, key, $location) {
    helper.debugLog("Handling Main Menu");
    var levelID;
    if(helper.isDefined($scope))
    {
        levelID = $scope.CurrentLevelIndex || 1; // to cover other peoples undef's
    }
    // var currentIndex = mainMenuPos;
    var menuId = LEVEL_MENU + "_" + mainMenuMap.curr; // localized..
    var lastMenuId = LEVEL_MENU + "_" + mainMenuMap.last; // localized..
    var currentPath;
    if(helper.isDefined($location))
    {
      currentPath = $location.path();
    }
    // global control for SELECT button
    if (key == KEY_CODES.SELECT) { // menu btn toggle for non-home
        if (currentPath == '/home') // put other exceptions here
            return true;
        if (mainMenuMap.on) {
            hideMainMenu();
            mainMenuMap.on = 0;
        }
        else {
            showMainMenu();
            mainMenuMap.on = 1;
        }
        return true;
    }
    // global control for CIRCLE button BACK!
    else if (key == KEY_CODES.CIRCLE) {
    	if ($scope.showHangOnthere) {
            if ($scope.parentobj.cart == undefined) {
                $scope.parentobj.cart = new RBI.Cart();
            }
            $scope.parentobj.cart.clear();
            $scope.showHangOnthere = false;
            if (mainMenuMap.on) {
            var newPath = menuLocationMap[mainMenuMap.curr] || '/home';
            if (backPaths[backPaths.length - 1] == newPath)
                return true; //no-op on same menu item
            mainMenuMap.last = mainMenuMap.curr;
            mainMenuMap.on = 0;
            helper.RemoveFocus(lastMenuId);
            if (newPath == '/home')
                helper.RemoveFocus(menuId);
            $('#' + lastMenuId).children('div').removeClass("menu-item-selected");
            $('#' + menuId).children('div').addClass("menu-item-selected");
            helper.SetFocus(menuId);

            if (newPath != '/home') {
                hideMainMenu();
            }
            $location.path(newPath); // temp for s2. better to use routeParams, but not passed
            return true;
            }
            if (backPaths[backPaths.length - 1] != '/home') {
                hideMainMenu();
            }
            backPaths.pop();
            $location.path(backPaths[backPaths.length - 1]); 
            return true;
        }
        if (mainMenuMap.on) {
            mainMenuMap.on = 0;
            hideMainMenu();
            return true;
        }

        helper.debugLog(backPaths.join(' - ')); // temp so you all can test. :-)
        goToPreviousPath($scope, key, $location);
        return true;
    }
    else if (mainMenuMap.on) {
        if (key == KEY_CODES.X) {
            OnMenuMouseClick();
        }
        
        if (key == KEY_CODES.DPAD_LEFT || key == KEY_CODES.DPAD_RIGHT) {
            helper.RemoveFocus(menuId);
            var increment = (key == KEY_CODES.DPAD_LEFT) ? -1 : 1;
            mainMenuMap.curr = mainMenuMap.curr + increment;
            if (mainMenuMap.curr < 0)
                mainMenuMap.curr = 5;
            else if (mainMenuMap.curr >= menuLocationMap.length)
                mainMenuMap.curr = 0;

            menuId = LEVEL_MENU + "_" + mainMenuMap.curr;
            helper.SetFocus(menuId);
        }
        if (currentPath == '/home' && key == KEY_CODES.DPAD_UP) {
            helper.RemoveFocus(menuId);
            mainMenuMap.on = 0;
            return false;
        }
        return true;
    }
}

function refreshMainMenu(getpath) {

    numMenuItems = $('.menu-item-ctn').length;
    for (i = 0; i < numMenuItems; i++) {
        helper.RemoveFocus('100_' + i);
    }
    angular.element(document.getElementsByClassName("menu-item")).removeClass('menu-item-selected');

    for (i = 0; i < menuLocationMap.length; i++) {

        if (menuLocationMap[i] == getpath) {
            helper.SetFocus('100_' + i);
            mainMenuMap.curr = i;
            menuId = LEVEL_MENU + "_" + mainMenuMap.curr;
        }
    }

}

function hideMainMenu() {
    var menuAnimationTime;
    try {
        menuAnimationTime = helper.isDefined(RBI.PlatformConfig.menuAnimationTime) ? RBI.PlatformConfig.menuAnimationTime : 400;
    }
    catch (object) {
        menuAnimationTime = 400;
    }
    angular.element(document.getElementById("mask")).scope().mask = { display: false };
    //$("#main-menu-container").stop(true, false).animate({ bottom: -300 }, menuAnimationTime); //added stop parameters to Dequeue fast clicking Select event
    $("#main-menu-container").css({bottom: -300});
    angular.element(document.getElementById("main-menu-return")).scope().mainMenuReturn = { display: true };
    angular.element(document.getElementById("back-button-wrapper")).scope().backBtnWrapper = { display: true };
    angular.element(document.getElementById("menu-button-text-close")).scope().menuBtnTxtClose = { display: false };
    $('#100_0' + ' .menu-item').removeClass('menu-item-selected');
    //document.getElementById("back-button-wrapper").style.visibility = "visible";
    $("#back-button-wrapper").show();
    mainMenuMap.on = 0;
}

function showMainMenu(style) {
    var menuAnimationTime;
    try {
        menuAnimationTime = helper.isDefined(RBI.PlatformConfig.menuAnimationTime) ? RBI.PlatformConfig.menuAnimationTime : 400;
    }
    catch (object) {
        menuAnimationTime = 400;
    }

    angular.element(document.getElementById("main-menu-container")).scope().mainMenuContainer = { display: true };
    angular.element(document.getElementById("back-button-wrapper")).scope().backBtnWrapper = { display: true };
    angular.element(document.getElementById("menu-button-text-close")).scope().menuBtnTxtClose = { display: true };
    $("#menu-button-text-close").removeClass('menu-button-text-close');
    angular.element(document.getElementById("mask")).scope().mask = { display: false };
    //document.getElementById("back-button-wrapper").style.visibility = "collapse";
    $("#back-button-wrapper").hide();
    if (style == 'home') {
        //$('#main-menu-container').stop(true, false).animate({ bottom: 20 }, 100);//added stop parameters to Dequeue fast clicking Select event
        $('#main-menu-container').css({bottom: 20});
        angular.element(document.getElementById("main-menu-return")).scope().mainMenuReturn = { display: false };
        angular.element(document.getElementById("menu-button-text-close")).scope().menuBtnTxtClose = { display: false };

        numMenuItems = $('.menu-item-ctn').length;
        for (i = 0; i < numMenuItems; i++) {
            helper.RemoveFocus('100_' + i);
        }
        angular.element(document.getElementsByClassName("menu-item")).removeClass('menu-item-selected');

        $('#100_0' + ' .menu-item').addClass('menu-item-selected');
        mainMenuMap.curr = 0;
    }
    else {
        angular.element(document.getElementById("menu-button-text-close")).scope().menuBtnTxtClose = { display: true };

        //$('#main-menu-container').delay(400).stop(true, false).animate({ bottom: 315 }, menuAnimationTime);//added stop parameters to Dequeue fast clicking Select event
        $('#main-menu-container').css({bottom: 315});
        angular.element(document.getElementById("mask")).scope().mask = { display: true };
        menuId = LEVEL_MENU + "_" + mainMenuMap.curr;
        helper.SetFocus(menuId)
    }
    mainMenuMap.on = 1;

}
var $scope;
var $location;
function sharedScopeWithMenu(scopeVar, loc) {
    $location = loc;
    $scope = scopeVar;
}

//to handle mouse over effect in LG
function OnMenuMouseOver(id) {
    //to remove menu button focus
    helper.RemoveFocus('menu-button-wrapper');
    if ($scope.currentLevelIndex != undefined && $scope.currentLevelIndex != "100") {
        var removeFocusId = $scope.currentLevelIndex + "_" + $scope.levelMap[$scope.currentLevelIndex].currentIndex;
        helper.RemoveFocus(removeFocusId);
        if ($scope.currentLevelIndex == "0") {
            $('#' + removeFocusId).removeClass("promo-item-ctn-highlight");
        }
    }
    helper.RemoveFocus(LEVEL_MENU + "_" + mainMenuMap.curr);
    //$scope.CurrentLevelIndex = id.split("_")[0];
    //$scope.currentLevelIndex = id.split("_")[0];
    mainMenuMap.curr = parseInt(id.split("_")[1]);
    menuId = LEVEL_MENU + "_" + mainMenuMap.curr;
    helper.SetFocus(id);

}

//to handle mouse click effect in LG
function OnMenuMouseClick(id) {
    var lastMenuId = LEVEL_MENU + "_" + mainMenuMap.last; // localized..
    var menuId = LEVEL_MENU + "_" + mainMenuMap.curr;
    var currentPath = $location.path();

    if (disableHttpSpinner) {
        // ZOE-36062 - enable http spinner
        disableHttpSpinner = false;
    }

    if (RBI.PlatformConfig.OmnitureEnabled) {
        buildOmnitureData(menuMap[mainMenuMap.curr]);
    }
	if (!$scope.showHangOnthere) {
		try {
			var cart = new RBI.Cart().getItems();
			if (cart.length > 0) {
				$scope.showHangOnthere = true;
				$scope.$apply();
				return;
			}
		}
		catch (object) {
		}
	}
    if (isDefined($scope) && isDefined($scope.showHangOnthere) && $scope.showHangOnthere == true) {
        $scope.showHangOnthere = false;
        var productId = platformStorage.getItem("lastVisitTitle");
        //platformStorage.setItem("openKioskCheckoutOnNavigation", true);
        $location.path('/kioskCheckout');
        //if (helper.isDefined($scope.KioskId)) {
        //	$location.path('titledetail/' + productId + '/' + $scope.KioskId);
        //} else {
        //	$location.path('titledetail/' + productId);
        //}
        hideMainMenu();
    }
    else if (helper.isDefined($scope.parentobj) && $scope.parentobj.cart != undefined && $scope.parentobj.cart.pricing != null && $scope.parentobj.cart.pricing.items.length != 0) {
        $scope.showHangOnthere = true;
    }
    else {
        platformStorage.removeItem("openKioskCheckoutOnNavigation");
        platformStorage.removeItem("openTitleCheckoutOnNavigation");
        var newPath = menuLocationMap[mainMenuMap.curr] || '/home';

        //Condition modified because previous condition was to leading to ZOE-31073
        if (backPaths[backPaths.length - 1] == newPath && currentPath == newPath){
            return true; //no-op on same menu item
 } 
		
        if (isDefined(backPaths) && backPaths.length > 0 && backPaths[backPaths.length - 1].match('/browse') && newPath.match('/browse')) {
            newPath = backPaths[backPaths.length - 1];
        }

        var browseFilterData = helper.getStoredBrowseFilters("browseFilter");
        if (isDefined(newPath) && newPath.match("/browse/") && isDefined(browseFilterData) && isDefined(browseFilterData.backPath) &&
            browseFilterData.fromKisokBrowse.toLowerCase() == "no") {


            var backPathToBrowse = "Movie";
            backPathToBrowse = browseFilterData.backPath;

            if (newPath != backPathToBrowse) {
                backPathToBrowse = browseFilterData.backPath;
                newPath = backPathToBrowse;
            }

        }else if(isDefined(newPath) && newPath.match("/browse/") ){
        	   newPath = menuLocationMap[mainMenuMap.curr];
        }
         if (isDefined(currentPath) && currentPath.match("/browse/")) {
        	  	$scope.setBrowseGridState();
          }
        mainMenuMap.last = mainMenuMap.curr;
        mainMenuMap.on = 0;
        helper.RemoveFocus(lastMenuId);
        if (newPath == '/home')
            helper.RemoveFocus(menuId);
        $('#' + lastMenuId).children('div').removeClass("menu-item-selected");
        $('#' + menuId).children('div').addClass("menu-item-selected");
        helper.SetFocus(menuId);

        if (newPath != '/home') {
            hideMainMenu();
        }
	
		if(isDefined($scope.tabsChanged) || $scope.tabsChanged == false){
		    $scope.isLastGame=true;
			}
        $location.path(newPath); // temp for s2. better to use routeParams, but not passed

        //return true;
    }

}
//mouse hover event tracker
function onMouseOver(id) {
    // To remove focus of main menu
	if(mainMenuMap.on){
		helper.RemoveFocus('100_0');
		helper.RemoveFocus('100_1');
		helper.RemoveFocus('100_2');
		helper.RemoveFocus('100_3');
		helper.RemoveFocus('100_4');
		helper.RemoveFocus('100_5');
	}
    helper.RemoveFocus('back-button-wrapper');
    helper.RemoveFocus('menu-button-wrapper');
    $scope.backflag = true;
    $scope.eventHandler.removeBottomButtonFocus();
    helper.SetFocus(id);
}

function onMouseClick(id) {
	if (id == 'back-button-wrapper') {
		if ($location.path() == "/titleCheckout") {
		    $scope.showAbandonCheckout = true;
		    $("#showAbandon").css({
		        display: "block"
		    });
		    helper.RemoveFocus('back-button-wrapper');
		    return;
		}
		if (isDefined($scope.deepSearch) && $scope.deepSearch == "deepsearch") {
			platformInfo.exitApp();
			return;
		} 
        //To remove back button focus
        helper.RemoveFocus('back-button-wrapper');

        //This is special case added to handle Abandon Checkout in KioskChekout page
        if(isDefined($scope.eventHandler.handleKioskChekoutBackButton)){
            $scope.eventHandler.handleKioskChekoutBackButton();
            return;
        }

        // For Free trial page which needs specific Omniture tracking of the back button
        if(isDefined($scope.eventHandler.handleBackButtonFreeTrial)){
            $scope.eventHandler.handleBackButtonFreeTrial();
            return;
        }
        
        if (isDefined($scope.setBrowseGridState)) {
            $scope.setBrowseGridState();
        }
        
        //*** If is checked for HOME - BROWSE - TITLE - LOGIN - BACK
        //*** Else condition checks for HOME - ACCOUNT/REDBOX - LOGIN - BACK
        //adding this code becuase back button is not work on account page.
		 if(backPaths[backPaths.length - 1].match(/title/g)!="title"){
				 try {
					 var cart = new RBI.Cart().getItems();
					 if (cart.length > 0) {
						 $scope.showHangOnthere = true;
						 return;
					 }
				 }
				 catch (object) {
				 }
		   }
        if (isDefined(backPaths) && backPaths.length > 0) {
            for (var i = (backPaths.length - 1); i >= 0; i--) {
                helper.debugLog("i is:" + i);
                if (backPaths[i].indexOf('/login') == -1 && backPaths[i].indexOf('/account') == -1 && backPaths[i].indexOf('/myredbox/dashboard') == -1) {
                    helper.debugLog("----Do NOT POP----" + i);
                    break;
                } else if (backPaths[i].indexOf('/login/account') != -1 || backPaths[i].indexOf('/login/myredbox/dashboard') != -1) {
                    helper.debugLog("----POPPING----" + i);
                    backPaths.pop();
                    break;
                }
            }
        }
        goToPreviousPath($scope, 461, $location); //TODO: why there is a numeric constant here???
    } else if (id == 'menu-button-wrapper') {
        var currentPath = $location.path();
        if (currentPath == '/home') // put other exceptions here
            return true;
        if (mainMenuMap.on) {
            hideMainMenu();
            mainMenuMap.on = 0;
        }
        else {
            showMainMenu();
            mainMenuMap.on = 1;
        }
        $scope.$apply();
    }
}

/**
 * Remove last entry from backPath Array
 */
function popBackPath() {
    if (isDefined(backPaths) && backPaths.length > 0) {
        backPaths.pop();
    }
}

function intializeBackPathSignup (initPath) {
    helper.debugLog("Signup flow - initialized back paths: " + initPath);
    backPathsSign = [initPath];
}

function clearBackPathsSignup () {
    helper.debugLog("Signup flow - cleared back paths");
    backPathsSign = [];  // empty the back path array
}

buildOmnitureData = function (obj) {
    Omniture.Clear();
    if (internetConnected) {
        Omniture.Variables.eVar51 = Omniture.pageName + "|main nav|" + obj;
        Omniture.InvokeOmniture(Omniture.InvokeType.click);
    }
}

OSLogReset();
function enableOSLogConsole(key){
    // bail out keys
    if (key == KEY_CODES.DPAD_LEFT || key == KEY_CODES.DPAD_RIGHT){
        OSLogReset();
        return false;
    }
    // combo solved. take action
    if (mainMenuMap.OSLogTriang > 1 && mainMenuMap.OSLogDown > 2){
        if (key == KEY_CODES.TRIANGLE)
            mainMenuMap.OSLogTriang++;
        if(mainMenuMap.OSLogTriang > 2)
            OSLogUpdate(key);
    }
    // unlock combo
    else if (key == KEY_CODES.DPAD_DOWN && mainMenuMap.OSLogDown == mainMenuMap.OSLogTriang)
        mainMenuMap.OSLogDown++;
    else if (key == KEY_CODES.TRIANGLE && mainMenuMap.OSLogDown > mainMenuMap.OSLogTriang)
        mainMenuMap.OSLogTriang++;
    else
        OSLogReset();

    return true;

}

function OSLogReset(){
    mainMenuMap.OSLogDown = 0;
    mainMenuMap.OSLogTriang = 0;
}

function OSLogUpdate(key){
helper.debugLog("debug level=" + config.debug);
    if (key == KEY_CODES.TRIANGLE){
        config.debug = config.debug < 2 ? 9 : 1;
        screenLog = ["--- On Screen Log! Triangle to close, UP/DOWN arrows to change row count from "
            + config.debug + ", LEFT/RIGHT arrows to escape and use app. ---"];
    }
    if (key == KEY_CODES.DPAD_UP){
        config.debug++;
        helper.debugLog("--- On Screen Log rows increased to " + config.debug + ". ---");
    }
    else if (key == KEY_CODES.DPAD_DOWN){
        config.debug--;
        helper.debugLog("--- On Screen Log rows decreased to " + config.debug + ". ---");
    }
    if (config.debug < 2){
        $('#screenLog').hide();
        return;
    }
    helper.debugLog("OSLogUpdate action complete. Come back to turn off the log from same home menu method.");

}
