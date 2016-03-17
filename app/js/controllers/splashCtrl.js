/**
 * Created with JetBrains WebStorm.
 * User: Vineet-PC
 * Date: 2/8/13
 * Time: 3:31 AM
 * To change this template use File | Settings | File Templates.
 */
var showSplashOnTop = true;
rbi.controller ('splashCtrl', function ($scope, $location, $timeout, loginService) {
    var showEula = platformStorage.getItem ('RBI_EULA_ACCEPTED');
    var timeout = 1000;
    $scope.eventHandler = new SplashEventHandler($scope);
    //helper.hideSpinner(0);

    addVodListeners();

    $scope.showSplash = function () {
        $scope.splash = {display: true};
        showSplashOnTop = true;
    };

    $scope.isDevice = function () {
        if (navigator.userAgent.match (('Factory'))) {
            return true;
        }
        else {
            return false;
        }
    };


    $scope.hideSplash = function () {
        $ ("#splash").delay (timeout - 500).fadeOut (500);
        // Hide the spinner
        if (typeof vod != "undefined") {
            helper.hideSpinner (0);
        }
        $timeout (function () {
            $scope.splash = {display: false};
            if (showEula != null && showEula != undefined) {
                showEula = showEula != 'true' ? $location.path ('/eula/') : $location.path(backPaths[backPaths.length - 1]);
            }
            else {
                $location.path ('/eula/');
            }
        }, timeout);
        showSplashOnTop = false;
    };
    // Note: Enabled for persistent login (ZOE 25525)
    $scope.showSplash ();

    // ZOE-35303: check if upgrade is needed - Samsung only
    if (isDefined(RBI.PlatformConfig.checkAppVersion) && RBI.PlatformConfig.checkAppVersion) {
        var appVersion = helper.getAppVersion();
        helper.debugLog("Current appVersion: " + appVersion);
        
        if(!appVersion){
        	showUpdateRequiredPopup ();
        }else{
        loginService.CheckVersion(appVersion, function(data) {
                var upgradeRequired = data.isMandatory() && data.isUpgradeAvailable();
                helper.debugLog("Update required: " + upgradeRequired);
                if (upgradeRequired) {
                    // show 'Upgrade required' popup'
                    showUpdateRequiredPopup ();
                }
                else {
                    $scope.hideSplash();
                }
            },
            function(data) {
                // Do not show the error message if no data is received from the server
                if (isDefined(data) && isDefined(data.value)) {
                    helper.showErrorMessage(data, $scope, false);
                }
                //TODO: If call fails should we allow the user to use the app?
                $scope.hideSplash();
            });
        }
    }
    else {
        $scope.hideSplash();
    }


    function showUpdateRequiredPopup () {
        var popupKey = "Popup_APP_UPGRADE_REQUIRED";

        popupObj_Meta[popupKey].button_1_click = function () {
            $scope.splash = {display: false};
            // exit the app
            helper.debugLog('Exit app');
            UPGRADE_POP_UP_VISIBLE = false;
            platformInfo.exitApp(KEY_CODES.EXIT);
        };

        popupObj_Meta[popupKey].button_2_click = function () {
            helper.HidePopupBox();
            helper.debugLog('Update app');
            UPGRADE_POP_UP_VISIBLE = false;
            // redirect user to smartHub
        	platformInfo.exitApp(KEY_CODES.CIRCLE);
        };

        UPGRADE_POP_UP_VISIBLE = true;
        helper.ShowPopupBox(popupKey, $scope);
    }

   // Disabled for persistent login (ZOE 25525)
    if (isDefined(RBI.PlatformConfig.userReLogin)) {
        if (helper.isUserLoggedIn()) {
            var username = helper.GetUserId();
            var userPass = helper.GetUserPwd();
            if (username && userPass) {
                //timeout = 10000;
                $scope.showSplash();
                helper.debugLog("Enter splas ctrl");
                loginService.Login(username, userPass, false, function (data) {
                    //$scope.hideSplash ();
                    helper.debugLog("done login service");
                }, function (error) {
                    $scope.hideSplash();
                    helper.debugLog("fail login service");
                    platformStorage.removeItem("isLoggedIn");
                });
            } else {
                platformStorage.removeItem("isLoggedIn");
            }
        } else {
            $scope.showSplash();
            //$scope.hideSplash ();
        }
    }
});
