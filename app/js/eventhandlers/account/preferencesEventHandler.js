'use strict';
/**
 * AccountPreferencesEventHandler
 *
 * Event handler for the Preferences tab on account page
 *
 * @author saurabh.sood
 * Refactored by: Peter Rajcani, 11/5/2013
 */
function AccountPreferencesEventHandler($scope, $location, $dialog) {
    this.handleKeyDownEvent = handleKeyDownEvent;
    this.HandleParentalOptionClick = HandleParentalOptionClick;
    this.ChangePreferenceRestriction = ChangePreferenceRestriction;
    this.HandlePreferencesMouseOver = HandlePreferencesMouseOver; // Magic Remote Implementation  mouse over functionality
    this.RestrictCancel = RestrictCancel;
    this.ChangePreference = ChangePreference;
    this.ChangeParentalOption = ChangeParentalOption;
	this.removeBottomButtonFocus = removeBottomButtonFocus;
	this.toggleCaption = toggleCaption;
    $scope.restrictpurchasePopUp = false;
    $scope.restrictcontentPopUp = false;

    // Password popup event handling
    this.pwPopupMouseOver = pwPopupHelper.handleMouseOver;
    this.passwordSubmitClick = passwordSubmitClick;
    this.pwPopupHandleBackKey = pwPopupHandleBackKey;

    var elementId, parentalControlId;

    function handleKeyDownEvent(event) {
        //if any error pop up is visible the key handling logic will be added here
        if (POP_ALERT_BOX_VISIBLE) {
            PopupBox.HandleKeyPress();
            return false;
        }

        var isPopupVisible = POP_ALERT_BOX_VISIBLE || $scope.restrictcontentPopUp || $scope.restrictpurchasePopUp || $scope.uiPWPopup;

        if (!isPopupVisible) {     //Condition added to execute mainmenu only when no popup is visible
            if (handleMainMenu($scope, event.keyCode, $location)) {
                helper.debugLog("Main Menu Handling from Account Event Handler");
                return; // global menu handled, so bail on logic below, or alter here.
            }
        }

        if ($scope.uiPWPopup) {
            return pwPopupHelper.handleKeyEvent(event, passwordSubmitClick, pwPopupHandleBackKey, $scope);
        }

        if ($scope.restrictcontentPopUp || $scope.restrictpurchasePopUp) {
            PopupBox.HandleKeyPress();
            if (event.keyCode == KEY_CODES.CIRCLE) {
                manageFocusAfterClosingPopUp();
            }
        }
        else {
            removeBottomButtonFocus();
            helper.debugLog("Current scope: " + $scope.CurrentLevelIndex);
            if ($scope.CurrentLevelIndex == 2) {
                var handled = accountHelper.handleTabKeyDownEvent(event, $scope);
                if (handled) {
                    return;
                }
            }

            handlePreferencesKeyDownEvent(event);
        }
    }
	
	function removeBottomButtonFocus() {
        accountHelper.removeBottomButtonFocus ($scope);
        if (RBI.PlatformConfig.handleCaptionFromAccount) {  // for CC button
            helper.RemoveFocus('CC');
        }
    }

    // Parental controls popup
    function pwPopupHandleBackKey() {
        pwPopupHelper.handleBackKey($scope);
        manageFocusAfterClosingPopUp();
    }

    function passwordSubmitClick() {
        if ($scope.restrictpurchasePopUp) {
            $scope.checkAccountPassword(RestrictPurchases);
        }
        else {
            $scope.checkAccountPassword(RestrictContent);
        }
    }


    function handlePreferencesKeyDownEvent(event) {
        helper.debugLog("handlePreferencesKeyDownEvent");
        var levelMap = $scope.levelMap;
        var currentIndex = parseInt(levelMap[$scope.CurrentLevelIndex].CurrentIndex);
        var currentFocusedEleId = $scope.CurrentLevelIndex + "_" + currentIndex;
        switch (event.keyCode) {

            case KEY_CODES.X:
            {	
            	if($scope.CurrentLevelIndex == 11){
            		toggleCaption();
            	}
                else {
                    var parentalControlId = $scope.parentalControls.length - currentIndex;
                    ChangePreferenceRestriction(parentalControlId, currentFocusedEleId);
                }
                break;
            }

            case KEY_CODES.DPAD_RIGHT:
            { // Right Arrow
                if ($scope.CurrentLevelIndex == 10 && currentIndex < 3) { // LEVEL_PREFERENCES
                    helper.RemoveFocus(currentFocusedEleId);
                    currentIndex++;
                    $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = currentIndex;
                    accountHelper.updatePageFocus($scope);
                } else if ($scope.CurrentLevelIndex == 10) {
                    helper.RemoveFocus(currentFocusedEleId);
                    $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = 0;
                    accountHelper.updatePageFocus($scope);
                }
                else {
                    $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = 0;
                    accountHelper.updatePageFocus($scope);
                }
                break;
            }

            case KEY_CODES.DPAD_LEFT:
            { // Left Arrow
                if ($scope.CurrentLevelIndex == 10 && currentIndex > 0) { // LEVEL_PREFERENCES
                    helper.RemoveFocus(currentFocusedEleId);
                    currentIndex--;
                    $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = currentIndex;
                    accountHelper.updatePageFocus($scope);
                } else if ($scope.CurrentLevelIndex == 10) {
                    helper.RemoveFocus(currentFocusedEleId);
                    $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = 3;
                    accountHelper.updatePageFocus($scope);
                }
                else {
                    $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = 0;
                    accountHelper.updatePageFocus($scope);
                }
                break;
            }

            case KEY_CODES.DPAD_UP:
            { // Up Arrow
				$("#9_0").removeClass("add-card-btn");
				if ($scope.CurrentLevelIndex == 10 &&  $scope.closedCationEnable) {
					 	helper.RemoveFocus(currentFocusedEleId);
	                    $scope.CurrentLevelIndex = 11;
	                    $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = 0;
	                    $("#CC").addClass("change-button-highlight"); 
				}
				else if ($scope.CurrentLevelIndex == 10 || $scope.CurrentLevelIndex == 11 ) {
					$("#CC").removeClass("change-button-highlight"); 
                    helper.RemoveFocus(currentFocusedEleId);
                    $scope.CurrentLevelIndex = 9;
                    $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = 0;
                    accountHelper.updatePageFocus($scope);
                } else if ($scope.CurrentLevelIndex == 9) {
                    helper.RemoveFocus(currentFocusedEleId);
                    $scope.CurrentLevelIndex = 2;
                    $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = 2;
                    accountHelper.updatePageFocus($scope);
                }
                break;
            }

            case KEY_CODES.DPAD_DOWN:
            { // Down Arrow
				$("#9_0").removeClass("add-card-btn");
				 if ($scope.CurrentLevelIndex == 9 && $scope.closedCationEnable){
					 $scope.CurrentLevelIndex=11;
					 $("#CC").addClass("change-button-highlight"); 
	                  }
				 else if ($scope.CurrentLevelIndex == 9 ||$scope.CurrentLevelIndex == 11 ) {
					 $("#CC").removeClass("change-button-highlight"); 
                    helper.RemoveFocus(currentFocusedEleId);
                	$scope.CurrentLevelIndex = 10;
                    $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = 0;
                    accountHelper.updatePageFocus($scope);
                } else if ($scope.CurrentLevelIndex == 2) {
                    helper.RemoveFocus(currentFocusedEleId);
                    $scope.CurrentLevelIndex = 9;
                    $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = 0;
                    accountHelper.updatePageFocus($scope);
                }
                else {
                    $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = currentIndex;
                    accountHelper.updatePageFocus($scope);
                }
                break;
            }

            case KEY_CODES.SQUARE:
                $scope.logoutUser();
                break;
        }

    }


    function ChangePreference() {
        helper.debugLog("selectedRestrictPurchase: " + $scope.selectedRestrictPurchase);
        //***** We need to set Restrict Purchases ON/OFF. Users should have an option to SET it ON/OFF
        //***** Below will show the Restrict Purchase Pop up on Accept will show the password prompt.
        //***** On successful password match option would set it ON/OFF

        var popupKey = ($scope.selectedRestrictPurchase)? "Popup_RESTRICT_PURCHASE_OFF":"Popup_RESTRICT_PURCHASE";
        ShowRestrictPurchasePopup(popupKey, ShowPasswordPopup);

    }

    function ShowRestrictPurchasePopup(popupkey, funcCallback) {
        popupObj_Meta[popupkey].button_2_click = funcCallback;
        helper.ShowPopupBox(popupkey, $scope);
        $scope.restrictpurchasePopUp = true;
        POP_ALERT_BOX_VISIBLE = false;
    }

    function ShowRestrictContentPopup(funcCallback, elemId) {
        var popupkey = 'Popup_RESTRICT_CONTENT';
        popupObj_Meta[popupkey].button_2_click = funcCallback;
        //helper.debugLog(elemId);
        if (elemId == "10_0") {
            popupObj_Meta[popupkey].msg_text = "&#34;Content Restrictions will be turned OFF&#34;";
        } else if (elemId == "10_1") {
            popupObj_Meta[popupkey].msg_text = "&#34;Requires password for content above PG-13&#34;";
        } else if (elemId == "10_2") {
            popupObj_Meta[popupkey].msg_text = "&#34;Requires password for content above PG&#34;";
        } else if (elemId == "10_3") {
            popupObj_Meta[popupkey].msg_text = "&#34;Requires password for content above G&#34;";
        }
        helper.ShowPopupBox(popupkey, $scope);
        POP_ALERT_BOX_VISIBLE = false;
        $scope.restrictcontentPopUp = true;
    }


    function ShowPasswordPopup() {
        helper.HidePopupBox();
        pwPopupHelper.showPWPopup($scope, HEADER_TEXT, BODY_TEXT);
        POP_ALERT_BOX_VISIBLE = false;
		if (!$scope.$$phase) {
			$scope.$apply();
			$("#password").focus();
		}
    }


    function HandleParentalOptionClick(parentalControlID, elemId) {
        //*** Show restrict content popup
        if ($scope.selectedParentalControl_ELEM_ID != elemId) {
            var funcCallback = function () {
               elementId = elemId;
               parentalControlId = parentalControlID;
                helper.debugLog("parentalControlID: " + parentalControlId + "elementId = " + elementId);
                ShowPasswordPopup();
            };

            switch (elemId) {
                case "10_0":
                {
                    $scope.labelName = $scope.preferenceContentRestrictionButton1;
                    break;
                }
                case "10_1":
                {
                    $scope.labelName = $scope.preferenceContentRestrictionButton2;
                    break;
                }
                case "10_2":
                {
                    $scope.labelName = $scope.preferenceContentRestrictionButton3;
                    break;
                }
                case "10_3":
                {
                    $scope.labelName = $scope.preferenceContentRestrictionButton4;
                    break;
                }
            }
            //Omniture
            $scope.trackOmniture = "contentRest"
            $scope.omnitureReady[0] = true;
            //Omniture
            ShowRestrictContentPopup(funcCallback, elemId);
        }
    }

    function ChangeParentalOption(parentalControlID, elemId) {
        if (elemId != $scope.selectedParentalControl_ELEM_ID) {
            var elements = $("[name=parentalOption]");
            elements.each(function () {
                if ($(this).has("span").length > 0) {
                    $(this).removeClass();
                    $(this).addClass("pref-restrict-item");

                    $('#selectedTick').remove();
                }
            });
            $scope.selectedParentalControl_ELEM_ID = elemId;

            $("#" + elemId).append('<span id="selectedTick" class="icons tick"></span>');

            for (var i = 0; i < $scope.parentalControls.length; i++) {
                if (parentalControlID == $scope.parentalControls[i].key) {
                    $scope.selectedParentalControl = $scope.parentalControls[i];
                    helper.debugLog("parentalControlID: " + parentalControlID + "selected parental control: " + $scope.selectedParentalControl.key);
                    helper.debugLog("parentalControl description: " + $scope.selectedParentalControl.getDescription());
                    helper.SetRestrictContent(JSON.stringify($scope.selectedParentalControl));

                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                    break;
                }
            }
        }
        ;
    }

    function GetParentalControlOptionsCallback(data) {
        try {
            if (data != undefined && data != null && data["ResultInfo"]["ResultCode"] == 0) {
                $scope.parentalControls = data["ParentalControlOptions"];
                helper.SetPreferencesData(JSON.stringify($scope.parentalControls));
                ProcessPreferencesData();

            } else {
                var key;
                if (typeof (data["ResultInfo"]["ResultCode"]) != 'undefined')
                    key = data["ResultInfo"]["ResultCode"];
                else key = 10;
                throw {
                    key: key
                };
            }
        } catch (object) {
            var ExceptionAlertVisible = 1;  //TODO
            helper.ShowAlertBox(object);
        }
    }

    function ProcessPreferencesData() {
        var divItem = "";
        var j = $scope.parentalControls.length;
        var parentalControlID;
        $("#RestrictItemWrap").html('');
        for (var i = 0; i < $scope.parentalControls.length; i++) {
            j--;
            if ($scope.parentalControls[i].Name == 'None') $scope.parentalControls[i].Name = "Off";
            parentalControlID = $scope.parentalControls[i].key;
            $("#RestrictItemWrap").append(divItem);
        }
    }

    function RestrictCancel() {
        helper.HidePopupBox();
    }


    function RestrictContent() {
        manageFocusAfterClosingPopUp();
        ChangeParentalOption(parentalControlId, elementId);
    }

    function RestrictPurchases() {
        manageFocusAfterClosingPopUp();
        $scope.selectedRestrictPurchase = !$scope.selectedRestrictPurchase;
        helper.SetRestrictPurchase($scope.selectedRestrictPurchase);
        $scope.$apply();
    }

    /**
     * Magic Remote Implementation  mouse over functionality
     * @param id
     * @return
     */
    function HandlePreferencesMouseOver(id) {
        helper.debugLog("HandlePreferencesMouseOver, id: " + id);
        $("#9_0").removeClass("add-card-btn");
        removeBottomButtonFocus();
        var currentFocusedEleId = $scope.CurrentLevelIndex + "_" + $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex;
        helper.RemoveFocus(currentFocusedEleId);
        helper.debugLog("removed focus from:" + currentFocusedEleId);

        if (RBI.PlatformConfig.handleCaptionFromAccount) {  // for CC button
            if (id == 'CC') {
                $("#CC").addClass("change-button-highlight");
                return;
            }
            else {
                $("#CC").removeClass("change-button-highlight");
            }
        }

        if (id == "logout-btn") {
            helper.SetFocus(id);
        }
        else {
            var splitElemId = id.split("_");
            $scope.CurrentLevelIndex = parseInt(splitElemId[0]);
            $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex = parseInt(splitElemId[1]);
            currentFocusedEleId = id;
            helper.SetFocus(currentFocusedEleId);
            helper.debugLog("current level index: " + $scope.CurrentLevelIndex + ", current index: " + $scope.levelMap[$scope.CurrentLevelIndex].CurrentIndex);
            helper.debugLog("focused elementID:" + currentFocusedEleId);
        }
    }

    function ChangePreferenceRestriction(parentalControlId, currentFocusedEleId) {
        if ($scope.CurrentLevelIndex == 9) {
            //Omniture
            $scope.trackOmniture = "purchaseRest"
            $scope.omnitureReady[0] = true;
            //Omniture
            setTimeout(ChangePreference, 10);
        }
        else {
            if ($scope.selectedParentalControl_ELEM_ID != currentFocusedEleId) {
                HandleParentalOptionClick(parentalControlId, currentFocusedEleId);
            }
            else {
                accountHelper.updatePageFocus($scope);
            }
        }
    }

    //to manage focus
    function manageFocusAfterClosingPopUp() {

        if ($scope.restrictpurchasePopUp) {
            $scope.restrictpurchasePopUp = false;
            $scope.CurrentLevelIndex = 9;
        }

        if ($scope.restrictcontentPopUp) {
            $scope.restrictcontentPopUp = false;
            $scope.CurrentLevelIndex = 10;
        }
        accountHelper.updatePageFocus($scope);
    }
    
    /**
     * Toggles Closed Caption settings for User
     */
    function toggleCaption(){
    	var userId = helper.GetUserId();
    	
    	if(isDefined(platformStorage.getItem("CC_OPTION_FOR_"+userId))){
			if(platformStorage.getItem("CC_OPTION_FOR_"+userId) == "true"){
				platformStorage.setItem("CC_OPTION_FOR_"+userId,"false");
				$scope.CC_Option = "TURN ON";
				$scope.CC_ON = "CLOSED CAPTION: OFF";
			}else{
				platformStorage.setItem("CC_OPTION_FOR_"+userId,"true");
				$scope.CC_Option = "TURN OFF";
				$scope.CC_ON = "CLOSED CAPTION: ON";
			}
				
		}else{
			platformStorage.setItem("CC_OPTION_FOR_"+userId,"true");
			$scope.CC_Option = "TURN OFF";
			$scope.CC_ON = "CLOSED CAPTION: ON";
		}
    }
}