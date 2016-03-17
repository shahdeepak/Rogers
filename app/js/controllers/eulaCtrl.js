'use strict';
/**
 * EULA Controller
 * This class should have the business logic and interacts with the view and
 * the event handler of the eula to get the scrolling of up and down
 */

rbi.controller('eulaCtrl', function ($scope, $dialog, $window, $location, $timeout,rbiCommonService) {

    //Omniture
    Omniture.pageName = RBI.PlatformConfig.OmnitureTargetDevice + "|eula";

    //Omniture

    $scope.startpos = 0;
    $scope.offset = 150;
    $scope.scrollDown = 500;
    $scope.PlayStationType = RBI.PlatformConfig.deviceType;
    $scope.mainMenuContainer = {display : false};
    $scope.mainMenuReturn = {display : false};
    angular.element(document.getElementById("mask")).scope().mask = { display: false }; // this was shown for deep linking so hiding it
    var eventHandler = new EulaEventHandler($scope);
    $scope.currentLevelIndex = 0;
    $scope.eventHandler = eventHandler;
    $scope.levelMap = [];
    $scope.levelMap[0] = {
        currentIndex: 2

    };

    $scope.brand = RBI.PlatformConfig.brand;
    $scope.deviceManufacturer = RBI.PlatformConfig.deviceManufacturer;
    Omniture.pageName = RBI.PlatformConfig.OmnitureTargetDevice + "|eula";
    $scope.hideEula = function(){
        if ($scope.eula.display) {
            $("#eula").delay(500).fadeOut(500);
            setTimeout(function(){
                $scope.eula = { display: false };
                $scope.mainMenuContainer = {display : true};
                $location.path(backPaths[backPaths.length - 1]); // for deep linking
                $scope.$apply();
            },1000);
        }
    };
    $scope.showEula = function(){
        $scope.eula = { display: true };
    };

    try
    {
    $scope.handleEula = function (clickValue) {

        if (clickValue == 'accept') {
            platformStorage.setItem('RBI_EULA_ACCEPTED', 'true');
            // not needed - if this flag is not present it is treated as false
            //platformStorage.setItem(DEVICE_ACTIVE, false);
            $scope.hideEula();
        }
        else {
            //clear the filters for the browse page
            helper.clearLocalStorage("browseFilter");
            helper.clearLocalStorage("browseFilterForKiosk");
            
            //Display exit pop up for Samsung
            if(RBI.PlatformConfig.isExitPopUpRequired){
            	event.preventDefault();
        		helper.showExitPopup(event.keyCode);
        		return;
            }else{
            	platformInfo.exitApp(1); //Exit Handling for PS
            }

        }
    };

    // Check EULA acceptance and popup EULA agreement if not previously accepted
    // read eula flag if it exists
    var eulaAccepted = platformStorage.getItem('RBI_EULA_ACCEPTED');
    if (eulaAccepted == 'true') {
        $scope.hideEula();
    }
    else {
        $scope.showEula();
    }
    }
    catch(exceptionObject)
    {
       helper.showErrorMessage(exceptionObject);
    }
    $scope.omnitureReady = [true];

    //Omniture functionality for the EULA
    var unbindOmniture=$scope.$watch("omnitureReady",function(){
        if($scope.omnitureReady.indexOf(false)<=-1){
            Omniture.Clear();
            if (internetConnected) {
                if (!isDefined(rbiCommonService.getSharedItem(APP_LAUNCHED)))  // check for the entry page
                {
                    // put the logic to fill the variables
                    Omniture.Variables.eVar9 = RBI.PlatformConfig.OmnitureTargetDevice + "";
                    Omniture.Variables.eVar10 = Omniture.getNewRepeat(365);
                    // Omniture.Variables.eVar12 this is not in the top 40 variables

                    Omniture.Variables.eVar39 = "non-recognized"
                }
                if (!isDefined(rbiCommonService.getSharedItem(APP_LAUNCHED))) {
                    rbiCommonService.setSharedItem(APP_LAUNCHED, true);
                }
                // put the logic to fill the variables
                Omniture.Variables.prop1 = RBI.PlatformConfig.OmnitureTargetDevice + "|eula";
                Omniture.Variables.prop2 = RBI.PlatformConfig.OmnitureTargetDevice + "|eula";
                Omniture.Variables.prop3 = RBI.PlatformConfig.OmnitureTargetDevice + "|eula";
                Omniture.Variables.eVar54 = "+1";
                //call the Omniture function
                Omniture.InvokeOmniture(Omniture.InvokeType.load);
            }
        }
    });

    if(!RBI.PlatformConfig.OmnitureEnabled){
        unbindOmniture();
    }
});
