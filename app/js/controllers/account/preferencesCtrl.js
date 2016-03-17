'use strict';
/**
 * Peferences controller
 * This controller is used to manage user preferences and parental controls
 *
 * @param $scope
 * @param $location
 * @param $routeParams
 * @param customerService
 * @param loginService
 */
rbi.controller('preferencesCtrl',
    function ($scope, $location, $routeParams, customerService, loginService, rbiCommonService, $dialog) {
        //Omniture
        Omniture.pageName = "";
		$scope.omnitureReady[0]=false;
        //Omniture
    	var eventHandler = new AccountPreferencesEventHandler($scope, $location, $dialog);
        $scope.eventHandler = eventHandler;
    	sharedScopeWithMenu($scope, $location);
        $scope.selectedTab = 2;
        $scope.parentalControls = null;
        $scope.selectedParentalControl = null;
        $scope.CurrentTabName = "PREFERENCES";
        $scope.uiPWPopup = false;
        
        //Check for Closed Caption Handling from Account
        if(isDefined(RBI.PlatformConfig.handleCaptionFromAccount) && RBI.PlatformConfig.handleCaptionFromAccount 
        		&& platformInfo.isCCSupportedByDevice()){
        	$scope.closedCationEnable = true;
        	var userId = helper.GetUserId();
        	
        	if(isDefined(platformStorage.getItem("CC_OPTION_FOR_"+userId))){
    			if(platformStorage.getItem("CC_OPTION_FOR_"+userId)=="true"){
    				$scope.CC_ON = "CLOSED CAPTION: ON";
    				$scope.CC_Option = "TURN OFF";
    			}else{
    				$scope.CC_ON = "CLOSED CAPTION: OFF ";
    				$scope.CC_Option = "TURN ON";
    			}
    		}else{
				$scope.CC_ON = "CLOSED CAPTION: OFF ";
				$scope.CC_Option = "TURN ON";
			}
        }
        
        //Preference View Variables
        $scope.preferenceChangeButtonText = "CHANGE";
		//making following changes for ZOE-29692
        $scope.preferenceContentRestrictionButton4 = "Young Children";
        $scope.preferenceContentRestrictionButton3 = "Children";
        $scope.preferenceContentRestrictionButton2 = "Teen";
        $scope.preferenceContentRestrictionButton1 = "Off";

        $scope.levelMap = {};

        $scope.levelMap["9"] = {
            CurrentIndex: 0,
            MaxElements: 1,
            CanHandleDnKey: true,
            CanHandleUpKey: true,
            FirstElement: 0
        };

        $scope.levelMap["10"] = {
            CurrentIndex: 0,
            MaxElements: 4,
            CanHandleDnKey: true,
            CanHandleUpKey: true,
            FirstElement: 0
        };
        $scope.levelMap["11"] = {
                CurrentIndex: 0,
                MaxElements: 1,
                CanHandleDnKey: true,
                CanHandleUpKey: true,
                FirstElement: 0
            };

        $scope.levelMap["23"] = {

            CurrentIndex: 0,
            MaxElements: 11,
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

        $scope.panes = [];
        accountHelper.initializePanes($scope);
        $scope.levelMap["2"].CurrentIndex = 2;
        $scope.CurrentLevelIndex = 9;

        //Omniture start
        $scope.trackOmniture="load";
        Omniture.pageName = RBI.PlatformConfig.OmnitureTargetDevice + "|account|parental controls";
        $scope.omnitureReady[0] = true;
        //Omniture  end

        accountHelper.updatePageFocus($scope);

        // Get parental control options
        customerService.getParentalControlOptions(
            // success callback
            function (parentalControls) {
			//making following changes for ZOE-29692
               var reverseParentalCtrlList = [];
            	helper.debugLog(parentalControls, "getParentalControlOptions Success = " + parentalControls);
            	for (var i = (parentalControls.length - 1); i >= 0; i--) {

            		reverseParentalCtrlList.push(parentalControls[i]);
            	}
                $scope.processParentalControls(reverseParentalCtrlList);
            },
            // Failure callback
            function (data) {
                helper.debugLog("ERROR OCCURRED IN API CALL " + data);
                helper.showErrorMessage(data, $scope);
            }
        );

        $scope.checkAccountPassword = function (checkPasswordCallback) {
            customerService.checkAccountPassword($scope.userPassword,
                function (data) {
                    pwPopupHelper.hidePWPopup($scope);
                    checkPasswordCallback();
                }, function (data) {
                    pwPopupHelper.showPWError($scope);
                });
        };

        $scope.processParentalControls = function (parentalControls) {
            $scope.parentalControls = parentalControls;

            if (isDefined(helper.GetRestrictContent())) {
                var selectedParentalControl = helper.GetRestrictContent();
                var key = selectedParentalControl.key;
                var elemId = parentalControls.length - key;   // parental controls should be in reversed order
                helper.debugLog("Parental control key: " + key + "elemId: " + elemId)
                $scope.eventHandler.ChangeParentalOption(key, "10_" + elemId);
            } else {
                $scope.selectedParentalControl = parentalControls[0];
                $scope.selectedParentalControl_ELEM_ID = "10_0";
                $("#10_0").append('<span id="selectedTick" class="icons tick"></span>');
            }
            if (isDefined(helper.GetRestrictPurchase())) {
                $scope.selectedRestrictPurchase = helper.GetRestrictPurchase();
            } else {
                $scope.selectedRestrictPurchase = false;
            }
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

        // Tab click
        $scope.onTabClick = function (tabId) {
            var newPath = accountHelper.onTabClick($scope, tabId)
            $location.path(newPath);
        };

        $scope.checkPopup = function(){
            $scope.restrictcontentPopUpVisible = false;
            $scope.restrictpurchasePopUpVisible = false;
            $scope.restrictpurchasePopUp = false;
            $scope.restrictcontentPopUp = false;
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
                    if ($scope.trackOmniture == "purchaseRest") {
                        Omniture.Variables.eVar51 = Omniture.pageName + "|set purchase restrictions|" + $scope.preferenceChangeButtonText
                        Omniture.InvokeOmniture(Omniture.InvokeType.click);
                    }
                    if ($scope.trackOmniture == "contentRest") {
                        Omniture.Variables.eVar51 = Omniture.pageName + "|set content restriction|" + $scope.labelName;
                        Omniture.InvokeOmniture(Omniture.InvokeType.click);
                    }
                }
                $scope.omnitureReady[0] = false;
            }

        }, true);
        if(!RBI.PlatformConfig.OmnitureEnabled){
            unbindOmniture();
        }
        //Omniture
    });



